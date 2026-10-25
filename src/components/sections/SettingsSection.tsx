import React from 'react';
import {
  Settings,
  Mic,
  Battery,
  Shield,
  Layers,
  Volume2,
  Sliders,
  Check,
} from 'lucide-react';
import {
  WakeWordSettings,
  BatteryProfile,
  PermissionStatusMap,
} from '../../types/jarvis';

interface SettingsSectionProps {
  wakeWordSettings: WakeWordSettings;
  onUpdateWakeSettings: (newSettings: Partial<WakeWordSettings>) => void;
  activeProfile: BatteryProfile;
  onSetBatteryProfile: (profile: BatteryProfile) => void;
  overlayActive: boolean;
  onToggleOverlay: () => void;
  permissions: PermissionStatusMap;
  onUpdatePermission: (key: keyof PermissionStatusMap, val: boolean) => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  wakeWordSettings,
  onUpdateWakeSettings,
  activeProfile,
  onSetBatteryProfile,
  overlayActive,
  onToggleOverlay,
  permissions,
  onUpdatePermission,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#030712] select-none overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h1 className="text-base font-bold text-white font-mono">APPLICATION SETTINGS & PREFERENCES</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure ambient hotword detection, battery execution profiles, and Android permissions
          </p>
        </div>
      </div>

      {/* Wake Word Configuration */}
      <div className="p-5 rounded-2xl bg-[#050C1B] border border-cyan-500/20 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Wake Word & Voice Hotword Engine
            </h2>
          </div>
          <span className="text-[10px] font-mono text-cyan-300">
            {wakeWordSettings.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Wake Phrase */}
          <div className="p-3.5 rounded-xl bg-[#030712] border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-200">Wake-Up Keyword Phrase</label>
            <div className="flex items-center gap-2">
              {(['Hey Jarvis', 'Jarvis'] as const).map((phrase) => (
                <button
                  key={phrase}
                  onClick={() => onUpdateWakeSettings({ wakePhrase: phrase })}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                    wakeWordSettings.wakePhrase === phrase
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  "{phrase}"
                </button>
              ))}
            </div>
            <p className="text-[11px] font-mono text-slate-500">
              Keyword spotted on-device with zero server streaming until detected.
            </p>
          </div>

          {/* Sensitivity */}
          <div className="p-3.5 rounded-xl bg-[#030712] border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-200">Acoustic Sensitivity</label>
            <div className="flex items-center gap-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => onUpdateWakeSettings({ sensitivity: level })}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer border ${
                    wakeWordSettings.sensitivity === level
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-[11px] font-mono text-slate-500">
              Higher sensitivity triggers faster in noisy environments.
            </p>
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label className="p-3 rounded-xl bg-[#030712] border border-slate-800 flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-xs font-semibold text-white">Voice Speech Synthesis (TTS)</div>
              <div className="text-[11px] text-slate-500 font-mono">Speak AI responses aloud</div>
            </div>
            <input
              type="checkbox"
              checked={wakeWordSettings.voiceResponseEnabled}
              onChange={(e) => onUpdateWakeSettings({ voiceResponseEnabled: e.target.checked })}
              className="accent-cyan-400 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="p-3 rounded-xl bg-[#030712] border border-slate-800 flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-xs font-semibold text-white">Realtime Transcription</div>
              <div className="text-[11px] text-slate-500 font-mono">Show live words while speaking</div>
            </div>
            <input
              type="checkbox"
              checked={wakeWordSettings.realtimeTranscriptionEnabled}
              onChange={(e) => onUpdateWakeSettings({ realtimeTranscriptionEnabled: e.target.checked })}
              className="accent-cyan-400 w-4 h-4 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Battery Profiles */}
      <div className="p-5 rounded-2xl bg-[#050C1B] border border-cyan-500/20 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Battery className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Android 16 Power & Background Profiles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              id: 'saver',
              title: 'Battery Saver',
              desc: 'On-demand execution only. Ambient mic paused when app is closed.',
            },
            {
              id: 'balanced',
              title: 'Balanced (Default)',
              desc: 'Lightweight periodic polling and adaptive acoustic triggers.',
            },
            {
              id: 'always_available',
              title: 'Always Available',
              desc: 'Foreground Service (FGS) keeps floating bubble and listener ready 24/7.',
            },
          ].map((prof) => (
            <button
              key={prof.id}
              onClick={() => onSetBatteryProfile(prof.id as BatteryProfile)}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                activeProfile === prof.id
                  ? 'bg-cyan-950/80 border-cyan-500/50 text-white shadow-[0_0_15px_rgba(0,210,255,0.15)]'
                  : 'bg-[#030712] border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-cyan-300">{prof.title}</span>
                {activeProfile === prof.id && <Check className="w-4 h-4 text-cyan-400" />}
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-2 leading-relaxed">{prof.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Overlay Window Toggle */}
      <div className="p-5 rounded-2xl bg-[#050C1B] border border-cyan-500/20 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Floating Assistant Overlay Window
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Displays draggable floating bubble over Android screen using TYPE_APPLICATION_OVERLAY
          </p>
        </div>

        <button
          onClick={onToggleOverlay}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
            overlayActive
              ? 'bg-cyan-400 text-black border-cyan-300 shadow-md'
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
        >
          {overlayActive ? 'Active' : 'Disabled'}
        </button>
      </div>
    </div>
  );
};
