import React from 'react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="bg-white border-t border-slate-200/90 text-slate-500 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-base">🌱</span>
            <span className="font-extrabold text-slate-900 text-sm">EcoQuest</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">MVP</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Learn. Act. Verify. Change the Planet.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-600 font-medium">
          <button onClick={() => setActiveTab('home')} className="hover:text-emerald-700 transition-colors">Home</button>
          <button onClick={() => setActiveTab('learn')} className="hover:text-emerald-700 transition-colors">Learn</button>
          <button onClick={() => setActiveTab('missions')} className="hover:text-emerald-700 transition-colors">Missions</button>
          <button onClick={() => setActiveTab('leaderboard')} className="hover:text-emerald-700 transition-colors">Leaderboard</button>
          <button onClick={() => setActiveTab('profile')} className="hover:text-emerald-700 transition-colors">Profile</button>
        </div>

        <p className="text-[11px] text-slate-400">
          © 2026 EcoQuest. Built for measurable planetary action.
        </p>
      </div>
    </footer>
  );
};
