import React, { useState, useEffect } from 'react';
import {
  Zap, Clock, MapPin, CheckCircle2, ArrowRight, X,
  ShieldAlert, Sparkles, Check, RefreshCw, AlertTriangle,
  Camera, Video, Navigation, RotateCcw, Info, XCircle,
  FileText, History, CheckCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GpsCoords, SubmissionStatus } from '../../types';
import { CameraCaptureModal } from './CameraCaptureModal';

const VERIFY_STAGES = [
  'Validating live camera capture EXIF & timestamp...',
  'Checking GPS geofence against mission coordinates...',
  'Running computer-vision before/after delta analysis...',
  'Scoring environmental impact confidence (97%)...',
];

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  const cfg: Record<SubmissionStatus, { label: string; cls: string }> = {
    pending:   { label: '⏳ Pending', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
    verifying: { label: '🔄 Verifying', cls: 'bg-blue-50 text-blue-800 border-blue-200' },
    verified:  { label: '✓ Demo Verified', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold' },
    rejected:  { label: '✗ Demo Rejected', cls: 'bg-rose-50 text-rose-800 border-rose-200 font-bold' },
  };
  const { label, cls } = cfg[status] || cfg.verified;
  return <span className={`px-2.5 py-0.5 rounded-lg border text-xs ${cls}`}>{label}</span>;
}

export const MissionsPage: React.FC = () => {
  const {
    missions,
    submissions,
    activeMissionDetail,
    setActiveMissionDetail,
    activeMissionProof,
    setActiveMissionProof,
    completeMissionProof,
    completedMissionIds,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');

  // Proof form state — direct camera only
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [beforeUrl, setBeforeUrl] = useState<string | null>(null);
  const [afterUrl, setAfterUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [locationText, setLocationText] = useState('');
  const [gpsCoords, setGpsCoords] = useState<GpsCoords | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [notes, setNotes] = useState('');
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Camera capture modal state
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<'before' | 'after' | 'video'>('before');

  // Demo outcome selector
  const [demoOutcome, setDemoOutcome] = useState<'pass' | 'fail'>('pass');

  // Verification state machine: idle | pending | verifying | verified | rejected
  const [verifyState, setVerifyState] = useState<'idle' | 'pending' | 'verifying' | 'verified' | 'rejected'>('idle');
  const [verifyStep, setVerifyStep] = useState(0);
  const [awardedXp, setAwardedXp] = useState(0);
  const [isDuplicate, setIsDuplicate] = useState(false);

  useEffect(() => {
    if (activeMissionProof) {
      setMediaType('photo');
      setBeforeUrl(null);
      setAfterUrl(null);
      setVideoUrl(null);
      setLocationText(activeMissionProof.location);
      setGpsCoords(null);
      setGpsStatus('idle');
      setNotes('');
      setPhotoError(null);
      setVerifyState('idle');
      setVerifyStep(0);
      setAwardedXp(0);
      setIsDuplicate(completedMissionIds.has(activeMissionProof.id));
      setDemoOutcome('pass');
    }
  }, [activeMissionProof, completedMissionIds]);

  const requestGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus('denied');
      return;
    }
    setGpsStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords: GpsCoords = {
          latitude: +pos.coords.latitude.toFixed(5),
          longitude: +pos.coords.longitude.toFixed(5),
          accuracy: Math.round(pos.coords.accuracy),
        };
        setGpsCoords(coords);
        setLocationText(`${coords.latitude}, ${coords.longitude} (GPS Verified)`);
        setGpsStatus('granted');
      },
      () => {
        setGpsStatus('denied');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const openCamera = (target: 'before' | 'after' | 'video') => {
    setCameraTarget(target);
    setCameraModalOpen(true);
  };

  const handleCameraCapture = (dataUrl: string, capturedType: 'photo' | 'video') => {
    if (cameraTarget === 'before') {
      setBeforeUrl(dataUrl);
    } else if (cameraTarget === 'after') {
      setAfterUrl(dataUrl);
    } else if (cameraTarget === 'video') {
      setVideoUrl(dataUrl);
      // For video proof, auto-assign thumbnail frames
      if (!beforeUrl) setBeforeUrl(dataUrl);
      if (!afterUrl) setAfterUrl(dataUrl);
    }
    setPhotoError(null);
  };

  const handleSubmitProof = async () => {
    setPhotoError(null);
    if (mediaType === 'photo' && (!beforeUrl || !afterUrl)) {
      setPhotoError('Please capture both a Before photo and an After photo using your camera.');
      return;
    }
    if (mediaType === 'video' && !videoUrl) {
      setPhotoError('Please record your live video proof using the camera before submitting.');
      return;
    }
    if (!activeMissionProof) return;

    // Stage 1: PENDING
    setVerifyState('pending');
    await delay(700);

    // Stage 2: VERIFYING
    setVerifyState('verifying');
    for (let i = 0; i < VERIFY_STAGES.length; i++) {
      setVerifyStep(i);
      await delay(650);
    }

    if (demoOutcome === 'fail') {
      setVerifyState('rejected');
      return;
    }

    // Stage 3: VERIFIED
    const xp = await completeMissionProof({
      missionId: activeMissionProof.id,
      mediaType,
      beforePhotoDataUrl: beforeUrl || '',
      afterPhotoDataUrl: afterUrl || '',
      videoUrl: videoUrl || undefined,
      location: locationText || activeMissionProof.location,
      gpsCoords: gpsCoords ?? undefined,
      notes: notes.trim() || undefined,
    });

    setAwardedXp(xp);
    setVerifyState('verified');
  };

  const closeProofModal = () => {
    setActiveMissionProof(null);
    setVerifyState('idle');
    setVerifyStep(0);
  };

  const categories = ['All', 'Cleanup', 'Planting', 'Recycling', 'Water', 'Transit'];
  const filtered = missions.filter(m => {
    const matchCat = categoryFilter === 'All' || m.category === categoryFilter;
    const matchDiff = difficultyFilter === 'All' || m.difficulty === difficultyFilter;
    return matchCat && matchDiff;
  });

  const subsForMission = (missionId: string) =>
    submissions.filter(s => s.missionId === missionId);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            <span>REAL-WORLD ACTION MATRIX</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Environmental Missions
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl">
            Choose a mission, take physical action, and capture direct live camera proof to verify your impact and earn XP.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-800">{filtered.length}</strong> of {missions.length} missions
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                categoryFilter === c
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <select
          value={difficultyFilter}
          onChange={e => setDifficultyFilter(e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-emerald-500 shadow-2xs"
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy (15–30 min)</option>
          <option value="Medium">Medium (30–60 min)</option>
          <option value="Hard">Hard (60+ min)</option>
        </select>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-slate-200 p-8">
          <div className="text-4xl">🔍</div>
          <h3 className="text-base font-bold text-slate-800">No missions match these filters</h3>
          <p className="text-xs text-slate-500">Try selecting a different category or difficulty filter.</p>
          <button
            onClick={() => {
              setCategoryFilter('All');
              setDifficultyFilter('All');
            }}
            className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(mission => {
          const isDone = completedMissionIds.has(mission.id);
          const missionSubs = subsForMission(mission.id);

          return (
            <div
              key={mission.id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all shadow-xs group"
            >
              <div className="relative h-48 w-full bg-slate-100">
                <img
                  src={mission.imageUrl}
                  alt={mission.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 text-emerald-700 text-xs font-black flex items-center gap-1 border border-emerald-200 shadow-sm">
                  <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                  +{mission.xpReward} XP
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-lg bg-white/95 text-slate-700 border border-slate-200 text-[10px] font-bold">
                    {mission.category}
                  </span>
                  {isDone && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                      <Check className="w-3 h-3" /> Completed
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                      {mission.difficulty}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {mission.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1 ml-auto text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {mission.completions} done
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {mission.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {mission.description}
                  </p>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                    <span className="font-semibold text-emerald-700 block mb-0.5">Proof Required:</span>
                    <span className="line-clamp-1">{mission.verificationRequirements}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveMissionDetail(mission)}
                      className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Details</span>
                    </button>

                    <button
                      onClick={() => setActiveMissionDetail(mission)}
                      className={`py-2.5 rounded-xl text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-sm ${
                        isDone
                          ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/20'
                          : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Redo Mission</span>
                        </>
                      ) : (
                        <>
                          <span>Start Mission</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                  {missionSubs.length > 0 && (
                    <div className="pt-2.5 border-t border-slate-100 space-y-1.5">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <History className="w-3 h-3 text-slate-400" />
                        <span>Submission History ({missionSubs.length})</span>
                      </div>
                      <div className="space-y-1">
                        {missionSubs.slice(0, 2).map(s => (
                          <div key={s.id} className="flex items-center justify-between text-[11px] bg-slate-50 p-1.5 px-2 rounded-lg border border-slate-150">
                            <span className="text-slate-500 truncate max-w-[130px]">{s.timestamp}</span>
                            <StatusBadge status={s.status} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Mission Detail Modal (Details Page) ─────────────────────────── */}
      {activeMissionDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl my-8">
            <div className="relative h-48 w-full bg-slate-100">
              <img
                src={activeMissionDetail.imageUrl}
                alt={activeMissionDetail.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />

              <button
                onClick={() => setActiveMissionDetail(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-xs font-bold text-emerald-300 block mb-1">
                  {activeMissionDetail.category} • {activeMissionDetail.difficulty} • {activeMissionDetail.estimatedTime}
                </span>
                <h2 className="text-2xl font-black text-white">{activeMissionDetail.title}</h2>
              </div>
            </div>

            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-center">
                <div>
                  <span className="text-slate-500 block">XP Reward</span>
                  <span className="font-extrabold text-emerald-700 text-sm">+{activeMissionDetail.xpReward} XP</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Est. Duration</span>
                  <span className="font-bold text-slate-800 text-sm">{activeMissionDetail.estimatedTime}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Completions</span>
                  <span className="font-bold text-slate-800 text-sm">{activeMissionDetail.completions}</span>
                </div>
              </div>

              {completedMissionIds.has(activeMissionDetail.id) && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    You have already completed this mission. You can submit new live proof to redo it, but XP is awarded only once.
                  </span>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Mission Overview</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{activeMissionDetail.description}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">Why It Matters</h4>
                <p className="text-xs text-slate-700 leading-relaxed">{activeMissionDetail.whyItMatters}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Step-by-Step Instructions</h4>
                <ol className="space-y-2">
                  {activeMissionDetail.steps.map((st, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {i + 1}
                      </span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold mb-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>Safety Protocol</span>
                </div>
                <ul className="text-xs text-slate-700 list-disc list-inside space-y-0.5">
                  {activeMissionDetail.safetyGuidelines.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
                <strong className="text-slate-900 block mb-0.5">Direct Camera Proof Required:</strong>
                {activeMissionDetail.verificationRequirements} (Gallery uploads are disabled to ensure physical action integrity).
              </div>

              {subsForMission(activeMissionDetail.id).length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Your Past Submissions ({subsForMission(activeMissionDetail.id).length})
                  </h4>
                  <div className="space-y-1.5">
                    {subsForMission(activeMissionDetail.id).map(s => (
                      <div key={s.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img src={s.afterPhoto} alt="Proof" className="w-8 h-8 rounded-lg object-cover border border-slate-200" />
                          <div>
                            <span className="font-bold text-slate-800 block text-[11px]">{s.timestamp}</span>
                            <span className="text-[10px] text-slate-500">{s.location}</span>
                          </div>
                        </div>
                        <StatusBadge status={s.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setActiveMissionDetail(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Back to Missions
              </button>

              <button
                onClick={() => {
                  const m = activeMissionDetail;
                  setActiveMissionDetail(null);
                  setActiveMissionProof(m);
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all"
              >
                <span>Complete Mission &amp; Submit Proof</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Direct Camera Proof Submission Modal ───────────────────────── */}
      {activeMissionProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl my-8">
            <div className="p-6 pb-2 relative border-b border-slate-100">
              <button
                onClick={closeProofModal}
                disabled={verifyState === 'pending' || verifyState === 'verifying'}
                className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 mb-1">
                <span>DIRECT CAMERA PROOF</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 pr-8">{activeMissionProof.title}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {activeMissionProof.estimatedTime}
                </span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                  +{activeMissionProof.xpReward} XP
                </span>
                {isDuplicate && (
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                    Already Completed (0 XP)
                  </span>
                )}
              </div>
            </div>

            {verifyState === 'idle' && (
              <div className="p-6 space-y-4">
                {/* Proof Type Toggle: Photo vs Video */}
                <div className="flex items-center justify-between p-1 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setMediaType('photo')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      mediaType === 'photo'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Before &amp; After Photos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('video')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      mediaType === 'video'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Direct Action Video</span>
                  </button>
                </div>

                {/* Direct Camera Capture Cards (No file input!) */}
                {mediaType === 'photo' ? (
                  <div className="grid grid-cols-2 gap-3">
                    {/* Before Photo */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">1. Before Action *</label>
                      <div
                        onClick={() => openCamera('before')}
                        className={`relative rounded-2xl overflow-hidden border-2 aspect-video flex flex-col items-center justify-center cursor-pointer transition-all ${
                          beforeUrl
                            ? 'border-emerald-500 bg-slate-900 shadow-2xs'
                            : 'border-dashed border-emerald-300 bg-emerald-50/20 hover:border-emerald-500 hover:bg-emerald-50/40'
                        }`}
                      >
                        {beforeUrl ? (
                          <>
                            <img src={beforeUrl} alt="Before" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[11px] text-white font-bold bg-slate-900/70 px-2.5 py-1 rounded-xl">
                                Retake Photo
                              </span>
                            </div>
                            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-emerald-600/90 text-white text-[9px] font-bold">
                              Captured ✓
                            </span>
                          </>
                        ) : (
                          <div className="text-center p-3 space-y-1">
                            <Camera className="w-6 h-6 text-emerald-600 mx-auto" />
                            <p className="text-[11px] text-slate-700 font-bold">Open Camera</p>
                            <p className="text-[10px] text-slate-400">Snap Before photo</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* After Photo */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">2. After Action *</label>
                      <div
                        onClick={() => openCamera('after')}
                        className={`relative rounded-2xl overflow-hidden border-2 aspect-video flex flex-col items-center justify-center cursor-pointer transition-all ${
                          afterUrl
                            ? 'border-emerald-500 bg-slate-900 shadow-2xs'
                            : 'border-dashed border-emerald-300 bg-emerald-50/20 hover:border-emerald-500 hover:bg-emerald-50/40'
                        }`}
                      >
                        {afterUrl ? (
                          <>
                            <img src={afterUrl} alt="After" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[11px] text-white font-bold bg-slate-900/70 px-2.5 py-1 rounded-xl">
                                Retake Photo
                              </span>
                            </div>
                            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-emerald-600/90 text-white text-[9px] font-bold">
                              Captured ✓
                            </span>
                          </>
                        ) : (
                          <div className="text-center p-3 space-y-1">
                            <Camera className="w-6 h-6 text-emerald-600 mx-auto" />
                            <p className="text-[11px] text-slate-700 font-bold">Open Camera</p>
                            <p className="text-[10px] text-slate-400">Snap After photo</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Video Proof Card */
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Direct Action Video Recording *</label>
                    <div
                      onClick={() => openCamera('video')}
                      className={`relative rounded-2xl overflow-hidden border-2 aspect-16/9 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        videoUrl
                          ? 'border-emerald-500 bg-black shadow-2xs'
                          : 'border-dashed border-emerald-300 bg-emerald-50/20 hover:border-emerald-500'
                      }`}
                    >
                      {videoUrl ? (
                        <>
                          <video src={videoUrl} controls className="w-full h-full object-cover" />
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                            Recorded ✓
                          </span>
                        </>
                      ) : (
                        <div className="text-center p-6 space-y-2">
                          <Video className="w-8 h-8 text-emerald-600 mx-auto" />
                          <p className="text-xs text-slate-700 font-bold">Open Camera to Record Live Video</p>
                          <p className="text-[11px] text-slate-400">Capture 10–30s of your action in real time</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {photoError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{photoError}</span>
                  </div>
                )}

                {/* Location & GPS */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mission Location</span>
                    </label>
                    <button
                      type="button"
                      onClick={requestGps}
                      disabled={gpsStatus === 'requesting' || gpsStatus === 'granted'}
                      className={`text-[11px] font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all ${
                        gpsStatus === 'granted'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : gpsStatus === 'denied'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Navigation className="w-3 h-3" />
                      {gpsStatus === 'requesting'
                        ? 'Requesting GPS...'
                        : gpsStatus === 'granted'
                        ? 'GPS Captured ✓'
                        : gpsStatus === 'denied'
                        ? 'GPS Denied (Type below)'
                        : 'Capture GPS'}
                    </button>
                  </div>

                  <input
                    type="text"
                    value={locationText}
                    onChange={e => setLocationText(e.target.value)}
                    placeholder="Enter location or capture GPS"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-2xs"
                  />
                  {gpsStatus === 'denied' && (
                    <p className="text-[11px] text-slate-500 mt-1">
                      Location access was unavailable/denied. You can continue by typing the location above.
                    </p>
                  )}
                </div>

                {/* Auto Timestamp */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Submission Timestamp (Auto):</span>
                  </span>
                  <span className="font-mono text-slate-800 font-bold">
                    {new Date().toLocaleTimeString()} IST
                  </span>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Field Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="What action did you take? How much debris was cleaned / trees planted?"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-2xs"
                  />
                </div>

                {/* Demo outcome toggle (Pass/Fail) */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Simulate Verification Outcome:</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDemoOutcome('pass')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                        demoOutcome === 'pass'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Pass (Verified)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoOutcome('fail')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                        demoOutcome === 'fail'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Fail (Rejected)
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Strict Direct Camera Rule:</strong> Gallery and file uploads are disabled to maintain verified physical action integrity.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeProofModal}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitProof}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Submit &amp; Verify Proof</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 1: PENDING */}
            {verifyState === 'pending' && (
              <div className="p-8 py-14 text-center space-y-4 animate-in fade-in">
                <RefreshCw className="w-10 h-10 text-amber-600 animate-spin mx-auto" />
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                  <span>⏳ STATUS: PENDING</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Packaging Camera Evidence...</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Uploading captured frames and bundling live EXIF metadata for verification.
                </p>
              </div>
            )}

            {/* STAGE 2: VERIFYING */}
            {verifyState === 'verifying' && (
              <div className="p-8 py-12 text-center space-y-5 animate-in fade-in">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[11px] font-mono text-blue-800 border border-blue-200">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  <span>STATUS: VERIFYING (Demo Verification)</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Analyzing Mission Evidence</h3>
                  <p className="text-xs text-slate-600 font-mono">{VERIFY_STAGES[verifyStep]}</p>
                </div>

                <div className="space-y-2 text-left max-w-xs mx-auto pt-2">
                  {VERIFY_STAGES.map((stage, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 text-[11px] transition-colors ${
                        i <= verifyStep ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          i < verifyStep
                            ? 'bg-emerald-600 border-emerald-600'
                            : i === verifyStep
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {i < verifyStep && <Check className="w-2.5 h-2.5 text-white" />}
                        {i === verifyStep && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                      </div>
                      <span className={i === verifyStep ? 'font-semibold' : ''}>{stage}</span>
                    </div>
                  ))}
                </div>

                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200 max-w-xs mx-auto">
                  <div
                    className="bg-emerald-600 h-1.5 transition-all duration-500"
                    style={{ width: `${((verifyStep + 1) / VERIFY_STAGES.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* STAGE 3A: VERIFIED */}
            {verifyState === 'verified' && (
              <div className="p-8 py-10 text-center space-y-4 animate-in fade-in">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border-4 border-emerald-500 flex items-center justify-center shadow-xs">
                  <Check className="w-10 h-10 text-emerald-600" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>STATUS: DEMO VERIFIED ✓</span>
                </div>

                <h3 className="text-2xl font-black text-slate-900">Mission Verified!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Simulated AI verification confirmed authentic camera capture and positive environmental impact (Score: 97%).
                </p>

                {awardedXp > 0 ? (
                  <div className="py-2.5 px-6 rounded-2xl bg-emerald-50 border border-emerald-200 inline-block mx-auto">
                    <span className="text-2xl font-black text-emerald-700 font-mono">
                      +{awardedXp} XP Awarded!
                    </span>
                  </div>
                ) : (
                  <div className="py-2.5 px-6 rounded-2xl bg-amber-50 border border-amber-200 inline-block mx-auto text-left max-w-xs">
                    <p className="text-xs font-bold text-amber-800 flex items-center gap-1 mb-0.5">
                      <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Duplicate Submission Notice:</span>
                    </p>
                    <p className="text-[11px] text-amber-700 leading-tight">
                      Proof recorded in history, but XP was previously awarded. Missions only grant XP on first completion.
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={closeProofModal}
                    className="px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 3B: REJECTED */}
            {verifyState === 'rejected' && (
              <div className="p-8 py-10 text-center space-y-4 animate-in fade-in">
                <div className="w-20 h-20 mx-auto rounded-full bg-rose-50 border-4 border-rose-500 flex items-center justify-center shadow-xs">
                  <XCircle className="w-10 h-10 text-rose-600" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[11px] font-bold text-rose-800 border border-rose-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>STATUS: DEMO REJECTED ✗</span>
                </div>

                <h3 className="text-2xl font-black text-slate-900">Verification Inconclusive</h3>
                <p className="text-xs text-rose-700 max-w-sm mx-auto leading-relaxed bg-rose-50/70 p-3 rounded-xl border border-rose-200">
                  Simulated verification rejected: Could not identify sufficient physical change between Before and After proof photos. No XP awarded.
                </p>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setVerifyState('idle');
                      setDemoOutcome('pass');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    Retake Proof with Camera
                  </button>
                  <button
                    type="button"
                    onClick={closeProofModal}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Direct Camera Capture Viewfinder Modal */}
      {cameraModalOpen && (
        <CameraCaptureModal
          title={
            cameraTarget === 'before'
              ? 'Capture Before Photo'
              : cameraTarget === 'after'
              ? 'Capture After Photo'
              : 'Record Action Video'
          }
          mode={cameraTarget === 'video' ? 'video' : 'photo'}
          onCapture={handleCameraCapture}
          onClose={() => setCameraModalOpen(false)}
        />
      )}
    </div>
  );
};

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
