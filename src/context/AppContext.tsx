import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User, Mission, Lesson, Submission, LeaderboardEntry,
  AuthCredentials, SignUpData, GpsCoords,
} from '../types';
import { Storage } from '../services/storage';
import { AuthService, DemoOtpSession } from '../services/auth';
import { INITIAL_USER } from '../services/mockData';
import { calculateLevel } from '../services/xpService';
import { recalculateLeaderboard } from '../services/leaderboardService';

interface CelebrationData { title: string; xp: number; }

export interface ProofSubmitData {
  missionId: string;
  mediaType: 'photo' | 'video';
  beforePhotoDataUrl: string; // captured live from camera
  afterPhotoDataUrl: string;  // captured live from camera
  videoUrl?: string;          // optional video capture
  location: string;
  gpsCoords?: GpsCoords;
  notes?: string;
}

interface AppContextType {
  currentUser: User;
  isAuthenticated: boolean;
  completedMissionIds: Set<string>;
  login: (c: AuthCredentials) => Promise<{ success: boolean; error?: string }>;
  startRegistration: (d: SignUpData) => Promise<{ success: boolean; session?: DemoOtpSession; error?: string }>;
  verifyAndCreateAccount: (session: DemoOtpSession, otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  missions: Mission[];
  lessons: Lesson[];
  submissions: Submission[];
  leaderboard: LeaderboardEntry[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeMissionDetail: Mission | null;
  setActiveMissionDetail: (m: Mission | null) => void;
  activeMissionProof: Mission | null;
  setActiveMissionProof: (m: Mission | null) => void;
  celebration: CelebrationData | null;
  dismissCelebration: () => void;
  completeMissionProof: (data: ProofSubmitData) => Promise<number>;
  completeLessonQuiz: (lessonId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const s = AuthService.getCurrentSession();
    return s ?? Storage.getUser() ?? INITIAL_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => AuthService.getCurrentSession() !== null
  );

  const [completedMissionIds, setCompletedMissionIds] = useState<Set<string>>(() => {
    const user = AuthService.getCurrentSession() ?? Storage.getUser();
    const fromUser = new Set<string>(user?.completedMissionIds ?? []);
    const fromStorage = Storage.getCompletedMissionIds();
    return new Set([...fromUser, ...fromStorage]);
  });

  const [missions, setMissions] = useState<Mission[]>(() => Storage.getMissions());
  const [lessons, setLessons] = useState<Lesson[]>(() => Storage.getLessons());
  const [submissions, setSubmissions] = useState<Submission[]>(() => Storage.getSubmissions());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() =>
    recalculateLeaderboard(currentUser)
  );

  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeMissionDetail, setActiveMissionDetail] = useState<Mission | null>(null);
  const [activeMissionProof, setActiveMissionProof] = useState<Mission | null>(null);
  const [celebration, setCelebration] = useState<CelebrationData | null>(null);

