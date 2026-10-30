import { LeaderboardEntry, User } from '../types';
import { Storage } from './storage';

export const DEMO_COMMUNITY_MEMBERS: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Rohit Verma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80',
    city: 'Delhi NCR',
    xp: 2450,
    missions: 28,
    isDemo: true
  },
  {
    rank: 2,
    name: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
    city: 'Bengaluru',
    xp: 2180,
    missions: 25,
    isDemo: true
  },
  {
    rank: 3,
    name: 'Ananya Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80',
    city: 'Pune',
    xp: 1840,
    missions: 21,
    isDemo: true
  },
  {
    rank: 4,
    name: 'Karthik Raja',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80',
    city: 'Chennai',
    xp: 1420,
    missions: 16,
    isDemo: true
  },
  {
    rank: 6,
    name: 'Neha Banerjee',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=128&q=80',
    city: 'Kolkata',
    xp: 820,
    missions: 11,
    isDemo: true
  }
];

/**
 * Dynamically re-calculates rankings from the combination of demo members
 * and the active authenticated user, sorting by XP descending.
 * Positions are dynamically calculated, never hardcoded.
 */
export function recalculateLeaderboard(currentUser: User): LeaderboardEntry[] {
  // Current user's dynamic entry
  const userEntry: LeaderboardEntry = {
    rank: 0, // will be assigned after sort
    userId: currentUser.id,
    name: `${currentUser.name} (You)`,
    avatar: currentUser.avatar,
    city: currentUser.city || 'India',
    xp: currentUser.xp,
    missions: currentUser.missionsCompleted,
    isCurrentUser: true,
    isDemo: false
  };

  // Combine demo entries + user entry
  const allEntries = [...DEMO_COMMUNITY_MEMBERS, userEntry];

  // Sort by XP descending (tie-breaker by missions count)
  allEntries.sort((a, b) => {
    if (b.xp !== a.xp) return b.xp - a.xp;
    return b.missions - a.missions;
  });

  // Assign dynamic 1-based ranks
  const ranked = allEntries.map((entry, idx) => ({
    ...entry,
    rank: idx + 1
  }));

  Storage.saveLeaderboard(ranked);
  return ranked;
}
