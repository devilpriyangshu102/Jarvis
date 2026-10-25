import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  BatteryCharging,
  Mic,
  BellRing,
  PhoneCall,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  ExternalLink,
} from 'lucide-react';
import { PermissionStatusMap } from '../types/jarvis';

interface FirstLaunchWizardProps {
  permissions: PermissionStatusMap;
  onUpdatePermission: (key: keyof PermissionStatusMap, value: boolean) => void;
  onFinishSetup: () => void;
}

export const FirstLaunchWizard: React.FC<FirstLaunchWizardProps> = ({
  permissions,
  onUpdatePermission,
  onFinishSetup,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 7;

  return (
    <div className="w-full max-w-xl mx-auto bg-gradient-to-b from-[#0A1329] to-[#050B18] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,112,243,0.25)] text-slate-100 animate-fade-in">
      
      {/* Wizard Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">JARVIS Privacy & Permission Wizard</h2>
            <p className="text-xs text-cyan-400/80">Step {currentStep} of {totalSteps}</p>
          </div>
        </div>
        <div className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800/80 text-cyan-300 border border-cyan-500/30">
          Android 16 Compliant
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* STEP 1: Display Over Other Apps */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Step 1: Display Over Other Apps</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                This permission allows JARVIS to appear as an unobtrusive, movable floating bubble over other applications when you need quick assistance without leaving your active app.
              </p>
            </div>
          </div>

          <div className="bg-[#050C1B] rounded-xl p-4 border border-cyan-500/20 text-xs text-slate-300 space-y-2">
            <p className="font-semibold text-cyan-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Privacy Assurance:
            </p>
            <p>
              Granting overlay permission does <span className="text-white font-medium">NOT</span> allow JARVIS to read the screens of other apps or intercept passwords. It only provides a lightweight window for the floating assistant bubble.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => onUpdatePermission('overlay', !permissions.overlay)}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                permissions.overlay
                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                  : 'bg-cyan-500 text-black font-semibold hover:bg-cyan-400'
              }`}
            >
              {permissions.overlay ? <Check className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
              {permissions.overlay ? 'Overlay Permission Granted' : 'Enable Floating Assistant (System Settings)'}
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Background Operation */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Cpu className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Step 2: Background Operation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Background operation allows JARVIS to remain ready to assist you and monitor scheduled alarms even when switching between applications.
              </p>
            </div>
          </div>

          <div className="bg-[#050C1B] rounded-xl p-4 border border-cyan-500/20 text-xs text-slate-300 space-y-2">
            <p className="font-semibold text-cyan-400">Foreground Service Architecture:</p>
            <p>
              JARVIS strictly conforms to Android 14+ background policies using declared foreground service types and a transparent persistent status notification. Android may still pause activity under heavy memory pressure.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => onUpdatePermission('background', !permissions.background)}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                permissions.background
                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                  : 'bg-cyan-500 text-black font-semibold hover:bg-cyan-400'
              }`}
            >
              {permissions.background ? <Check className="w-4 h-4" /> : null}
              {permissions.background ? 'Background Service Configured' : 'Configure Background Operation'}
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Battery Optimization */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <BatteryCharging className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Step 3: Battery Optimization Exemption</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Aggressive battery savers can unexpectedly kill assistant background reminders. Review your battery optimization settings to prevent missed alerts.
              </p>
            </div>
          </div>

          <div className="bg-[#050C1B] rounded-xl p-4 border border-cyan-500/20 text-xs text-slate-300 space-y-2">
            <p className="font-semibold text-amber-400">Transparent System Policy:</p>
            <p>
              JARVIS never silently grants exemptions or bypasses OS limits. Exemption is optional and can be toggled any time via device settings. Unrestricted settings reduce scheduling jitter but slightly increase standby battery consumption.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => onUpdatePermission('batteryOptimization', !permissions.batteryOptimization)}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                permissions.batteryOptimization
                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                  : 'bg-cyan-500 text-black font-semibold hover:bg-cyan-400'
              }`}
            >
              {permissions.batteryOptimization ? <Check className="w-4 h-4" /> : null}
              {permissions.batteryOptimization ? 'Exemption Reviewed (Unrestricted)' : 'Review Battery Settings (ACTION_REQUEST)'}
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Microphone */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Mic className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Step 4: Voice Commands (Microphone)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Microphone access enables natural voice commands and hands-free conversational queries.
              </p>
            </div>
          </div>

          <div className="bg-[#050C1B] rounded-xl p-4 border border-cyan-500/20 text-xs text-slate-300 space-y-2">
            <p className="font-semibold text-emerald-400">Strict Push-To-Talk Default:</p>
            <p>
              JARVIS does <span className="text-white font-medium">NOT</span> continuously or secretly record in the background. Audio capture is activated only when you explicitly press the microphone button or trigger the push-to-talk control.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => onUpdatePermission('microphone', !permissions.microphone)}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                permissions.microphone
                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                  : 'bg-cyan-500 text-black font-semibold hover:bg-cyan-400'
              }`}
            >
              {permissions.microphone ? <Check className="w-4 h-4" /> : null}
              {permissions.microphone ? 'Microphone Permission Granted' : 'Grant Microphone Permission'}
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Notification Access */}
      {currentStep === 5 && (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <BellRing className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Step 5: Notification Access (Optional)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Allows JARVIS to summarize incoming notifications from selected apps like WhatsApp, SMS, or Calendar.
              </p>
            </div>
          </div>

          <div className="bg-[#050C1B] rounded-xl p-4 border border-cyan-500/20 text-xs text-slate-300 space-y-2">
            <p className="font-semibold text-cyan-400">Zero Cloud Upload of Notifications:</p>
            <p>
              Notifications can contain personal details. By default, notification data is stored locally in device memory and encrypted with Android Keystore. You can exclude sensitive banking apps at any time.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => onUpdatePermission('notificationListener', !permissions.notificationListener)}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                permissions.notificationListener
                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                  : 'bg-cyan-500 text-black font-semibold hover:bg-cyan-400'
              }`}
            >
              {permissions.notificationListener ? <Check className="w-4 h-4" /> : null}
              {permissions.notificationListener ? 'Notification Listener Active' : 'Open Notification Listener Settings'}
            </button>
            <button
              onClick={() => setCurrentStep(6)}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Optional Communication Permissions */}
      {currentStep === 6 && (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <PhoneCall className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Step 6: Optional Communication Permissions</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enable individual communication features when needed. You may toggle any of these independently:
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {/* Contacts */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#050C1B] border border-cyan-500/20 text-xs">
              <div>
                <p className="font-medium text-white">Contacts (READ_CONTACTS)</p>
                <p className="text-slate-400 text-[11px]">Resolve contact names for calls and drafted messages.</p>
              </div>
              <button
                onClick={() => onUpdatePermission('contacts', !permissions.contacts)}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
                  permissions.contacts ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {permissions.contacts ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Call Log */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#050C1B] border border-cyan-500/20 text-xs">
              <div>
                <p className="font-medium text-white">Call Log (READ_CALL_LOG)</p>
                <p className="text-slate-400 text-[11px]">Allow JARVIS to count missed calls and summarize calling activity.</p>
              </div>
              <button
                onClick={() => onUpdatePermission('callLog', !permissions.callLog)}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
                  permissions.callLog ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {permissions.callLog ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* SMS */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#050C1B] border border-cyan-500/20 text-xs">
              <div>
                <p className="font-medium text-white">SMS Messaging (READ_SMS & SEND_SMS)</p>
                <p className="text-slate-400 text-[11px]">Read unread counts and draft messages. Sending always requires confirmation.</p>
              </div>
              <button
                onClick={() => onUpdatePermission('sms', !permissions.sms)}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
                  permissions.sms ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {permissions.sms ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setCurrentStep(7)}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              Review Permission Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: Permission Dashboard */}
      {currentStep === 7 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Step 7: Permissions Status Dashboard</h3>
            <p className="text-xs text-slate-300">
              Review current permission states. All features remain transparent and revocable at any time in Android Settings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <PermissionBadge label="Floating Overlay" enabled={permissions.overlay} required />
            <PermissionBadge label="Background Service" enabled={permissions.background} required />
            <PermissionBadge label="Battery Optimization" enabled={permissions.batteryOptimization} optional />
            <PermissionBadge label="Microphone (Push-to-Talk)" enabled={permissions.microphone} required />
            <PermissionBadge label="Notification Listener" enabled={permissions.notificationListener} optional />
            <PermissionBadge label="Contacts Read" enabled={permissions.contacts} optional />
            <PermissionBadge label="Call Log Access" enabled={permissions.callLog} optional />
            <PermissionBadge label="SMS Read & Prepare" enabled={permissions.sms} optional />
          </div>

          <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs text-cyan-200">
            You may continue without optional permissions. Unavailable features will be gracefully highlighted without fake data.
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Revisit Steps
            </button>
            <button
              onClick={onFinishSetup}
              className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold rounded-xl text-xs shadow-[0_0_25px_rgba(0,210,255,0.4)] flex items-center gap-2 transition-all cursor-pointer"
            >
              Finish Setup & Launch JARVIS <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

interface PermissionBadgeProps {
  label: string;
  enabled: boolean;
  required?: boolean;
  optional?: boolean;
}

const PermissionBadge: React.FC<PermissionBadgeProps> = ({ label, enabled, required }) => (
  <div className="flex items-center justify-between p-2.5 bg-[#050C1B] rounded-xl border border-cyan-500/15">
    <span className="text-slate-300">{label}</span>
    {enabled ? (
      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
        <CheckCircle className="w-3.5 h-3.5" />
        Enabled
      </span>
    ) : required ? (
      <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400">
        <AlertCircle className="w-3.5 h-3.5" />
        Not enabled
      </span>
    ) : (
      <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
        <HelpCircle className="w-3.5 h-3.5" />
        Optional
      </span>
    )}
  </div>
);
