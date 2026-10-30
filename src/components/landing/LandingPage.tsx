import React from 'react';
import { ArrowRight, Sparkles, BookOpen, Zap, Camera, ShieldCheck, Trophy, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingPage: React.FC = () => {
  const { setActiveTab, missions, setActiveMissionDetail, isAuthenticated } = useApp();

  const coreLoop = [
    {
      step: '01',
      title: 'Learn',
      desc: 'Bite-sized environmental concepts & quick quizzes.',
      icon: BookOpen,
      badge: '+50 XP'
    },
    {
      step: '02',
      title: 'Act',
      desc: 'Discover real-world missions near you.',
      icon: Zap,
      badge: 'Real Action'
    },
    {
      step: '03',
      title: 'Submit Proof',
      desc: 'Snap Before & After photos with location tag.',
      icon: Camera,
      badge: 'Photo Evidence'
    },
    {
      step: '04',
      title: 'Verify',
      desc: 'Automated AI checks validate your contribution.',
      icon: ShieldCheck,
      badge: 'Demo AI'
    },
    {
      step: '05',
      title: 'Earn XP',
      desc: 'Receive XP, level up, and unlock impact badges.',
      icon: Sparkles,
      badge: '+150 XP'
    },
    {
      step: '06',
      title: 'Compete',
      desc: 'Climb the community leaderboard with friends.',
      icon: Trophy,
      badge: 'Rank Up'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-14 lg:pt-20 lg:pb-20">
        {/* Soft background tint */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-emerald-100/50 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>REAL-WORLD ACTION PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Turn Environmental Knowledge Into{' '}
            <span className="text-emerald-700">
              Real-World Action.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Learn practical eco concepts, complete hands-on missions, upload photo proof, verify your impact, and compete on the community leaderboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab(isAuthenticated ? 'dashboard' : 'signup')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 group active:scale-95"
            >
              <span>Start Your Eco Journey</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('learn')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200 transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Learn 5-Min Lessons</span>
            </button>
          </div>

          {!isAuthenticated && (
            <p className="text-xs text-slate-500 pt-1">
              Already have an account?{' '}
              <button
                onClick={() => setActiveTab('login')}
                className="font-bold text-emerald-700 hover:underline"
              >
                Log in here
              </button>
            </p>
          )}

          {/* Micro trust cues */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified Photo Proof
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Gamified XP & Streaks
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Real Indian Communities
            </span>
          </div>
        </div>
      </section>

      {/* Problem & Solution Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* The Problem */}
          <div className="p-8 rounded-3xl bg-white border border-rose-100 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-2xl pointer-events-none"></div>
            <div className="space-y-3 relative z-10">
              <span className="text-xs font-bold text-rose-700 tracking-wider uppercase bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                The Problem
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                Awareness Does Not Equal Action
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Millions read about climate change and plastic pollution on social media, yet less than 4% take tangible offline action. Traditional awareness campaigns lack incentives, accountability, and verification.
              </p>
            </div>
          </div>

          {/* The EcoQuest Solution */}
          <div className="p-8 rounded-3xl bg-white border border-emerald-100 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl pointer-events-none"></div>
            <div className="space-y-3 relative z-10">
              <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                The EcoQuest Solution
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                Turn Every Lesson into a Verified Mission
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                EcoQuest connects knowledge directly to action. Learn about microplastics, then clean a park. Upload before/after photo proof, let our demo AI verification validate your effort, earn XP, and climb community leaderboards.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Core Loop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            How It Works
          </span>
          <h2 className="text-3xl font-black text-slate-900">
            The 6-Step Eco Action Loop
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A continuous cycle engineered to build lifelong environmental habits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {coreLoop.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {item.step}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-emerald-700">{item.badge}</span>
                  <span className="text-slate-400 group-hover:text-emerald-600 transition-colors font-medium">Step {item.step} →</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Missions Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Get Started</span>
            <h2 className="text-2xl font-black text-slate-900">Popular Environmental Missions</h2>
          </div>
          <button
            onClick={() => setActiveTab('missions')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            <span>View all missions</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {missions.slice(0, 3).map((mission) => (
            <div
              key={mission.id}
              onClick={() => setActiveMissionDetail(mission)}
              className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-emerald-300 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
            >
              <div className="h-40 relative overflow-hidden">
                <img
                  src={mission.imageUrl}
                  alt={mission.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-slate-800 shadow-xs">
                    {mission.category}
                  </span>
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                    +{mission.xpReward} XP
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                    {mission.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {mission.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>📍 {mission.location}</span>
                  <span>⏱️ {mission.estimatedTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 text-white text-center space-y-4 shadow-lg shadow-emerald-700/20 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to Make a Measurable Impact?
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm">
              Join students and eco-advocates across Hyderabad, Bengaluru, Mumbai, and Delhi turning green ideas into verified reality.
            </p>
            <div className="pt-2 flex justify-center">
              <button
                onClick={() => setActiveTab(isAuthenticated ? 'dashboard' : 'signup')}
                className="px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-emerald-800 font-black text-sm shadow-md transition-all active:scale-95"
              >
                Start Your Eco Journey Today
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
