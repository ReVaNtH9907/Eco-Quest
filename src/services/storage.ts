import { User, Mission, Lesson, Submission, LeaderboardEntry } from '../types';
import { INITIAL_USER, SAMPLE_MISSIONS, SAMPLE_LESSONS, INITIAL_LEADERBOARD, INITIAL_SUBMISSIONS } from './mockData';

const KEYS = {
  USER: 'ecoquest_v1_user',
  MISSIONS: 'ecoquest_v1_missions',
  LESSONS: 'ecoquest_v1_lessons',
  SUBMISSIONS: 'ecoquest_v1_submissions',
  LEADERBOARD: 'ecoquest_v1_leaderboard',
  COMPLETED_MISSION_IDS: 'ecoquest_v1_completed_mission_ids',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? (JSON.parse(val) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.warn(`LocalStorage write error for ${key}:`, err);
  }
}

export const Storage = {
  getUser(): User {
    return safeGet<User>(KEYS.USER, INITIAL_USER);
  },
  saveUser(u: User): void {
    safeSet(KEYS.USER, u);
  },
  getMissions(): Mission[] {
    return safeGet<Mission[]>(KEYS.MISSIONS, SAMPLE_MISSIONS);
  },
  saveMissions(m: Mission[]): void {
    safeSet(KEYS.MISSIONS, m);
  },
  getLessons(): Lesson[] {
    return safeGet<Lesson[]>(KEYS.LESSONS, SAMPLE_LESSONS);
  },
  saveLessons(l: Lesson[]): void {
    safeSet(KEYS.LESSONS, l);
  },
  getSubmissions(): Submission[] {
    return safeGet<Submission[]>(KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
  },
  saveSubmissions(s: Submission[]): void {
    safeSet(KEYS.SUBMISSIONS, s);
  },
  getLeaderboard(): LeaderboardEntry[] {
    return safeGet<LeaderboardEntry[]>(KEYS.LEADERBOARD, INITIAL_LEADERBOARD);
  },
  saveLeaderboard(lb: LeaderboardEntry[]): void {
    safeSet(KEYS.LEADERBOARD, lb);
  },
  /** Returns the set of mission IDs whose XP has already been awarded */
  getCompletedMissionIds(): Set<string> {
    const arr = safeGet<string[]>(KEYS.COMPLETED_MISSION_IDS, []);
    return new Set(arr);
  },
  saveCompletedMissionIds(ids: Set<string>): void {
    safeSet(KEYS.COMPLETED_MISSION_IDS, Array.from(ids));
  },
};
