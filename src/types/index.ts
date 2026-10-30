export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type SubmissionStatus = 'pending' | 'verifying' | 'verified' | 'rejected';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  phone?: string;
  city?: string;
  college?: string;
  passwordHash?: string;
  isVerified?: boolean;
  verificationMethod?: 'email' | 'phone';
  level: number;
  levelTitle: string;
  xp: number;
  streak: number;
  missionsCompleted: number;
  learningCompleted: number;
  wasteCollectedKg: number;
  treesPlanted: number;
  volunteerHours: number;
  badges: Badge[];
  /** IDs of missions whose XP has already been awarded — prevents double-awards */
  completedMissionIds?: string[];
}

export interface AuthCredentials {
  emailOrPhone: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  phone: string;
  verificationMethod: 'email' | 'phone';
  password: string;
  confirmPassword?: string;
  city: string;
  college: string;
  avatar?: string;
}

export interface Mission {
  id: string;
  title: string;
  category: 'Cleanup' | 'Planting' | 'Recycling' | 'Water' | 'Transit';
  difficulty: Difficulty;
  xpReward: number;
  estimatedTime: string;
  location: string;
  description: string;
  whyItMatters: string;
  steps: string[];
  safetyGuidelines: string[];
  verificationRequirements: string;
  imageUrl: string;
  completions: number;
}

export interface GpsCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface Submission {
  id: string;
  missionId: string;
  missionTitle: string;
  mediaType?: 'photo' | 'video';
  beforePhoto: string; // Data URL captured directly via camera
  afterPhoto: string;  // Data URL captured directly via camera
  videoUrl?: string;   // Optional video data URL captured directly via camera
  location: string;
  gpsCoords?: GpsCoords;
  timestamp: string;
  notes?: string;
  status: SubmissionStatus;
  xpEarned: number;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonSlide {
  title: string;
  content: string;
  keyStat?: string;
  takeaway: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  readTime: string;
  xpReward: number;
  summary: string;
  icon: string;
  slides: LessonSlide[];
  quiz: QuizQuestion[];
  actionMissionId: string;
  isCompleted?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId?: string;
  name: string;
  avatar: string;
  city: string;
  xp: number;
  missions: number;
  isCurrentUser?: boolean;
  isDemo?: boolean;
}
