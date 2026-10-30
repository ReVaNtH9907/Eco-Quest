import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { XPCelebrationModal } from './components/common/XPCelebrationModal';

import { LandingPage } from './components/landing/LandingPage';
import { LearnPage } from './components/learn/LearnPage';
import { MissionsPage } from './components/missions/MissionsPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { LeaderboardPage } from './components/leaderboard/LeaderboardPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { ShieldAlert, ArrowRight } from 'lucide-react';

function AppContent() {
  const { activeTab, isAuthenticated, setActiveTab } = useApp();

  // Route protection for authenticated pages
  const isProtectedTab = activeTab === 'dashboard' || activeTab === 'profile';

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-slate-800 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {isProtectedTab && !isAuthenticated ? (
          <div className="py-20 max-w-md mx-auto px-4 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Authentication Required</h2>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              Please log in or register to access your personal dashboard, track mission submissions, and view your profile.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setActiveTab('login')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span>Log In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all"
              >
                Create Account
              </button>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'home' && <LandingPage />}
            {activeTab === 'login' && <LoginPage />}
            {activeTab === 'signup' && <SignUpPage />}
            {activeTab === 'dashboard' && <DashboardPage />}
            {activeTab === 'learn' && <LearnPage />}
            {activeTab === 'missions' && <MissionsPage />}
            {activeTab === 'profile' && <ProfilePage />}
            {activeTab === 'leaderboard' && <LeaderboardPage />}
          </>
        )}
      </main>

      <Footer />
      <XPCelebrationModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
