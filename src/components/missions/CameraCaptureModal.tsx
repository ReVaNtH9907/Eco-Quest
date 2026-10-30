import React, { useState, useEffect, useRef } from 'react';
import { Camera, Video, RefreshCw, X, Check, AlertTriangle, Disc, Square } from 'lucide-react';

interface CameraCaptureModalProps {
  title: string;
  mode: 'photo' | 'video';
  onCapture: (dataUrl: string, mediaType: 'photo' | 'video') => void;
  onClose: () => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  title,
  mode,
  onCapture,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Start live camera stream
  const startCamera = async (facing: 'environment' | 'user') => {
    setError(null);
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera hardware access is not supported by your browser.');
      }

      let newStream: MediaStream;
      try {
        newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facing,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: mode === 'video',
        });
      } catch (audioErr) {
        // Fallback to video-only if audio capture is denied or hardware mic is absent
        if (mode === 'video') {
          newStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: facing,
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
        } else {
          throw audioErr;
        }
      }

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError(
          'Camera permission was denied. Please allow camera access in your browser address bar to record physical mission proof.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No active camera hardware found on this device.');
      } else {
        setError(
          err.message || 'Unable to open camera. Please check your browser permissions.'
        );
      }
    }
  };

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [facingMode]);

  // Timer for video recording
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds(s => s + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Snap Photo
  const handleSnapPhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Add simulated timestamp watermark on captured frame for authenticity
    ctx.font = '14px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.fillText(`EcoQuest Verified • ${new Date().toLocaleTimeString()} IST`, 15, canvas.height - 15);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedPreview(dataUrl);

    // Stop active camera track while previewing
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
    }
  };

  // Start Video Recording
  const handleStartRecording = () => {
    if (!stream) return;
    try {
      const chunks: Blob[] = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setCapturedPreview(reader.result as string);
          if (stream) stream.getTracks().forEach(t => t.stop());
        };
        reader.readAsDataURL(blob);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      setError('Video recording is not supported in this browser format.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Retake
  const handleRetake = () => {
    setCapturedPreview(null);
    startCamera(facingMode);
  };

  // Accept & Save
  const handleAccept = () => {
    if (capturedPreview) {
      onCapture(capturedPreview, mode);
      onClose();
    }
  };

  // Fallback simulator for devices without hardware webcam
  const handleSimulateCapture = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw authentic green environmental viewfinder frame
    ctx.fillStyle = '#064E3B';
    ctx.fillRect(0, 0, 640, 480);
    ctx.fillStyle = '#059669';
    ctx.fillRect(20, 20, 600, 440);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌱 EcoQuest Direct Live Capture', 320, 220);

    ctx.font = '14px monospace';
    ctx.fillStyle = '#A7F3D0';
    ctx.fillText(`Hardware Simulation • ${new Date().toLocaleTimeString()} IST`, 320, 260);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedPreview(dataUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top Header */}
        <div className="p-4 px-6 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            {mode === 'photo' ? <Camera className="w-5 h-5 text-emerald-400" /> : <Video className="w-5 h-5 text-emerald-400" />}
            <span className="font-bold text-sm tracking-wide">{title}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder area */}
        <div className="relative bg-black aspect-4/3 flex items-center justify-center overflow-hidden">
          {capturedPreview ? (
            mode === 'photo' ? (
              <img src={capturedPreview} alt="Captured" className="w-full h-full object-cover" />
            ) : (
              <video src={capturedPreview} controls className="w-full h-full object-cover" />
            )
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}

          {/* Offscreen Canvas for snapshot */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Live recording indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-rose-600/90 text-white text-xs font-mono font-bold px-3 py-1 rounded-full animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              <span>REC {String(Math.floor(recordSeconds / 60)).padStart(2, '0')}:{String(recordSeconds % 60).padStart(2, '0')}</span>
            </div>
          )}

          {/* Error / Permission Denied Overlay */}
          {error && !capturedPreview && (
            <div className="absolute inset-0 bg-slate-900/95 p-6 flex flex-col items-center justify-center text-center space-y-3 z-20">
              <AlertTriangle className="w-10 h-10 text-amber-400" />
              <h4 className="text-white font-bold text-sm">Direct Camera Access Needed</h4>
              <p className="text-xs text-slate-300 max-w-sm leading-relaxed">{error}</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500"
                >
                  Retry Permission
                </button>
                <button
                  type="button"
                  onClick={handleSimulateCapture}
                  className="px-4 py-2 rounded-xl bg-slate-700 text-slate-200 font-bold text-xs hover:bg-slate-600"
                >
                  Simulate Camera Test Frame
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="p-4 px-6 bg-slate-800/90 border-t border-slate-700/80 flex items-center justify-between">
          {capturedPreview ? (
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={handleRetake}
                className="px-4 py-2 rounded-xl bg-slate-700 text-white font-semibold text-xs hover:bg-slate-600 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
              >
                <Check className="w-4 h-4" />
                <span>Accept Proof</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => setFacingMode(f => (f === 'environment' ? 'user' : 'environment'))}
                className="p-2 rounded-xl bg-slate-700 text-slate-300 hover:text-white text-xs font-medium"
                title="Switch Camera"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {mode === 'photo' ? (
                <button
                  type="button"
                  onClick={handleSnapPhoto}
                  disabled={!!error}
                  className="w-14 h-14 rounded-full bg-white border-4 border-slate-400 hover:border-emerald-500 transition-all shadow-lg active:scale-90 flex items-center justify-center disabled:opacity-50"
                  title="Snap Photo"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100" />
                </button>
              ) : isRecording ? (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop Recording</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  disabled={!!error}
                  className="w-14 h-14 rounded-full bg-rose-600 border-4 border-white hover:bg-rose-700 transition-all shadow-lg flex items-center justify-center disabled:opacity-50"
                  title="Start Recording"
                >
                  <Disc className="w-6 h-6 text-white" />
                </button>
              )}

              <span className="text-[11px] text-slate-400 font-mono">
                {mode === 'photo' ? 'Direct Photo' : 'Direct Video'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
