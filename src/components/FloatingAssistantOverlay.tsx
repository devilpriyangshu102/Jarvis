import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Minimize2,
  X,
  Maximize2,
  Volume2,
  VolumeX,
  Sparkles,
  PhoneCall,
  MessageSquare,
  CheckSquare,
  BatteryCharging,
  Copy,
  Check,
  RotateCcw,
  Bot,
  User,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import {
  PhoneTelemetry,
  TaskItem,
  CallRecord,
  SmsMessage,
  AssistantVisualState,
  WakeWordSettings,
} from '../types/jarvis';
import { JarvisOrbVisualizer } from './JarvisOrbVisualizer';

interface FloatingAssistantOverlayProps {
  telemetry: PhoneTelemetry;
  tasks: TaskItem[];
  calls: CallRecord[];
  sms: SmsMessage[];
  visualState: AssistantVisualState;
  audioLevel: number;
  speechOutputLevel: number;
  transcript: string;
  lastSpeechResponse: string;
  wakeWordSettings: WakeWordSettings;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  onSendMessage: (query: string) => Promise<any>;
  onTogglePushToTalk: () => void;
  onInterruptSpeech: () => void;
  onUpdateWakeSettings: (newSettings: Partial<WakeWordSettings>) => void;
  onOpenFullApp: () => void;
  onCloseOverlay: () => void;
  overlayActive: boolean;
  chatHistory?: Array<{ role: string; text: string }>;
  onReplaySpeech?: (text: string) => Promise<void>;
}