  // Sync leaderboard whenever currentUser xp, missions or avatar changes
  useEffect(() => {
    const updated = recalculateLeaderboard(currentUser);
    setLeaderboard(updated);
  }, [currentUser.xp, currentUser.missionsCompleted, currentUser.avatar, currentUser.name]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#059669', '#FBBF24']
      });
    } catch {
      /* ignore */
    }
  };

  const dismissCelebration = () => setCelebration(null);

  const login = async (c: AuthCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const user = await AuthService.login(c);
      setCurrentUser(user);
      setIsAuthenticated(true);
      const ids = new Set<string>(user.completedMissionIds ?? []);
      setCompletedMissionIds(ids);
      setActiveTab('dashboard');
      triggerConfetti();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message ?? 'Login failed.' };
    }
  };

  const startRegistration = async (
    d: SignUpData
  ): Promise<{ success: boolean; session?: DemoOtpSession; error?: string }> => {
    try {
      const session = await AuthService.startRegistration(d);
      return { success: true, session };
    } catch (err: any) {
      return { success: false, error: err.message ?? 'Registration failed.' };
    }
  };

  const verifyAndCreateAccount = async (
    session: DemoOtpSession,
    otp: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const user = await AuthService.verifyAndCreateAccount(session, otp);
      setCurrentUser(user);
      setIsAuthenticated(true);
      setCompletedMissionIds(new Set());
      setActiveTab('dashboard');
      setCelebration({ title: `Welcome to EcoQuest, ${user.name}! 🌱`, xp: 50 });
      triggerConfetti();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message ?? 'Verification failed.' };
    }
  };

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setCurrentUser(INITIAL_USER);
    setCompletedMissionIds(new Set());
    setActiveTab('home');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    const updated: User = { ...currentUser, ...updates };
    setCurrentUser(updated);
    Storage.saveUser(updated);
    AuthService.updateUser(updated);
  };

  // Complete mission with strict idempotency
  const completeMissionProof = async (data: ProofSubmitData): Promise<number> => {
    const mission = missions.find(m => m.id === data.missionId);
    if (!mission) return 0;

    const alreadyCompleted = completedMissionIds.has(mission.id);
    const xpToAward = alreadyCompleted ? 0 : mission.xpReward;

    const now = new Date();
    const ts =
      now.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' IST';

    const newSub: Submission = {
      id: 'sub-' + Date.now(),
      missionId: mission.id,
      missionTitle: mission.title,
      mediaType: data.mediaType,
      beforePhoto: data.beforePhotoDataUrl,
      afterPhoto: data.afterPhotoDataUrl,
      videoUrl: data.videoUrl,
      location: data.location,
      gpsCoords: data.gpsCoords,
      timestamp: ts,
      notes: data.notes,
      status: 'verified',
      xpEarned: xpToAward,
      verifiedAt: now.toISOString()
    };

    const updatedSubs = [newSub, ...submissions];
    setSubmissions(updatedSubs);
    Storage.saveSubmissions(updatedSubs);

    // Update mission completions count
    const updatedMissions = missions.map(m =>
      m.id === mission.id ? { ...m, completions: m.completions + 1 } : m
    );
    setMissions(updatedMissions);
    Storage.saveMissions(updatedMissions);

    if (!alreadyCompleted) {
      const newIds = new Set([...completedMissionIds, mission.id]);
      setCompletedMissionIds(newIds);
      Storage.saveCompletedMissionIds(newIds);

      const extraWaste =
        mission.category === 'Cleanup' || mission.category === 'Recycling' ? 2.5 : 0;
      const extraTree = mission.category === 'Planting' ? 1 : 0;
      const newXp = currentUser.xp + xpToAward;
      const levelInfo = calculateLevel(newXp);

      const updatedUser: User = {
        ...currentUser,
        xp: newXp,
        level: levelInfo.level,
        levelTitle: levelInfo.title,
        missionsCompleted: currentUser.missionsCompleted + 1,
        streak: currentUser.streak + 1,
        wasteCollectedKg: Math.round((currentUser.wasteCollectedKg + extraWaste) * 10) / 10,
        treesPlanted: currentUser.treesPlanted + extraTree,
        volunteerHours: currentUser.volunteerHours + 1,
        completedMissionIds: Array.from(newIds)
      };

      setCurrentUser(updatedUser);
      Storage.saveUser(updatedUser);
      AuthService.updateUser(updatedUser);

      setCelebration({ title: `Mission Verified: ${mission.title}`, xp: xpToAward });
      triggerConfetti();
    }

    return xpToAward;
  };

  // Complete lesson quiz with strict idempotency
  const completeLessonQuiz = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson || lesson.isCompleted) return;

    const xp = lesson.xpReward;
    const updatedLessons = lessons.map(l => (l.id === lessonId ? { ...l, isCompleted: true } : l));
    setLessons(updatedLessons);
    Storage.saveLessons(updatedLessons);

    const newXp = currentUser.xp + xp;
    const levelInfo = calculateLevel(newXp);

    const updatedUser: User = {
      ...currentUser,
      xp: newXp,
      level: levelInfo.level,
      levelTitle: levelInfo.title,
      learningCompleted: currentUser.learningCompleted + 1
    };

    setCurrentUser(updatedUser);
    Storage.saveUser(updatedUser);
    AuthService.updateUser(updatedUser);

    setCelebration({ title: `Lesson Mastered: ${lesson.title}`, xp });
    triggerConfetti();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        completedMissionIds,
        login,
        startRegistration,
        verifyAndCreateAccount,
        logout,
        updateUserProfile,
        missions,
        lessons,
        submissions,
        leaderboard,
        activeTab,
        setActiveTab,
        activeMissionDetail,
        setActiveMissionDetail,
        activeMissionProof,
        setActiveMissionProof,
        celebration,
        dismissCelebration,
        completeMissionProof,
        completeLessonQuiz
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
