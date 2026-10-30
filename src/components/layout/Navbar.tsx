import React, { useState, useRef, useEffect } from 'react';
import { Compass, BookOpen, Zap, Trophy, User as UserIcon, Menu, X, Sparkles, LogIn, UserPlus, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, isAuthenticated, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation Links based on authentication
  const links = isAuthenticated
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'learn', label: 'Learn', icon: BookOpen },
        { id: 'missions', label: 'Missions', icon: Zap },
        { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
        { id: 'profile', label: 'Profile', icon: UserIcon },
      ]
    : [
        { id: 'home', label: 'Home', icon: Compass },
        { id: 'learn', label: 'Learn', icon: BookOpen },
        { id: 'missions', label: 'Missions', icon: Zap },
        { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
      ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab(isAuthenticated ? 'dashboard' : 'home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-lg">
                🌱
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 font-sans">
                Eco<span className="text-emerald-600">Quest</span>
              </span>
              <span className="block text-[10px] text-slate-500 -mt-1 font-medium">
                Learn. Act. Verify. Change the Planet.
              </span>
            </div>
          </div>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {isAuthenticated ? (
              <>
                {/* XP Pill */}
                <div 
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 cursor-pointer hover:bg-emerald-100/60 transition-colors shadow-2xs"
                  title="Your current XP points"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                  <span>{currentUser.xp.toLocaleString()} XP</span>
                </div>

                {/* Start Mission CTA */}
                <button
                  onClick={() => setActiveTab('missions')}
                  className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition-all shadow-sm shadow-emerald-600/20 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Mission</span>
                </button>

                {/* Profile / Logout Dropdown Menu */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500/40 hover:border-emerald-600 transition-colors shadow-2xs"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-3.5 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email || currentUser.college || 'Eco Member'}</p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setActiveTab('dashboard');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                          <span>Dashboard</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('profile');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                          <span>Profile & Impact</span>
                        </button>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Guest State: Login & Sign Up */}
                <button
                  onClick={() => setActiveTab('login')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-slate-100/70 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>

                <button
                  onClick={() => setActiveTab('signup')}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition-all shadow-sm shadow-emerald-600/20 active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-md">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-600" />
                <span>{link.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out ({currentUser.name})</span>
              </button>
            ) : (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    setActiveTab('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 text-center"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setActiveTab('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 text-center"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