export const FloatingAssistantOverlay: React.FC<FloatingAssistantOverlayProps> = ({
  telemetry,
  tasks,
  calls,
  sms,
  visualState,
  audioLevel,
  speechOutputLevel,
  transcript,
  lastSpeechResponse,
  wakeWordSettings,
  isExpanded,
  setIsExpanded,
  onSendMessage,
  onTogglePushToTalk,
  onInterruptSpeech,
  onUpdateWakeSettings,
  onOpenFullApp,
  onCloseOverlay,
  overlayActive,
  chatHistory = [],
  onReplaySpeech,
}) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 280, y: 130 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [inputText, setInputText] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom on new message
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, lastSpeechResponse, visualState]);

  const handleSendQuery = async (queryText?: string) => {
    const textToSubmit = queryText || inputText;
    if (!textToSubmit.trim() || visualState === 'PROCESSING') return;

    setInputText('');
    await onSendMessage(textToSubmit);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setIsDragging(true);
      setDragOffset({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = Math.max(8, Math.min(window.innerWidth - 72, e.clientX - dragOffset.x));
      const newY = Math.max(8, Math.min(window.innerHeight - 72, e.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      const newX = Math.max(8, Math.min(window.innerWidth - 72, e.touches[0].clientX - dragOffset.x));
      const newY = Math.max(8, Math.min(window.innerHeight - 72, e.touches[0].clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    };

    const handleEnd = () => {
      if (!isDragging) return;
      setIsDragging(false);
      // Snap near screen edges when in compact bubble mode
      if (!isExpanded) {
        const midX = window.innerWidth / 2;
        setPosition(prev => ({
          x: prev.x < midX ? 16 : Math.max(16, window.innerWidth - 80),
          y: Math.max(60, Math.min(window.innerHeight - 100, prev.y)),
        }));
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragOffset, isExpanded]);

  if (!overlayActive) return null;

  return (
    <div
      ref={containerRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        position: 'absolute',
      }}
      className="z-50 select-none pointer-events-auto"
    >
      {/* 1. EXPANDED ANDROID 16 MATERIAL 3 EXPRESSIVE FLOATING ISLAND */}
      {isExpanded ? (
        <div className="w-[340px] sm:w-[380px] bg-[#030712]/95 border border-cyan-500/35 rounded-3xl shadow-[0_8px_32px_rgba(0,180,255,0.28)] backdrop-blur-2xl text-slate-100 overflow-hidden ring-1 ring-cyan-400/20 transition-all duration-300">
          
          {/* Android 16 Drag Handle & Dynamic Pill Bar */}
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-[#050C1F]/90 via-[#07132B]/90 to-[#050C1F]/90 border-b border-cyan-500/20 cursor-move"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-6 h-6 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(0,210,255,0.4)]">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                {visualState === 'SPEAKING' && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-wider">JARVIS</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                    Android 16
                  </span>
                </div>
                <span className="text-[9px] text-cyan-400 font-mono flex items-center gap-1">
                  <Activity className="w-2.5 h-2.5 text-cyan-400" />
                  {wakeWordSettings.enabled && !wakeWordSettings.isMicPaused
                    ? `Hotword: "${wakeWordSettings.wakePhrase}"`
                    : 'Push-to-Talk'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onUpdateWakeSettings({ voiceResponseEnabled: !wakeWordSettings.voiceResponseEnabled })}
                title={wakeWordSettings.voiceResponseEnabled ? 'Voice Responses: Enabled (Deep Pitch)' : 'Voice Responses: Muted'}
                className={`p-1.5 rounded-xl text-xs cursor-pointer transition-colors ${
                  wakeWordSettings.voiceResponseEnabled
                    ? 'text-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/60'
                    : 'text-slate-500 hover:bg-slate-800'
                }`}
              >
                {wakeWordSettings.voiceResponseEnabled ? (
                  <Volume2 className="w-3.5 h-3.5" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={onOpenFullApp}
                title="Expand to Full Smartphone View"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl text-xs cursor-pointer transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                title="Minimize to Floating Bubble"
                className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 rounded-xl text-xs cursor-pointer transition-colors"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onCloseOverlay}
                title="Dismiss Floating Overlay"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl text-xs cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Holographic Arc Core Stage */}
          <div className="py-2.5 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-[#050D20] to-[#020612] border-b border-cyan-500/15 relative">
            <JarvisOrbVisualizer
              visualState={visualState}
              audioLevel={audioLevel}
              speechOutputLevel={speechOutputLevel}
              size="panel"
              onInterrupt={onInterruptSpeech}
            />

            {/* Real-time Transcription Stream */}
            {visualState === 'LISTENING' && transcript && (
              <div className="mt-2 px-3 py-1 bg-cyan-950/60 border border-cyan-400/40 rounded-full text-center max-w-[280px] shadow-[0_0_12px_rgba(0,210,255,0.25)] animate-pulse">
                <p className="text-[11px] text-cyan-200 font-mono italic truncate">
                  "{transcript}"
                </p>
              </div>
            )}
          </div>

          {/* Android 16 Live Metrics Pill Strip */}
          <div className="px-3.5 py-1.5 bg-[#030816] border-b border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-cyan-300">
                <BatteryCharging className="w-3 h-3 text-cyan-400" />
                {telemetry.batteryLevel}%
              </span>
              <span>·</span>
              <span className="text-slate-300">{telemetry.networkType}</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-400/90">
              <span>{calls.filter(c => c.type === 'missed').length} Missed</span>
              <span>·</span>
              <span>{sms.filter(s => s.isUnread).length} SMS</span>
              <span>·</span>
              <span>{tasks.filter(t => !t.isCompleted).length} Tasks</span>
            </div>
          </div>

          {/* Conversation History & Real-Time Responses */}
          <div
            ref={chatScrollRef}
            className="p-3 max-h-[160px] overflow-y-auto space-y-2 bg-[#02050E]/80 divide-y divide-slate-800/40"
          >
            {chatHistory.length > 0 ? (
              chatHistory.slice(-4).map((msg, idx) => (
                <div key={idx} className="pt-2 first:pt-0">
                  <div className="flex items-start gap-2 text-xs">
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        msg.role === 'user'
                          ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}
                    >
                      {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-0.5">
                        <span>{msg.role === 'user' ? 'You' : 'JARVIS (Deep Timbre)'}</span>
                        {msg.role !== 'user' && (
                          <div className="flex items-center gap-1">
                            {onReplaySpeech && (
                              <button
                                onClick={() => onReplaySpeech(msg.text)}
                                title="Replay voice audio"
                                className="hover:text-cyan-300 p-0.5 rounded cursor-pointer"
                              >
                                <RotateCcw className="w-2.5 h-2.5" />
                              </button>
                            )}
                            <button
                              onClick={() => copyText(msg.text, `chat-${idx}`)}
                              title="Copy response"
                              className="hover:text-cyan-300 p-0.5 rounded cursor-pointer"
                            >
                              {copiedId === `chat-${idx}` ? (
                                <Check className="w-2.5 h-2.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-2.5 h-2.5" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                      <p
                        className={`leading-relaxed text-[11px] ${
                          msg.role === 'user' ? 'text-slate-300' : 'text-cyan-100 font-sans'
                        }`}
                      >
                        {msg.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-2 px-1">
                <div className="flex items-start gap-2 text-xs">
                  <div className="w-5 h-5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-0.5">
                      <span>JARVIS (Voice Standby)</span>
                      {onReplaySpeech && (
                        <button
                          onClick={() => onReplaySpeech(lastSpeechResponse)}
                          title="Replay voice audio"
                          className="hover:text-cyan-300 p-0.5 rounded cursor-pointer"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                    <p className="leading-relaxed text-[11px] text-cyan-100">{lastSpeechResponse}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Shortcuts (Directly routed through voice pipeline!) */}
          <div className="px-3 py-1.5 bg-[#030919] border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[10px] font-medium">
            <button
              onClick={() => handleSendQuery('What are my tasks today?')}
              className="px-2.5 py-1 rounded-lg bg-cyan-950/50 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/50 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <CheckSquare className="w-3 h-3 text-cyan-400" />
              Tasks Today
            </button>
            <button
              onClick={() => handleSendQuery('How many missed calls do I have?')}
              className="px-2.5 py-1 rounded-lg bg-blue-950/50 text-blue-300 border border-blue-500/30 hover:bg-blue-900/50 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3 text-blue-400" />
              Missed Calls
            </button>
            <button
              onClick={() => handleSendQuery('Do I have unread messages?')}
              className="px-2.5 py-1 rounded-lg bg-sky-950/50 text-sky-300 border border-sky-500/30 hover:bg-sky-900/50 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3 text-sky-400" />
              Unread SMS
            </button>
            <button
              onClick={() => handleSendQuery('How much battery is remaining?')}
              className="px-2.5 py-1 rounded-lg bg-indigo-950/50 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-900/50 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <BatteryCharging className="w-3 h-3 text-indigo-400" />
              Battery
            </button>
          </div>

          {/* Command Input Bar */}
          <div className="p-3 bg-[#040B1D] border-t border-cyan-500/20 flex items-center gap-2">
            <button
              onClick={onTogglePushToTalk}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                visualState === 'LISTENING'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                  : visualState === 'PAUSED'
                  ? 'bg-slate-800 text-slate-500 border-slate-700'
                  : 'bg-cyan-500/15 text-cyan-400 border-cyan-400/40 hover:bg-cyan-500/25 shadow-[0_0_10px_rgba(0,210,255,0.25)]'
              }`}
              title={
                visualState === 'LISTENING'
                  ? 'Listening... Click to conclude'
                  : 'Push-to-Talk Mic (Say "Hey Jarvis" or Tap)'
              }
            >
              {visualState === 'LISTENING' ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendQuery()}
              placeholder="Ask JARVIS (e.g. 'Read my latest SMS')..."
              className="flex-1 bg-[#02050E] border border-cyan-500/30 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />

            <button
              onClick={() => handleSendQuery()}
              disabled={visualState === 'PROCESSING' || !inputText.trim()}
              className="p-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 text-black font-semibold disabled:opacity-30 hover:from-cyan-300 hover:to-blue-400 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,210,255,0.3)]"
              title="Send Command"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* 2. ANDROID 16 COMPACT FLOATING DYNAMIC BUBBLE */
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={() => {
            if (!isDragging) setIsExpanded(true);
          }}
          className="group relative cursor-pointer select-none"
          title="JARVIS Floating Assistant (Drag anywhere, Tap to expand)"
        >
          {/* Animated Glow Halo */}
          <div
            className={`w-14 h-14 rounded-2xl p-[2px] transition-all duration-300 ${
              visualState === 'WAKE_DETECTED'
                ? 'bg-gradient-to-tr from-cyan-200 via-white to-cyan-400 shadow-[0_0_35px_rgba(0,210,255,1)] scale-110 rotate-6'
                : visualState === 'LISTENING'
                ? 'bg-gradient-to-tr from-cyan-400 via-blue-500 to-cyan-200 shadow-[0_0_28px_rgba(0,210,255,0.85)] scale-105'
                : visualState === 'PROCESSING'
                ? 'bg-gradient-to-tr from-blue-600 via-cyan-400 to-indigo-600 shadow-[0_0_25px_rgba(0,112,243,0.7)] animate-pulse'
                : visualState === 'SPEAKING'
                ? 'bg-gradient-to-tr from-cyan-300 via-blue-400 to-emerald-400 shadow-[0_0_30px_rgba(0,210,255,0.9)] animate-pulse'
                : visualState === 'PAUSED'
                ? 'bg-slate-700 opacity-60'
                : 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-cyan-300 shadow-[0_0_20px_rgba(0,210,255,0.5)] group-hover:shadow-[0_0_30px_rgba(0,210,255,0.8)]'
            }`}
          >
            <div className="w-full h-full rounded-[14px] bg-[#030712] flex items-center justify-center relative overflow-hidden">
              {/* Concentric rotating micro-rings */}
              <div className="absolute inset-1 rounded-xl border border-cyan-400/25 animate-spin-slow pointer-events-none" />

              {/* Central Core */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  visualState === 'SPEAKING'
                    ? 'bg-cyan-400/20 text-cyan-300 scale-110 shadow-[0_0_12px_rgba(0,210,255,0.8)]'
                    : visualState === 'LISTENING'
                    ? 'bg-rose-500/20 text-rose-300 animate-pulse'
                    : 'bg-cyan-950/60 text-cyan-400'
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </div>

              {/* Status Dot */}
              <span
                className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${
                  visualState === 'SPEAKING'
                    ? 'bg-cyan-400 animate-ping'
                    : visualState === 'LISTENING'
                    ? 'bg-rose-400'
                    : visualState === 'PROCESSING'
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
              />
            </div>
          </div>

          {/* Quick Hover Tooltip */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap px-2 py-0.5 bg-black/90 border border-cyan-500/40 rounded-full text-[9px] text-cyan-300 font-mono shadow">
            Tap to expand JARVIS
          </div>
        </div>
      )}
    </div>
  );
};
