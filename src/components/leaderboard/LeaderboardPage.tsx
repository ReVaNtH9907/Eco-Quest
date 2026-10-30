import React from 'react';
import { Trophy, AlertTriangle, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LeaderboardPage: React.FC = () => {
  const { leaderboard, currentUser } = useApp();

  const myEntry = leaderboard.find(e => e.isCurrentUser);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>COMMUNITY ACTION RANKINGS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Leaderboard
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Recognizing the top environmental change-makers across India based on verified missions and earned XP.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium self-start">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Fictional members clearly marked as Demo Users</span>
        </div>
      </div>

      {/* User Standing Banner */}
      {myEntry && (
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
              #{myEntry.rank}
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Your Current Dynamic Standing</span>
              <span className="text-sm font-bold text-slate-900">{currentUser.name} (You)</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <span className="text-emerald-700 font-extrabold">{currentUser.xp.toLocaleString()} XP</span>
              <span className="text-slate-500 block">{currentUser.missionsCompleted} missions</span>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100">
          <div className="p-4 grid grid-cols-12 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70 border-b border-slate-200">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-7 sm:col-span-8">Member</div>
            <div className="col-span-2 text-center">Missions</div>
            <div className="col-span-2 sm:col-span-1 text-right">XP</div>
          </div>

          {leaderboard.map(entry => (
            <div
              key={entry.userId || entry.rank + entry.name}
              className={`p-4 grid grid-cols-12 items-center text-xs sm:text-sm transition-colors ${
                entry.isCurrentUser ? 'bg-emerald-50/70 border-l-4 border-emerald-600' : 'hover:bg-slate-50/60'
              }`}
            >
              <div className="col-span-1 text-center font-black">
                {entry.rank === 1 && '🥇'}
                {entry.rank === 2 && '🥈'}
                {entry.rank === 3 && '🥉'}
                {entry.rank > 3 && `#${entry.rank}`}
              </div>

              <div className="col-span-7 sm:col-span-8 flex items-center gap-3">
                <img
                  src={entry.avatar}
                  alt={entry.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`font-bold block ${entry.isCurrentUser ? 'text-emerald-800' : 'text-slate-900'}`}>
                      {entry.name}
                    </span>
                    {entry.isCurrentUser ? (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        You
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 text-[10px] font-medium">
                        Demo User
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">{entry.city}</span>
                </div>
              </div>

              <div className="col-span-2 text-center text-slate-600 font-medium">
                {entry.missions}
              </div>

              <div className="col-span-2 sm:col-span-1 text-right font-extrabold text-emerald-700 font-mono">
                {entry.xp.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
