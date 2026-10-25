import React from 'react';
import {
  Info,
  Smartphone,
  Shield,
  Download,
  Code,
  Layers,
  Cpu,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { JarvisNavigationSection } from '../../types/jarvis';

interface AppInfoSectionProps {
  onNavigate: (section: JarvisNavigationSection) => void;
}

export const AppInfoSection: React.FC<AppInfoSectionProps> = ({ onNavigate }) => {
  const permissionsList = [
    { perm: 'android.permission.INTERNET', reason: 'Query AI models, web research, and sync tasks' },
    { perm: 'android.permission.ACCESS_NETWORK_STATE', reason: 'Inspect Wi-Fi / 5G connectivity' },
    { perm: 'android.permission.RECORD_AUDIO', reason: 'Speech recognition and on-device wake-word spotting' },
    { perm: 'android.permission.SYSTEM_ALERT_WINDOW', reason: 'Display floating assistant bubble over all apps' },
    { perm: 'android.permission.FOREGROUND_SERVICE', reason: 'Maintain active background listener service' },
    { perm: 'android.permission.FOREGROUND_SERVICE_MICROPHONE', reason: 'Android 14+ requirement for background mic' },
    { perm: 'android.permission.FOREGROUND_SERVICE_SPECIAL_USE', reason: 'Floating overlay window service execution' },
    { perm: 'android.permission.POST_NOTIFICATIONS', reason: 'Alert user of scheduled reminders and alerts' },
    { perm: 'android.permission.WAKE_LOCK', reason: 'Prevent CPU sleep during active voice interaction' },
    { perm: 'android.permission.RECEIVE_BOOT_COMPLETED', reason: 'Restart reminder alarms after phone reboot' },
    { perm: 'android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS', reason: 'Prevent Doze mode from freezing assistant' },
    { perm: 'android.permission.READ_CONTACTS', reason: 'Optional: Resolve caller names for voice dialing' },
    { perm: 'android.permission.READ_SMS / SEND_SMS', reason: 'Optional: Inbox review & security-gated SMS dispatch' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030712] select-none overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-cyan-400" />
            <h1 className="text-base font-bold text-white font-mono">APPLICATION SPECIFICATIONS & ARCHITECTURE</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Project JARVIS — Designed for Android 16 (API 36 Baklava)
          </p>
        </div>

        <a
          href="/api/android/download-project"
          download="Project-JARVIS-Android-Studio.zip"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download Android Project</span>
        </a>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#050C1B] border border-cyan-500/20">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Target Platform</div>
          <div className="text-base font-bold font-mono text-white mt-1">Android 16</div>
          <div className="text-[10px] font-mono text-cyan-400 mt-0.5">compileSdk 36 · targetSdk 36</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#050C1B] border border-cyan-500/20">
          <div className="text-[10px] font-mono text-slate-400 uppercase">App Package Name</div>
          <div className="text-xs font-bold font-mono text-white mt-1.5 truncate">com.project.jarvis</div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">Version 1.0.0 (Code 1)</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#050C1B] border border-cyan-500/20">
          <div className="text-[10px] font-mono text-slate-400 uppercase">UI & Graphics</div>
          <div className="text-base font-bold font-mono text-white mt-1">Jetpack Compose</div>
          <div className="text-[10px] font-mono text-cyan-400 mt-0.5">Material 3 · Edge-to-Edge</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#050C1B] border border-cyan-500/20">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Database Layer</div>
          <div className="text-base font-bold font-mono text-white mt-1">Room 2.6.1</div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">SQLite + WorkManager</div>
        </div>
      </div>

      {/* Privacy & Zero-Slop Architecture */}
      <div className="p-5 rounded-2xl bg-[#050C1B] border border-cyan-500/20 space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Privacy & 3-Tier Security Architecture
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          Project JARVIS strictly enforces privacy-first execution. The AI model is never granted unrestricted
          device access. All phone interactions pass through a deterministic 3-tier security gate:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-[#030712] border border-slate-800">
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300">
              Tier 1: Low Risk
            </span>
            <div className="text-xs font-semibold text-white mt-2">Immediate Execution</div>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              Task creation, battery telemetry, Wi-Fi status, web search, public information retrieval.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#030712] border border-slate-800">
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300">
              Tier 2: Authorized
            </span>
            <div className="text-xs font-semibold text-white mt-2">Permission Verified</div>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              Call log summaries, unread SMS counts, notification reading. Requires explicit OS permission.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#030712] border border-slate-800">
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">
              Tier 3: Sensitive Action Gate
            </span>
            <div className="text-xs font-semibold text-white mt-2">Explicit User Modal Confirmation</div>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              Sending SMS, sending email, placing calls, deleting tasks. Impossible to execute without user approval.
            </p>
          </div>
        </div>
      </div>

      {/* Permissions Breakdown */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Declared Android Permissions (13 Total)
        </h2>

        <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#050C1B]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#030712] border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Permission Identifier</th>
                  <th className="py-2.5 px-4 font-semibold">Purpose & Android Security Justification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {permissionsList.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-4 text-cyan-300 font-semibold whitespace-nowrap">{p.perm}</td>
                    <td className="py-2.5 px-4 text-slate-300">{p.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Navigation Shortcut to Exporter */}
      <div className="p-4 rounded-xl bg-[#050C1B] border border-cyan-500/30 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-white font-mono">Ready to inspect Android Studio files?</div>
          <p className="text-xs text-slate-400 mt-0.5">
            View Kotlin services, Room database entities, and build instructions in the Android Studio Exporter.
          </p>
        </div>

        <button
          onClick={() => onNavigate('exporter')}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs font-mono flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>Open Exporter</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
