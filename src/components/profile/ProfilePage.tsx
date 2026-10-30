import React, { useRef, useState } from 'react';
import {
  Zap, Flame, CheckCircle2, Trees, Trash2, Award, ArrowRight,
  GraduationCap, MapPin, Camera, AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../missions/MissionsPage';
import { validateAvatarFile, processAvatarFile } from '../../services/profileService';
import { calculateLevel } from '../../services/xpService';

export const ProfilePage: React.FC = () => {
  const { currentUser, submissions, setActiveTab, updateUserProfile } = useApp();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);

  const levelInfo = calculateLevel(currentUser.xp);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateAvatarFile(file);
    if (!validation.valid) {
      setAvatarError(validation.error || 'Invalid file.');
      return;
    }

    try {
      setUpdatingAvatar(true);
      const dataUrl = await processAvatarFile(file);
      updateUserProfile({ avatar: dataUrl });
      setUpdatingAvatar(false);
    } catch {
      setAvatarError('Failed to update picture.');
      setUpdatingAvatar(false);
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-50 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar with Change Picture Overlay */}
          <div className="relative group shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-sm"
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="absolute inset-0 bg-slate-900/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white"
              title="Change Profile Picture"
            >
              <Camera className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">Change</span>
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{currentUser.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                Level {levelInfo.level} • {levelInfo.title}
              </span>
            </div>

            {avatarError && (
              <div className="text-xs text-rose-600 font-semibold flex items-center gap-1 justify-center sm:justify-start">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{avatarError}</span>
              </div>
            )}

            {/* Dynamic college / city */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500">
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
              {currentUser.email && (
                <span className="text-slate-400 font-mono text-[11px]">{currentUser.email}</span>
              )}
            </div>

            {/* Level progress bar */}
            <div className="pt-2 max-w-md">
              <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                <span className="text-emerald-700 font-mono">{currentUser.xp} XP</span>
                <span className="text-slate-400 font-mono">{levelInfo.nextXp} XP (Next Level)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {levelInfo.progressPercent}% to Level {levelInfo.level + 1}
              </p>
            </div>
          </div>

          {/* Quick Streak Card */}
          <div className="flex gap-2">
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-center">
              <Flame className="w-5 h-5 text-amber-600 mx-auto animate-pulse" />
              <span className="text-lg font-black text-slate-900 block mt-1">{currentUser.streak}d</span>
              <span className="text-[10px] text-amber-800 font-medium">Streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Impact Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Missions Done</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{currentUser.missionsCompleted}</p>
          <span className="text-[10px] text-emerald-700 font-medium">Verified Actions</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Total XP</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{currentUser.xp.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-700 font-medium">Earned Rewards</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Trash2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Waste Diverted</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{currentUser.wasteCollectedKg} kg</p>
          <span className="text-[10px] text-teal-700 font-medium">Plastic &amp; Debris</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Trees className="w-3.5 h-3.5 text-emerald-600" />
            <span>Trees Planted</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{currentUser.treesPlanted}</p>
          <span className="text-[10px] text-emerald-700 font-medium">Under Care</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Impact Badges &amp; Achievements</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {currentUser.badges.filter(b => b.isUnlocked).length} / {currentUser.badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {currentUser.badges.map(b => (
            <div
              key={b.id}
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                b.isUnlocked
                  ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="text-3xl mb-1">{b.icon}</div>
              <h4 className="text-xs font-bold text-slate-900 truncate">{b.title}</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{b.description}</p>
              {b.isUnlocked ? (
                <span className="text-[9px] text-emerald-700 font-mono mt-1 block font-bold">Unlocked ✓</span>
              ) : (
                <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-500 h-1" style={{ width: `${b.progress}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submission History with Status */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Submission History &amp; Verification Status</h3>
            <p className="text-xs text-slate-500">Track all your submitted mission evidence and verification outcomes.</p>
          </div>
          <button
            onClick={() => setActiveTab('missions')}
            className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Start New Mission</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {submissions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No submissions yet. Complete your first mission to see your proof here!
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map(sub => (
              <div
                key={sub.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 shrink-0">
                    <img src={sub.beforePhoto} alt="Before" className="w-12 h-12 rounded-xl object-cover border border-slate-300" />
                    <img src={sub.afterPhoto} alt="After" className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{sub.missionTitle}</h4>
                      {sub.mediaType === 'video' && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[9px] font-bold">
                          Video Proof
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{sub.timestamp} • {sub.location}</p>
                    {sub.notes && (
                      <p className="text-[11px] text-slate-600 italic mt-0.5">"{sub.notes}"</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  {sub.xpEarned > 0 ? (
                    <span className="text-xs font-bold text-emerald-700 block font-mono">
                      +{sub.xpEarned} XP
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-400 block font-mono">
                      0 XP (Repeat)
                    </span>
                  )}
                  <StatusBadge status={sub.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
