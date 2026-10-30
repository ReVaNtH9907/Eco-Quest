import React from 'react';
import { Zap, CheckCircle, User, Trophy } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const XPCelebrationModal: React.FC = () => {
  const { celebration, dismissCelebration, setActiveTab } = useApp();

  if (!celebration) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-white border border-emerald-200 rounded-3xl p-6 text-center shadow-xl shadow-slate-200/50">
        
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl shadow-sm mb-4 animate-bounce">
          ⚡
        </div>

        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold mb-2">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          <span>VERIFIED ECO IMPACT</span>
        </div>

        <h3 className="text-2xl font-black text-slate-900">
          +{celebration.xp} XP Earned!
        </h3>

        <p className="text-xs text-slate-600 mt-1 mb-5">
          {celebration.title}
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              dismissCelebration();
              setActiveTab('profile');
            }}
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>View Profile</span>
          </button>

          <button
            onClick={() => {
              dismissCelebration();
              setActiveTab('leaderboard');
            }}
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-emerald-600/20"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Leaderboard</span>
          </button>
        </div>

        <button
          onClick={dismissCelebration}
          className="mt-4 text-[11px] text-slate-400 hover:text-slate-600 block mx-auto font-medium"
        >
          Continue Exploring
        </button>
      </div>
    </div>
  );
};
