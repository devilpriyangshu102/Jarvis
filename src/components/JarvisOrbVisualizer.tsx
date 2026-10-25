import React, { useEffect, useState } from 'react';
import { Sparkles, Mic, Volume2, ShieldAlert, AlertCircle, MicOff, RefreshCw } from 'lucide-react';
import { AssistantVisualState } from '../types/jarvis';

interface JarvisOrbVisualizerProps {
  visualState: AssistantVisualState;
  audioLevel: number; // 0 to 100 normalized mic input level
  speechOutputLevel?: number; // 0 to 100 TTS output modulation
  size?: 'bubble' | 'panel' | 'hero';
  onInterrupt?: () => void;
  onRetry?: () => void;
}

export const JarvisOrbVisualizer: React.FC<JarvisOrbVisualizerProps> = ({
  visualState,
  audioLevel,
  speechOutputLevel = 0,
  size = 'panel',
  onInterrupt,
  onRetry,
}) => {
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Compute ring scaling based on state and live audio
  const normalizedAudio = Math.min(100, Math.max(0, audioLevel));
  const audioScale = 1 + (normalizedAudio / 100) * 0.45;
  const ttsScale = 1 + (speechOutputLevel / 100) * 0.35;

  const getContainerDimensions = () => {
    switch (size) {
      case 'bubble':
        return 'w-14 h-14';
      case 'hero':
        return 'w-24 h-24 sm:w-28 sm:h-28';
      case 'panel':
      default:
        return 'w-20 h-20';
    }
  };

  const getCoreDimensions = () => {
    switch (size) {
      case 'bubble':
        return 'w-8 h-8';
      case 'hero':
        return 'w-16 h-16';
      case 'panel':
      default:
        return 'w-12 h-12';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className={`relative ${getContainerDimensions()} flex items-center justify-center`}>
        
        {/* 1. STATE: WAKE DETECTED (Bright travelling cyan sweep & radiant flare) */}
        {visualState === 'WAKE_DETECTED' && (
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-75" />
        )}

        {/* 2. OUTER CONCENTRIC RINGS */}
        {/* Ring 3 (Outermost) */}
        <div
          style={{
            transform: visualState === 'LISTENING'
              ? `scale(${audioScale * 1.1})`
              : visualState === 'SPEAKING'
              ? `scale(${ttsScale * 1.08})`
              : 'scale(1)',
            transition: 'transform 0.08s ease-out',
          }}
          className={`absolute inset-[-8px] rounded-full border ${
            visualState === 'LISTENING'
              ? 'border-cyan-400/40 shadow-[0_0_20px_rgba(0,210,255,0.4)]'
              : visualState === 'PROCESSING' || visualState === 'GENERATING'
              ? 'border-dashed border-cyan-400/60 animate-spin-slow'
              : visualState === 'SEARCHING'
              ? 'border-dashed border-sky-400/80 animate-spin'
              : visualState === 'SPEAKING'
              ? 'border-blue-400/50 shadow-[0_0_15px_rgba(0,112,243,0.5)]'
              : visualState === 'WAITING_FOR_CONFIRMATION'
              ? 'border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
              : visualState === 'ERROR'
              ? 'border-rose-500/60 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
              : visualState === 'OFFLINE' || visualState === 'PAUSED'
              ? 'border-slate-700/40 opacity-40'
              : 'border-cyan-500/20'
          }`}
        />

        {/* Ring 2 (Middle Arc) */}
        <div
          style={{
            transform: visualState === 'LISTENING'
              ? `scale(${audioScale})`
              : visualState === 'SPEAKING'
              ? `scale(${ttsScale})`
              : 'scale(1)',
            transition: 'transform 0.08s ease-out',
          }}
          className={`absolute inset-[-3px] rounded-full border ${
            visualState === 'LISTENING'
              ? 'border-cyan-300/60 border-t-transparent animate-spin-reverse-slow'
              : visualState === 'PROCESSING' || visualState === 'GENERATING'
              ? 'border-blue-400/70 border-b-transparent animate-spin-slow'
              : visualState === 'SEARCHING'
              ? 'border-sky-300/80 border-r-transparent animate-spin-reverse-slow'
              : visualState === 'SPEAKING'
              ? 'border-cyan-400/60 animate-spin-slow'
              : visualState === 'WAITING_FOR_CONFIRMATION'
              ? 'border-amber-400/40'
              : visualState === 'ERROR'
              ? 'border-rose-400/40'
              : visualState === 'OFFLINE' || visualState === 'PAUSED'
              ? 'border-slate-700/50'
              : 'border-cyan-500/30'
          }`}
        />

        {/* 3. CENTRAL LUMINOUS ORB */}
        <div
          className={`relative ${getCoreDimensions()} rounded-full flex items-center justify-center transition-all duration-300 ${
            visualState === 'LISTENING'
              ? 'bg-gradient-to-tr from-cyan-400 via-blue-500 to-cyan-300 shadow-[0_0_35px_rgba(0,210,255,0.8)]'
              : visualState === 'PROCESSING' || visualState === 'GENERATING'
              ? 'bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 shadow-[0_0_30px_rgba(0,112,243,0.7)] animate-pulse'
              : visualState === 'SEARCHING'
              ? 'bg-gradient-to-tr from-sky-400 via-cyan-500 to-blue-600 shadow-[0_0_30px_rgba(14,165,233,0.7)] animate-pulse'
              : visualState === 'SPEAKING'
              ? 'bg-gradient-to-tr from-cyan-300 via-blue-500 to-cyan-400 shadow-[0_0_30px_rgba(0,210,255,0.7)]'
              : visualState === 'WAITING_FOR_CONFIRMATION'
              ? 'bg-gradient-to-tr from-amber-500 to-orange-600 shadow-[0_0_25px_rgba(245,158,11,0.6)]'
              : visualState === 'ERROR'
              ? 'bg-gradient-to-tr from-rose-600 to-red-700 shadow-[0_0_25px_rgba(239,68,68,0.6)]'
              : visualState === 'OFFLINE' || visualState === 'PAUSED'
              ? 'bg-slate-800 border border-slate-700'
              : 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-cyan-400 shadow-[0_0_25px_rgba(0,210,255,0.5)] animate-jarvis-core'
          }`}
        >
          {/* Inner Core Shimmer */}
          <div className="w-4/5 h-4/5 rounded-full bg-[#050C1B] flex items-center justify-center relative overflow-hidden">
            {visualState === 'LISTENING' ? (
              <Mic className="w-4 h-4 text-cyan-300 animate-pulse" />
            ) : visualState === 'SEARCHING' ? (
              <Sparkles className="w-4 h-4 text-sky-300 animate-spin" />
            ) : visualState === 'PROCESSING' || visualState === 'GENERATING' ? (
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            ) : visualState === 'SPEAKING' ? (
              <Volume2 className="w-4 h-4 text-cyan-300 animate-bounce" />
            ) : visualState === 'WAITING_FOR_CONFIRMATION' ? (
              <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
            ) : visualState === 'ERROR' ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : visualState === 'OFFLINE' ? (
              <AlertCircle className="w-4 h-4 text-slate-500" />
            ) : visualState === 'PAUSED' ? (
              <MicOff className="w-4 h-4 text-slate-500" />
            ) : (
              <Sparkles className="w-4 h-4 text-cyan-400" />
            )}
          </div>
        </div>

      </div>

      {/* State Label & Status Line */}
      {size !== 'bubble' && (
        <div className="mt-2.5 flex flex-col items-center gap-1 text-center">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                visualState === 'LISTENING'
                  ? 'bg-cyan-400 animate-ping'
                  : visualState === 'PROCESSING'
                  ? 'bg-blue-400 animate-pulse'
                  : visualState === 'SPEAKING'
                  ? 'bg-emerald-400 animate-pulse'
                  : visualState === 'WAITING_FOR_CONFIRMATION'
                  ? 'bg-amber-400'
                  : visualState === 'ERROR'
                  ? 'bg-rose-400'
                  : visualState === 'PAUSED'
                  ? 'bg-slate-500'
                  : 'bg-cyan-500'
              }`}
            />
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-white">
              {visualState === 'WAKE_DETECTED'
                ? 'WAKE DETECTED'
                : visualState === 'LISTENING'
                ? 'LISTENING...'
                : visualState === 'PROCESSING'
                ? 'THINKING...'
                : visualState === 'SPEAKING'
                ? 'RESPONDING...'
                : visualState === 'WAITING_FOR_CONFIRMATION'
                ? 'AWAITING APPROVAL'
                : visualState === 'ERROR'
                ? 'PROCESSING ERROR'
                : visualState === 'PAUSED'
                ? 'MIC MUTED'
                : 'JARVIS STANDBY'}
            </span>
          </div>

          {/* Interactive controls based on active state */}
          {visualState === 'SPEAKING' && onInterrupt && (
            <button
              onClick={onInterrupt}
              className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-mono border border-cyan-500/30 transition-all cursor-pointer"
            >
              Interrupt Speech
            </button>
          )}

          {visualState === 'ERROR' && onRetry && (
            <button
              onClick={onRetry}
              className="mt-1 px-2.5 py-0.5 rounded-full bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 text-[10px] font-mono border border-rose-500/30 flex items-center gap-1 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Retry Query
            </button>
          )}
        </div>
      )}
    </div>
  );
};
