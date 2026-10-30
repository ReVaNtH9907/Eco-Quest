/**
 * XP & Level Calculation Service
 * Centralizes all progression rules and guarantees consistency across Profile, Dashboard, and Leaderboard.
 */

export interface LevelInfo {
  level: number;
  title: string;
  nextXp: number;
  baseXp: number;
  progressPercent: number;
}

export const XP_PER_LEVEL = 400;

export function calculateLevel(xp: number): LevelInfo {
  const level = Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1);
  const baseXp = (level - 1) * XP_PER_LEVEL;
  const nextXp = level * XP_PER_LEVEL;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((xp - baseXp) / (nextXp - baseXp)) * 100))
  );

  let title = 'Eco Novice';
  if (level >= 5) title = 'Eco Legend';
  else if (level >= 4) title = 'Eco Steward';
  else if (level >= 3) title = 'Eco Advocate';
  else if (level >= 2) title = 'Eco Scout';

  return { level, title, nextXp, baseXp, progressPercent };
}
