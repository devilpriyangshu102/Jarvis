import React, { useState } from 'react';
import {
  Wifi,
  Battery,
  BatteryCharging,
  Signal,
  Smartphone,
  Layers,
  Monitor,
  Code,
  Sparkles,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { PhoneTelemetry } from '../types/jarvis';

interface PhoneSimulatorFrameProps {
  telemetry: PhoneTelemetry;
  children: React.ReactNode;
  floatingOverlayElement: React.ReactNode;
  activeViewMode: 'phone' | 'floating_demo' | 'fullscreen' | 'exporter' | 'workstation';
  onChangeViewMode: (mode: 'phone' | 'floating_demo' | 'fullscreen' | 'exporter' | 'workstation') => void;
  overlayActive: boolean;
  onToggleOverlay: () => void;
}

export const PhoneSimulatorFrame: React.FC<PhoneSimulatorFrameProps> = ({
  telemetry,
  children,
  floatingOverlayElement,
  activeViewMode,
  onChangeViewMode,
  overlayActive,
  onToggleOverlay,
}) => {
  const [backgroundApp, setBackgroundApp] = useState<'homescreen' | 'browser' | 'notes'>('homescreen');

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-2 sm:p-4">
      
      {/* Android 16 Viewport Mode Switcher */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#060E21] border border-cyan-500/30 rounded-2xl shadow-[0_0_25px_rgba(0,180,255,0.18)] text-xs">
        <button
          onClick={() => onChangeViewMode('phone')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer font-medium ${
            activeViewMode === 'phone'
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold shadow-[0_0_15px_rgba(0,210,255,0.4)]'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Android 16 Phone View
        </button>

        <button
          onClick={() => onChangeViewMode('floating_demo')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer font-medium ${
            activeViewMode === 'floating_demo'
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold shadow-[0_0_15px_rgba(0,210,255,0.4)]'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          Floating Island (Over OS)
        </button>

        <button
          onClick={() => onChangeViewMode('workstation')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer font-medium ${
            activeViewMode === 'workstation' || activeViewMode === 'fullscreen'
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold shadow-[0_0_15px_rgba(0,210,255,0.4)]'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Monitor className="w-4 h-4" />
          Workstation Suite
        </button>

        <button
          onClick={() => onChangeViewMode('exporter')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer font-medium ${
            activeViewMode === 'exporter'
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold shadow-[0_0_15px_rgba(0,210,255,0.4)]'
              : 'text-cyan-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Code className="w-4 h-4" />
          Android Studio Project & APK
        </button>
      </div>

      {/* VIEWPORT CANVAS */}
      {activeViewMode === 'fullscreen' ? (
        <div className="w-full max-w-5xl bg-[#030712] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden min-h-[640px] relative">
          {children}
          {floatingOverlayElement}
        </div>
      ) : activeViewMode === 'exporter' ? (
        <div className="w-full max-w-5xl">
          {children}
        </div>
      ) : activeViewMode === 'floating_demo' ? (
        /* Floating Overlay Simulated Environment (Android 16 System Overlay) */
        <div className="relative w-full max-w-[420px] h-[790px] bg-[#02050E] rounded-[48px] border-[5px] border-[#0E1D3D] shadow-[0_0_55px_rgba(0,180,255,0.3)] overflow-hidden flex flex-col ring-1 ring-cyan-500/30">
          
          {/* Android 16 Status Bar with Dynamic Island Cutout */}
          <div className="h-8 px-6 bg-[#030714] flex items-center justify-between text-[11px] text-slate-300 font-mono z-30 select-none border-b border-white/5">
            <span className="font-semibold text-white">09:41</span>
            
            {/* Android 16 Dynamic Pill / Live Activity Notch */}
            <div className="px-3 py-0.5 bg-black rounded-full flex items-center gap-1.5 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,210,255,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[9px] text-cyan-300 font-mono">JARVIS Live</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-cyan-400 font-semibold">5G+</span>
              <Signal className="w-3 h-3 text-cyan-400" />
              <Wifi className="w-3 h-3 text-slate-200" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">{telemetry.batteryLevel}%</span>
                {telemetry.isCharging ? (
                  <BatteryCharging className="w-3.5 h-3.5 text-cyan-300" />
                ) : (
                  <Battery className="w-3.5 h-3.5 text-cyan-300" />
                )}
              </div>
            </div>
          </div>

          {/* Underlying Application Selector Header */}
          <div className="px-4 py-2 bg-[#07132B] border-b border-cyan-500/20 flex items-center justify-between text-xs z-10">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Underlying OS:</span>
              <select
                value={backgroundApp}
                onChange={e => setBackgroundApp(e.target.value as any)}
                className="bg-[#030816] border border-cyan-500/30 text-cyan-300 rounded-lg px-2 py-0.5 text-xs outline-none"
              >
                <option value="homescreen">Android 16 Home Launcher</option>
                <option value="browser">Chrome (Browsing)</option>
                <option value="notes">Keep Notes</option>
              </select>
            </div>
            <button
              onClick={() => onChangeViewMode('phone')}
              className="text-[10px] text-cyan-400 hover:underline cursor-pointer font-medium"
            >
              Open JARVIS App
            </button>
          </div>

          {/* Underlying App Screen */}
          <div className="flex-1 bg-gradient-to-b from-[#050D20] via-[#030815] to-[#01040A] p-6 relative overflow-hidden flex flex-col justify-between">
            {backgroundApp === 'homescreen' && (
              <div className="space-y-6">
                <div className="text-center pt-8">
                  <h3 className="text-5xl font-light text-white font-mono tracking-tighter">09:41</h3>
                  <p className="text-xs text-cyan-400 mt-2 font-medium">Friday, October 24 · 72°F Sunny · Silicon Valley</p>
                </div>
                <div className="grid grid-cols-4 gap-4 pt-12">
                  {['Phone', 'Messages', 'Camera', 'Chrome', 'Maps', 'Gmail', 'Spotify', 'Settings'].map(app => (
                    <div key={app} className="flex flex-col items-center gap-1.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700/80 border border-slate-600/50 flex items-center justify-center text-cyan-300 text-xs font-bold shadow-lg">
                        {app[0]}
                      </div>
                      <span className="text-[10px] text-slate-300 font-medium">{app}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {backgroundApp === 'browser' && (
              <div className="space-y-4 pt-2">
                <div className="p-3 bg-[#06122C] rounded-2xl border border-cyan-500/20 text-xs text-slate-400 font-mono">
                  https://developer.android.com/about/versions/16
                </div>
                <div className="p-4 bg-[#050E24] rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
                  <h4 className="font-bold text-white text-sm">Android 16 Floating Windows & M3 Expressive</h4>
                  <p className="leading-relaxed">
                    Android 16 enhances <code className="text-cyan-400 font-mono">SYSTEM_ALERT_WINDOW</code> with predictive back gestures, edge-to-edge rendering, and adaptive floating bubbles.
                  </p>
                </div>
              </div>
            )}

            {backgroundApp === 'notes' && (
              <div className="space-y-3 pt-2">
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs space-y-1">
                  <h4 className="font-bold text-amber-300">Android 16 Project Notes</h4>
                  <p className="text-slate-300">
                    JARVIS floating assistant overlay functions continuously over any running app. Drag the pill to move it or tap to invoke voice assistance.
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Gesture Navigation Pill */}
            <div className="w-full flex justify-center py-2">
              <div className="w-32 h-1.5 bg-slate-500/60 rounded-full" />
            </div>

            {/* Floating Assistant Overlay */}
            {floatingOverlayElement}
          </div>

        </div>
      ) : (
        /* Standard Android 16 Smartphone View */
        <div className="relative w-full max-w-[420px] h-[790px] bg-[#02050E] rounded-[48px] border-[5px] border-[#0E1D3D] shadow-[0_0_55px_rgba(0,180,255,0.3)] overflow-hidden flex flex-col ring-1 ring-cyan-500/30">
          
          {/* Android 16 Edge-to-Edge Status Bar */}
          <div className="h-8 px-6 bg-[#040A1A] flex items-center justify-between text-[11px] text-slate-300 font-mono z-30 select-none border-b border-white/5">
            <span className="font-semibold text-white">09:41</span>
            
            {/* Android 16 Dynamic Camera Punch Hole Pill */}
            <div className="w-20 h-4 bg-black rounded-full flex items-center justify-center border border-cyan-500/30 shadow-[0_0_8px_rgba(0,210,255,0.2)]">
              <span className="w-2 h-2 bg-[#091530] rounded-full" />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-cyan-400 font-semibold">5G+</span>
              <Signal className="w-3 h-3 text-cyan-400" />
              <Wifi className="w-3 h-3 text-slate-200" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">{telemetry.batteryLevel}%</span>
                {telemetry.isCharging ? (
                  <BatteryCharging className="w-3.5 h-3.5 text-cyan-300" />
                ) : (
                  <Battery className="w-3.5 h-3.5 text-cyan-300" />
                )}
              </div>
            </div>
          </div>

          {/* Smartphone Screen Content */}
          <div className="flex-1 overflow-hidden relative flex flex-col">
            {children}
            {floatingOverlayElement}
          </div>

          {/* Bottom Android 16 Gesture Navigation Bar */}
          <div className="h-4 bg-[#030714] flex items-center justify-center select-none z-30">
            <div className="w-28 h-1 bg-slate-500/60 rounded-full" />
          </div>

        </div>
      )}

    </div>
  );
};
