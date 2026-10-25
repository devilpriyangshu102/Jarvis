import React from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sliders,
  ShieldCheck,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  Layers,
  Radio,
} from 'lucide-react';
import { WakeWordSettings, PermissionStatusMap } from '../types/jarvis';

interface VoiceWakeWordSettingsProps {
  settings: WakeWordSettings;
  permissions: PermissionStatusMap;
  onUpdateSettings: (newSettings: Partial<WakeWordSettings>) => void;
  onTestWakeWord: () => void;
}

export const VoiceWakeWordSettings: React.FC<VoiceWakeWordSettingsProps> = ({
  settings,
  permissions,
  onUpdateSettings,
  onTestWakeWord,
}) => {
  return (
    <div className="space-y-4 text-slate-100">
      
      {/* Top Banner with Test Wake Word Button */}
      <div className="p-4 bg-gradient-to-r from-[#0B152B] via-[#091E42] to-[#0B152B] border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_30px_rgba(0,112,243,0.2)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              VOICE & WAKE WORD ENGINE
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">● On-Device Keyword Spotting</span>
          </div>
          <h3 className="text-sm font-bold text-white tracking-wide">
            Wake Word: "{settings.wakePhrase}"
          </h3>
          <p className="text-xs text-slate-300">
            Activate JARVIS hands-free by speaking the wake phrase or press push-to-talk.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onUpdateSettings({ isMicPaused: !settings.isMicPaused })}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              settings.isMicPaused
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            {settings.isMicPaused ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-cyan-400" />}
            {settings.isMicPaused ? 'Resume Mic' : 'Pause Mic'}
          </button>

          <button
            onClick={onTestWakeWord}
            className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(0,210,255,0.4)] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            Test Wake Phrase
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        
        {/* Card 1: Activation Modes */}
        <div className="p-4 bg-[#0A1329] border border-cyan-500/20 rounded-2xl space-y-3">
          <h4 className="font-bold text-cyan-300 flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-cyan-400" />
            Activation Mode & Phrase
          </h4>

          {/* Wake Word Enable Toggle */}
          <div className="flex items-center justify-between p-2.5 bg-[#050C1B] rounded-xl border border-slate-800">
            <div>
              <span className="font-semibold text-white block">Wake Word Detection</span>
              <span className="text-[11px] text-slate-400">Continuous on-device hotword listener</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ enabled: !settings.enabled })}
              className={`px-3 py-1 rounded-lg font-medium cursor-pointer ${
                settings.enabled ? 'bg-cyan-500 text-black font-bold' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Wake Phrase Selection */}
          <div className="flex items-center justify-between p-2.5 bg-[#050C1B] rounded-xl border border-slate-800">
            <div>
              <span className="font-semibold text-white block">Configured Wake Phrase</span>
              <span className="text-[11px] text-slate-400">Spoken phrase that triggers activation</span>
            </div>
            <select
              value={settings.wakePhrase}
              onChange={e => onUpdateSettings({ wakePhrase: e.target.value as any })}
              className="bg-[#091530] border border-cyan-500/30 text-cyan-300 rounded-lg px-2.5 py-1 text-xs"
            >
              <option value="Hey Jarvis">"Hey Jarvis"</option>
              <option value="Jarvis">"Jarvis"</option>
            </select>
          </div>

          {/* Hands-Free Mode Toggle */}
          <div className="flex items-center justify-between p-2.5 bg-[#050C1B] rounded-xl border border-slate-800">
            <div>
              <span className="font-semibold text-white block">Hands-Free Mode</span>
              <span className="text-[11px] text-slate-400">Speak naturally without pressing mic button</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ handsFreeEnabled: !settings.handsFreeEnabled })}
              className={`px-3 py-1 rounded-lg font-medium cursor-pointer ${
                settings.handsFreeEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.handsFreeEnabled ? 'Active' : 'Off (Push-to-Talk only)'}
            </button>
          </div>

          {/* Sensitivity Setting */}
          <div className="flex items-center justify-between p-2.5 bg-[#050C1B] rounded-xl border border-slate-800">
            <div>
              <span className="font-semibold text-white block">Acoustic Sensitivity</span>
              <span className="text-[11px] text-slate-400">Higher sensitivity increases distance reach</span>
            </div>
            <div className="flex items-center gap-1">
              {(['low', 'medium', 'high'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => onUpdateSettings({ sensitivity: level })}
                  className={`px-2 py-1 rounded-md text-[10px] uppercase font-mono cursor-pointer ${
                    settings.sensitivity === level
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 text-slate-500 hover:text-white'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Voice & Interaction Parameters */}
        <div className="p-4 bg-[#0A1329] border border-cyan-500/20 rounded-2xl space-y-3">
          <h4 className="font-bold text-cyan-300 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Speech & Audio Parameters
          </h4>

          {/* Voice Response (TTS) */}
          <div className="flex items-center justify-between p-2.5 bg-[#050C1B] rounded-xl border border-slate-800">
            <div>
              <span className="font-semibold text-white block">Spoken Voice Responses (TTS)</span>
              <span className="text-[11px] text-slate-400">Speak answers aloud using vocal synthesis</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ voiceResponseEnabled: !settings.voiceResponseEnabled })}
              className={`px-3 py-1 rounded-lg font-medium cursor-pointer ${
                settings.voiceResponseEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.voiceResponseEnabled ? 'Enabled' : 'Text Only'}
            </button>
          </div>

          {/* Listening Timeout */}
          <div className="flex items-center justify-between p-2.5 bg-[#050C1B] rounded-xl border border-slate-800">
            <div>
              <span className="font-semibold text-white block">Silence Timeout</span>
              <span className="text-[11px] text-slate-400">Duration before returning to standby</span>
            </div>
            <select
              value={settings.listeningTimeoutSeconds}
              onChange={e => onUpdateSettings({ listeningTimeoutSeconds: parseInt(e.target.value, 10) })}
              className="bg-[#091530] border border-cyan-500/30 text-cyan-300 rounded-lg px-2.5 py-1 text-xs"
            >
              <option value="3">3 seconds</option>
              <option value="5">5 seconds (Recommended)</option>
              <option value="8">8 seconds</option>
              <option value="10">10 seconds</option>
            </select>
          </div>

          {/* Animation Intensity */}
          <div className="flex items-center justify-between p-2.5 bg-[#050C1B] rounded-xl border border-slate-800">
            <div>
              <span className="font-semibold text-white block">Holographic Animation Intensity</span>
              <span className="text-[11px] text-slate-400">Concentric rings & audio-reactive waves</span>
            </div>
            <select
              value={settings.animationIntensity}
              onChange={e => onUpdateSettings({ animationIntensity: e.target.value as any })}
              className="bg-[#091530] border border-cyan-500/30 text-cyan-300 rounded-lg px-2.5 py-1 text-xs"
            >
              <option value="low">Battery Saver (Low)</option>
              <option value="medium">Balanced</option>
              <option value="high">Full Holographic (High)</option>
            </select>
          </div>

          {/* Real-time Transcription Display */}
          <div className="flex items-center justify-between p-2.5 bg-[#050C1B] rounded-xl border border-slate-800">
            <div>
              <span className="font-semibold text-white block">Real-time Transcription</span>
              <span className="text-[11px] text-slate-400">Display recognized words as you speak</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ realtimeTranscriptionEnabled: !settings.realtimeTranscriptionEnabled })}
              className={`px-3 py-1 rounded-lg font-medium cursor-pointer ${
                settings.realtimeTranscriptionEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.realtimeTranscriptionEnabled ? 'Shown' : 'Hidden'}
            </button>
          </div>
        </div>

      </div>

      {/* Privacy & Android Operating System Constraints Banner */}
      <div className="p-4 bg-[#050C1B] border border-cyan-500/20 rounded-2xl space-y-2 text-xs">
        <h4 className="font-bold text-white flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Android Background & Privacy Architecture
        </h4>
        <p className="text-slate-300 leading-relaxed text-[11px]">
          JARVIS processes the wake phrase locally on-device. Audio is <span className="text-white font-medium">never</span> streamed to cloud servers for wake detection. On Android 14+, continuous background listening requires the persistent foreground service notification (<code className="text-cyan-400 font-mono">FOREGROUND_SERVICE_MICROPHONE</code>).
        </p>
      </div>

    </div>
  );
};
