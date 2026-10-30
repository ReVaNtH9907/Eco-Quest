import React, { useState, useEffect, useRef } from 'react';
import {
  User as UserIcon, Mail, Phone, Lock, Eye, EyeOff, MapPin,
  GraduationCap, ArrowRight, AlertCircle, Sparkles, CheckCircle2,
  Camera, Upload, ShieldCheck, Clock, RefreshCw, KeyRound
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DemoOtpSession } from '../../services/auth';
import { validateAvatarFile, processAvatarFile } from '../../services/profileService';

export const SignUpPage: React.FC = () => {
  const { startRegistration, verifyAndCreateAccount, setActiveTab } = useApp();

  // Registration form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'phone'>('email');
  const [city, setCity] = useState('');
  const [college, setCollege] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // OTP Verification state
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpSession, setOtpSession] = useState<DemoOtpSession | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [resendSeconds, setResendSeconds] = useState(60);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Countdown for OTP resend
  useEffect(() => {
    let timer: any;
    if (step === 'otp' && resendSeconds > 0) {
      timer = setInterval(() => setResendSeconds(s => s - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendSeconds]);

  // Handle avatar selection with validation
  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateAvatarFile(file);
    if (!validation.valid) {
      setAvatarError(validation.error || 'Invalid image file.');
      return;
    }

    try {
      const dataUrl = await processAvatarFile(file);
      setAvatarDataUrl(dataUrl);
    } catch {
      setAvatarError('Failed to process image file. Please try another.');
    }
  };

  // Step 1: Submit initial registration form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (verificationMethod === 'phone' && (!phone.trim() || phone.trim().length < 8)) {
      setError('Please enter a valid phone number for SMS verification.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    const res = await startRegistration({
      name,
      email,
      phone,
      verificationMethod,
      city: city.trim() || 'Hyderabad',
      college: college.trim() || 'Student Community',
      password,
      confirmPassword,
      avatar: avatarDataUrl || undefined
    });
    setLoading(false);

    if (res.success && res.session) {
      setOtpSession(res.session);
      setOtpCode('');
      setResendSeconds(60);
      setStep('otp');
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  // Step 2: Verify OTP and create verified account
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSession) return;
    setError(null);

    if (!otpCode.trim() || otpCode.trim().length < 4) {
      setError('Please enter the verification code.');
      return;
    }

    setLoading(true);
    const res = await verifyAndCreateAccount(otpSession, otpCode.trim());
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Verification failed.');
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendSeconds > 0 || !otpSession) return;
    setError(null);
    setLoading(true);
    const res = await startRegistration(otpSession.signupData);
    setLoading(false);
    if (res.success && res.session) {
      setOtpSession(res.session);
      setOtpCode('');
      setResendSeconds(60);
    } else {
      setError(res.error || 'Could not resend OTP.');
    }
  };

  return (
    <div className="py-12 sm:py-16 max-w-lg mx-auto px-4">
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-emerald-50 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 mx-auto shadow-sm shadow-emerald-500/20">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-2xl">
                🌱
              </div>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {step === 'form' ? 'Join EcoQuest' : 'Verify Your Account'}
            </h1>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {step === 'form'
                ? 'Turn environmental awareness into real-world action. Register to start missions, verify impact, and earn XP.'
                : `Enter the verification code sent to your ${otpSession?.method === 'phone' ? 'phone' : 'email'}.`}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ── STEP 1: Registration Form ─────────────────────────────── */}
          {step === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center justify-center space-y-2 py-2">
                <div
                  onClick={() => avatarInputRef.current?.click()}
                  className="relative w-20 h-20 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 flex items-center justify-center cursor-pointer overflow-hidden group shadow-2xs transition-all"
                >
                  {avatarDataUrl ? (
                    <img src={avatarDataUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2">
                      <Camera className="w-6 h-6 text-emerald-600 mx-auto group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-bold text-emerald-800 block mt-0.5">Add Photo</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                    Change
                  </div>
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarSelect}
                />
                <span className="text-[11px] text-slate-500">
                  Profile Picture (JPEG, PNG, WebP • Max 2.5 MB)
                </span>
                {avatarError && (
                  <span className="text-[11px] text-rose-600 font-semibold">{avatarError}</span>
                )}
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Full Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Diya Sen"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Verification Channel Selector */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-slate-700">Verification Channel *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVerificationMethod('email')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      verificationMethod === 'email'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-500 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email OTP</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationMethod('phone')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      verificationMethod === 'phone'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-500 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Phone SMS OTP</span>
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Email Address *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@college.edu or gmail.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Phone Number {verificationMethod === 'phone' && '*'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required={verificationMethod === 'phone'}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* City & College */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">City</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. Hyderabad"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-800 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">College / Community</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={college}
                      onChange={e => setCollege(e.target.value)}
                      placeholder="e.g. IIT Hyderabad"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-800 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Password *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      required
                      className="w-full pl-10 pr-9 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-800 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Confirm Password *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-800 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Perks Pill */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>New members receive <strong>+50 Starter XP</strong> and the <strong>Eco Explorer</strong> badge.</span>
              </div>

              {/* Submit to OTP step */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-98"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Continue to Verification</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── STEP 2: Demo OTP Verification Screen ───────────────────── */}
          {step === 'otp' && otpSession && (
            <form onSubmit={handleOtpSubmit} className="space-y-5 animate-in fade-in">
              {/* Prominent Demo Notice Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>DEMO VERIFICATION FLOW</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Real SMS/Email delivery requires a third-party gateway (e.g. Twilio, SendGrid, or Supabase Auth).
                  Your simulated 6-digit OTP code is:
                </p>
                <div className="p-2 bg-white rounded-xl border border-amber-300 text-center font-mono font-black text-lg tracking-widest text-emerald-700 shadow-2xs select-all">
                  {otpSession.code}
                </div>
              </div>

              {/* Code Input */}
              <div className="space-y-1.5 text-center">
                <label className="block text-xs font-bold text-slate-700">
                  Enter 6-Digit Code for {otpSession.target}
                </label>
                <div className="relative max-w-xs mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 focus:bg-white border-2 border-emerald-500/80 rounded-xl text-center font-mono text-base font-bold tracking-widest text-slate-900 outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Valid for 5 minutes. Accounts are not activated until verified.
                </p>
              </div>

              {/* Resend button with timer */}
              <div className="flex items-center justify-between text-xs px-2">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Resend in {resendSeconds}s</span>
                </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendSeconds > 0 || loading}
                  className="font-bold text-emerald-700 hover:text-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend Code</span>
                </button>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={loading || otpCode.length < 4}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Verify &amp; Create Account</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('form');
                    setError(null);
                  }}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Back to Registration Details
                </button>
              </div>
            </form>
          )}

          {/* Link to Login */}
          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                Log in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
