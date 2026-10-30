import React from 'react';
import { Zap, Flame, Trophy, CheckCircle2, Trees, Trash2, Clock, ArrowRight, Sparkles, BookOpen, ShieldCheck, MapPin, GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../missions/MissionsPage';

export const DashboardPage: React.FC = () => {
  const { currentUser, missions, lessons, submissions, setActiveTab, setActiveMissionDetail } = useApp();

  const nextLevelXp = currentUser.level * 400;
  const currentBaseXp = (currentUser.level - 1) * 400;
  const levelProgress = Math.min(100, Math.max(0, Math.round(((currentUser.xp - currentBaseXp) / (nextLevelXp - currentBaseXp)) * 100)));

  // Featured / Recommended Mission for Today
  const featuredMission = missions[0];
  const featuredLesson = lessons[0];

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* 1. Welcome & Status Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-50 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-sm"
            />

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Welcome back, {currentUser.name}! 🌱
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  Level {currentUser.level} • {currentUser.levelTitle}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 font-medium">
                {currentUser.college && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                    {currentUser.college}
                  </span>
                )}
                {currentUser.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {currentUser.city}
                  </span>
                )}
                <span className="text-emerald-700 font-bold">
                  • Verified Eco Warrior
                </span>
              </div>

              {/* Progress to next level */}
              <div className="pt-2 max-w-md">
                <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                  <span className="text-emerald-700 font-mono">{currentUser.xp} XP</span>
                  <span className="text-slate-400 font-mono">{nextLevelXp} XP (Next Lvl)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Streak & Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-center min-w-[90px]">
              <Flame className="w-5 h-5 text-amber-600 mx-auto animate-pulse" />
              <span className="text-lg font-black text-slate-900 block mt-0.5">{currentUser.streak}d</span>
              <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">Streak</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center min-w-[90px]">
              <Trophy className="w-5 h-5 text-emerald-600 mx-auto" />
              <span className="text-lg font-black text-slate-900 block mt-0.5">{currentUser.missionsCompleted}</span>
              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Actions</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Impact Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{currentUser.wasteCollectedKg} kg</div>
            <div className="text-xs text-slate-500 font-medium">Plastic Diverted</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shrink-0">
            <Trees className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{currentUser.treesPlanted}</div>
            <div className="text-xs text-slate-500 font-medium">Saplings Planted</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{currentUser.volunteerHours} hrs</div>
            <div className="text-xs text-slate-500 font-medium">Volunteer Time</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-700 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{currentUser.learningCompleted}</div>
            <div className="text-xs text-slate-500 font-medium">Concepts Mastered</div>
          </div>
        </div>
      </div>

      {/* 3. Action Hub: Recommended Today & Daily Learn */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recommended Mission (2 columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-extrabold text-slate-900">Recommended Action For You</h2>
            </div>
            <button
              onClick={() => setActiveTab('missions')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Explore All Missions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {featuredMission && (
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <img
                src={featuredMission.imageUrl}
                alt={featuredMission.title}
                className="w-full sm:w-36 h-28 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100/80 text-emerald-800">
                    {featuredMission.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    {featuredMission.difficulty}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    +{featuredMission.xpReward} XP
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{featuredMission.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{featuredMission.description}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <button
                    onClick={() => {
                      setActiveMissionDetail(featuredMission);
                      setActiveTab('missions');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <span>Start Mission</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Daily 5-Min Learn Boost */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block">
                Daily Concept Boost
              </span>
              <span className="text-xs font-bold text-emerald-700 font-mono">+{featuredLesson?.xpReward || 50} XP</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">{featuredLesson?.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                {featuredLesson?.summary}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('learn')}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span>Take Quick Quiz &amp; Earn 50 XP</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
          </button>
        </div>

      </div>

      {/* 4. Recent Verified Actions Feed */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-extrabold text-slate-900">Recent Verified Actions</h2>
          </div>
          <button
            onClick={() => setActiveTab('profile')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Full Profile Activity</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {submissions.slice(0, 3).map((sub) => (
            <div key={sub.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{sub.missionTitle}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{sub.location}</span>
                    <span>•</span>
                    <span>{sub.timestamp}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {sub.xpEarned > 0 && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    +{sub.xpEarned} XP
                  </span>
                )}
                <StatusBadge status={sub.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
