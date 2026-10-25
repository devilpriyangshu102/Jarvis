import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Square,
  Sparkles,
  Wifi,
  WifiOff,
  Search,
  Volume2,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { JarvisOrbVisualizer } from '../JarvisOrbVisualizer';
import {
  AssistantVisualState,
  PhoneTelemetry,
  WakeWordSettings,
  JarvisNavigationSection,
} from '../../types/jarvis';

interface AssistantHomeSectionProps {
  visualState: AssistantVisualState;
  audioLevel: number;
  speechOutputLevel: number;
  wakeWordSettings: WakeWordSettings;
  telemetry: PhoneTelemetry;
  lastSpeechResponse: string;
  transcript: string;
  onSendMessage: (query: string) => Promise<string>;
  onTogglePushToTalk: () => void;
  onInterruptSpeech: () => void;
  onReplaySpeech: (text: string) => void;
  onNavigate: (section: JarvisNavigationSection) => void;
  onTriggerWakeWord: () => void;
}

export const AssistantHomeSection: React.FC<AssistantHomeSectionProps> = ({
  visualState,
  audioLevel,
  speechOutputLevel,
  wakeWordSettings,
  telemetry,
  lastSpeechResponse,
  transcript,
  onSendMessage,
  onTogglePushToTalk,
  onInterruptSpeech,
  onReplaySpeech,
  onNavigate,
  onTriggerWakeWord,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSubmitting) return;

    const query = inputText.trim();
    setInputText('');
    setIsSubmitting(true);
    try {
      await onSendMessage(query);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickPrompts = [
    { label: 'Check battery status', query: 'What is my current battery level and power status?' },
    { label: 'Run diagnostics', query: 'Run a full system diagnostic check on all subsystems.' },
    { label: 'Search Android 16 specs', query: 'What are the main developer highlights in Android 16?' },
    { label: 'Create reminder', query: 'Remind me to review Android release build at 4:00 PM' },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between p-6 max-w-4xl mx-auto w-full select-none overflow-y-auto">
      {/* 1. Header Status Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-white font-mono">PROJECT JARVIS</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              Android 16 Primary Agent
            </span>
          </div>
        </div>

        {/* Real Status Flags */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5" title="Internet Connectivity">
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span className={isOnline ? 'text-slate-300' : 'text-rose-400'}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          <div className="flex items-center gap-1.5" title="Battery Status">
            <span className="text-cyan-400 font-bold tabular-nums">{telemetry.batteryLevel}%</span>
            <span>{telemetry.isCharging ? '⚡' : ''}</span>
          </div>

          <div className="flex items-center gap-1.5" title="Security Confirmation Gate">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">Tier-3 Gate</span>
          </div>
        </div>
      </div>

      {/* 2. Central Assistant Visualizer */}
      <div className="my-auto py-8 flex flex-col items-center justify-center">
        <JarvisOrbVisualizer
          visualState={visualState}
          audioLevel={audioLevel}
          speechOutputLevel={speechOutputLevel}
          size="hero"
          onInterrupt={onInterruptSpeech}
        />

        {/* Live Transcript / Response Preview */}
        <div className="mt-6 w-full max-w-lg text-center px-4">
          {transcript ? (
            <div className="text-sm font-medium text-cyan-300 animate-pulse bg-cyan-950/30 p-2.5 rounded-xl border border-cyan-500/20">
              "{transcript}"
            </div>
          ) : lastSpeechResponse ? (
            <div className="text-sm text-slate-300 leading-relaxed bg-[#050C1B]/80 p-3.5 rounded-xl border border-cyan-500/20 shadow-lg relative group">
              <p>"{lastSpeechResponse}"</p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <button
                  onClick={() => onReplaySpeech(lastSpeechResponse)}
                  className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3 h-3" />
                  Replay Audio
                </button>
                <span className="text-slate-600">·</span>
                <button
                  onClick={() => onNavigate('conversation')}
                  className="text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  View Conversation Log
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-xs font-mono text-slate-500">
              Say "{wakeWordSettings.wakePhrase}" or type a command below
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-xl">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(p.query)}
              className="px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 transition-all cursor-pointer whitespace-nowrap"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Input Controls Bar */}
      <div className="pt-4 border-t border-cyan-500/15">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Working Microphone Toggle */}
          <button
            type="button"
            onClick={onTogglePushToTalk}
            className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              visualState === 'LISTENING'
                ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse'
                : 'bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,210,255,0.2)]'
            }`}
            title={visualState === 'LISTENING' ? 'Tap to stop listening' : 'Tap to speak'}
          >
            {visualState === 'LISTENING' ? (
              <Square className="w-5 h-5 fill-white" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {/* Text Message Field */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask JARVIS anything or instruct a phone action..."
              className="w-full bg-[#050C1B] border border-cyan-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
              disabled={isSubmitting}
            />
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-mono cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isSubmitting}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:pointer-events-none text-black font-bold text-xs shadow-[0_0_15px_rgba(0,210,255,0.3)] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer Navigation Helpers */}
        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('diagnostics')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Diagnostics
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('browser')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Web Browser
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('repair')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Self-Repair
            </button>
          </div>

          <button
            onClick={onTriggerWakeWord}
            className="hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Test Wake Word ({wakeWordSettings.wakePhrase})
          </button>
        </div>
      </div>
    </div>
  );
};
