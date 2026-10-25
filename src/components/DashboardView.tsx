import React, { useState } from 'react';
import {
  Sparkles,
  CheckSquare,
  PhoneCall,
  MessageSquare,
  Bell,
  Mail,
  Shield,
  BatteryCharging,
  Wifi,
  Radio,
  Plus,
  Trash2,
  Check,
  Send,
  ExternalLink,
  Lock,
  RefreshCw,
  Search,
  AlertTriangle,
  Layers,
  ChevronRight,
  Sliders,
  Eye,
  EyeOff,
  Bot,
  User,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import {
  TaskItem,
  CallRecord,
  SmsMessage,
  NotificationItem,
  EmailItem,
  PhoneTelemetry,
  PermissionStatusMap,
  BatteryProfile,
  SensitiveActionRequest,
  AssistantVisualState,
  WakeWordSettings,
} from '../types/jarvis';
import { JarvisOrbVisualizer } from './JarvisOrbVisualizer';
import { VoiceWakeWordSettings } from './VoiceWakeWordSettings';

interface DashboardViewProps {
  telemetry: PhoneTelemetry;
  tasks: TaskItem[];
  calls: CallRecord[];
  sms: SmsMessage[];
  notifications: NotificationItem[];
  emails: EmailItem[];
  permissions: PermissionStatusMap;
  activeProfile: BatteryProfile;
  overlayActive: boolean;
  visualState: AssistantVisualState;
  audioLevel: number;
  speechOutputLevel: number;
  wakeWordSettings: WakeWordSettings;
  chatHistory?: Array<{ role: string; text: string }>;
  lastSpeechResponse?: string;
  onReplaySpeech?: (text: string) => Promise<void>;
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<TaskItem, 'id' | 'createdAt'>) => void;
  onDeleteTask: (id: string) => void;
  onSetBatteryProfile: (profile: BatteryProfile) => void;
  onToggleOverlay: () => void;
  onRequestSensitiveAction: (action: SensitiveActionRequest) => void;
  onClearNotifications: () => void;
  onTriggerVoiceQuery: (query: string) => void;
  onOpenPermissionWizard: () => void;
  onUpdateWakeSettings: (newSettings: Partial<WakeWordSettings>) => void;
  onTestWakeWord: () => void;
  onInterruptSpeech: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  telemetry,
  tasks,
  calls,
  sms,
  notifications,
  emails,
  permissions,
  activeProfile,
  overlayActive,
  visualState,
  audioLevel,
  speechOutputLevel,
  wakeWordSettings,
  chatHistory = [],
  lastSpeechResponse = '',
  onReplaySpeech,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onSetBatteryProfile,
  onToggleOverlay,
  onRequestSensitiveAction,
  onClearNotifications,
  onTriggerVoiceQuery,
  onOpenPermissionWizard,
  onUpdateWakeSettings,
  onTestWakeWord,
  onInterruptSpeech,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'voice' | 'tasks' | 'calls' | 'sms' | 'notifications' | 'email' | 'privacy' | 'battery'
  >('overview');

  // Task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('Today at 5:00 PM');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showTaskModal, setShowTaskModal] = useState(false);

  // SMS composer state
  const [smsRecipient, setSmsRecipient] = useState('');
  const [smsContent, setSmsContent] = useState('');

  // Email reply draft state
  const [draftTo, setDraftTo] = useState('');
  const [draftSubject, setDraftSubject] = useState('');
  const [draftBody, setDraftBody] = useState('');

  // Excluded apps filter
  const [excludedApps, setExcludedApps] = useState<string[]>(['Banking App', 'Google Wallet']);
  const [newExclusion, setNewExclusion] = useState('');

  const missedCalls = calls.filter(c => c.type === 'missed');
  const unreadSms = sms.filter(s => s.isUnread);
  const unreadEmails = emails.filter(e => e.isUnread);
  const pendingTasks = tasks.filter(t => !t.isCompleted);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask({
      title: newTaskTitle.trim(),
      dueTime: newTaskDue,
      priority: newTaskPriority,
      isCompleted: false,
      category: 'personal',
    });
    setNewTaskTitle('');
    setShowTaskModal(false);
  };

  const handleSendSmsRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsRecipient || !smsContent) return;

    onRequestSensitiveAction({
      id: `act-sms-${Date.now()}`,
      actionType: 'send_sms',
      title: 'Dispatch SMS Message',
      recipientOrTarget: smsRecipient,
      details: smsContent,
    });

    setSmsRecipient('');
    setSmsContent('');
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#050B18] text-slate-100 overflow-y-auto">
      
      {/* Top Header Bar inside Phone/View */}
      <div className="px-4 py-3 bg-[#071126] border-b border-cyan-500/20 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center p-0.5 shadow-[0_0_15px_rgba(0,210,255,0.4)]">
            <div className="w-full h-full bg-[#050C1B] rounded-[6px] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-wider text-white">PROJECT JARVIS</h1>
            <p className="text-[10px] text-cyan-400 font-mono">Personal AI Assistant · Android 16</p>
          </div>
        </div>

        {/* Floating Bubble Quick Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleOverlay}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              overlayActive
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
            title="Toggle Floating Window Overlay"
          >
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>Overlay: {overlayActive ? 'Active' : 'Off'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="px-3 py-2 bg-[#060D1E] border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] font-medium shrink-0">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('voice')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'voice'
              ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
              : 'text-cyan-400 hover:text-cyan-200'
          }`}
        >
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Voice & Wake Word
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
            activeTab === 'tasks'
              ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Tasks
          {pendingTasks.length > 0 && (
            <span className="text-[9px] px-1 bg-cyan-500/30 text-cyan-300 rounded font-mono">{pendingTasks.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('calls')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
            activeTab === 'calls'
              ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Calls
          {missedCalls.length > 0 && (
            <span className="text-[9px] px-1 bg-rose-500/40 text-rose-300 rounded font-mono">{missedCalls.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('sms')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
            activeTab === 'sms'
              ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          SMS
          {unreadSms.length > 0 && (
            <span className="text-[9px] px-1 bg-blue-500/40 text-blue-300 rounded font-mono">{unreadSms.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('email')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'email'
              ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Email
        </button>
        <button
          onClick={() => setActiveTab('battery')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'battery'
              ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Battery & SIM
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'privacy'
              ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Privacy
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="p-4 space-y-4 flex-1">

        {/* VOICE & WAKE WORD TAB */}
        {activeTab === 'voice' && (
          <VoiceWakeWordSettings
            settings={wakeWordSettings}
            permissions={permissions}
            onUpdateSettings={onUpdateWakeSettings}
            onTestWakeWord={onTestWakeWord}
          />
        )}

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            
            {/* Holographic Arc Reactor Hero Card */}
            <div className="p-5 bg-gradient-to-b from-[#0B152B] to-[#070E20] border border-cyan-500/30 rounded-2xl relative overflow-hidden shadow-[0_0_30px_rgba(0,112,243,0.2)]">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                
                {/* Visual Arc Core with State Awareness */}
                <div className="relative shrink-0 py-1">
                  <JarvisOrbVisualizer
                    size="panel"
                    visualState={visualState}
                    audioLevel={audioLevel}
                    speechOutputLevel={speechOutputLevel}
                    onInterrupt={onInterruptSpeech}
                  />
                </div>

                {/* Assistant Info */}
                <div className="space-y-1 text-center sm:text-left flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-sm font-bold text-white tracking-wide">JARVIS Voice Core</h2>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      {visualState}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {wakeWordSettings.enabled && !wakeWordSettings.isMicPaused
                      ? `Listening for "${wakeWordSettings.wakePhrase}" on-device. Hands-free commands ready.`
                      : 'Hands-free wake word is paused. Press push-to-talk to speak.'}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] text-cyan-400 font-mono">
                    <span>Battery: {telemetry.batteryLevel}%</span>
                    <span>·</span>
                    <span>{telemetry.networkType}</span>
                    <span>·</span>
                    <span>Profile: {activeProfile.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Quick AI Voice Prompts */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                <button
                  onClick={() => onTriggerVoiceQuery("What are my tasks today?")}
                  className="px-2.5 py-1 bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 rounded-lg hover:bg-cyan-900/40 whitespace-nowrap transition-colors cursor-pointer"
                >
                  "What are my tasks today?"
                </button>
                <button
                  onClick={() => onTriggerVoiceQuery("How many missed calls do I have?")}
                  className="px-2.5 py-1 bg-blue-950/40 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-900/40 whitespace-nowrap transition-colors cursor-pointer"
                >
                  "Missed calls?"
                </button>
                <button
                  onClick={() => onTriggerVoiceQuery("Check my upcoming appointments.")}
                  className="px-2.5 py-1 bg-sky-950/40 text-sky-300 border border-sky-500/30 rounded-lg hover:bg-sky-900/40 whitespace-nowrap transition-colors cursor-pointer"
                >
                  "Upcoming appointments"
                </button>
                <button
                  onClick={() => onTriggerVoiceQuery("Summarize my recent notifications.")}
                  className="px-2.5 py-1 bg-indigo-950/40 text-indigo-300 border border-indigo-500/30 rounded-lg hover:bg-indigo-900/40 whitespace-nowrap transition-colors cursor-pointer"
                >
                  "Summarize notifications"
                </button>
              </div>
            </div>

            {/* Live Assistant Dialogue Stream */}
            <div className="p-3.5 bg-[#061026] border border-cyan-500/25 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5 font-sans">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Live Dialogue Stream
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-cyan-400" />
                  Baritone Voice Active
                </span>
              </div>

              {chatHistory.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {chatHistory.slice(-4).map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl text-xs ${
                        msg.role === 'user'
                          ? 'bg-[#0B1A3D] border border-blue-500/30 text-blue-100 ml-4'
                          : 'bg-[#030919] border border-cyan-500/30 text-cyan-100 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                        <span className="flex items-center gap-1">
                          {msg.role === 'user' ? (
                            <>
                              <User className="w-2.5 h-2.5 text-blue-400" /> You
                            </>
                          ) : (
                            <>
                              <Bot className="w-2.5 h-2.5 text-cyan-400" /> JARVIS (Deep Voice)
                            </>
                          )}
                        </span>
                        {msg.role !== 'user' && onReplaySpeech && (
                          <button
                            onClick={() => onReplaySpeech(msg.text)}
                            className="hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer text-cyan-400"
                            title="Replay Voice Audio"
                          >
                            <RotateCcw className="w-2.5 h-2.5" /> Replay
                          </button>
                        )}
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-[#030919] border border-cyan-500/20 rounded-xl text-xs text-slate-300 flex items-start gap-2.5">
                  <Bot className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                      <span>JARVIS (Standby)</span>
                      {onReplaySpeech && lastSpeechResponse && (
                        <button
                          onClick={() => onReplaySpeech(lastSpeechResponse)}
                          className="hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer text-cyan-400"
                        >
                          <RotateCcw className="w-2.5 h-2.5" /> Play Voice
                        </button>
                      )}
                    </div>
                    <p className="leading-relaxed text-cyan-100">
                      {lastSpeechResponse || "Systems fully primed. Click any prompt chip or speak 'Hey Jarvis' to activate."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-[#0A1329] border border-cyan-500/15 rounded-xl">
                <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                  <span>Pending Tasks</span>
                  <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <span className="text-lg font-bold text-white font-mono">{pendingTasks.length}</span>
              </div>

              <div className="p-3 bg-[#0A1329] border border-cyan-500/15 rounded-xl">
                <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                  <span>Missed Calls</span>
                  <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <span className="text-lg font-bold text-white font-mono">{missedCalls.length}</span>
              </div>

              <div className="p-3 bg-[#0A1329] border border-cyan-500/15 rounded-xl">
                <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                  <span>Unread SMS</span>
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span className="text-lg font-bold text-white font-mono">{unreadSms.length}</span>
              </div>

              <div className="p-3 bg-[#0A1329] border border-cyan-500/15 rounded-xl">
                <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                  <span>Unread Emails</span>
                  <Mail className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <span className="text-lg font-bold text-white font-mono">{unreadEmails.length}</span>
              </div>
            </div>

            {/* Today's Tasks Preview */}
            <div className="bg-[#0A1329] border border-cyan-500/20 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                  Today's Priority Agenda
                </h3>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2">
                {tasks.slice(0, 3).map(task => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2.5 bg-[#050C1B] rounded-xl border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${
                          task.isCompleted
                            ? 'bg-cyan-500 border-cyan-500 text-black'
                            : 'border-slate-600 hover:border-cyan-400'
                        }`}
                      >
                        {task.isCompleted && <Check className="w-3 h-3 text-black stroke-[3]" />}
                      </button>
                      <span className={task.isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}>
                        {task.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{task.dueTime}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Notifications Preview */}
            <div className="bg-[#0A1329] border border-cyan-500/20 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-blue-400" />
                  Captured Notifications
                </h3>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  Manage <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2">
                {notifications.slice(0, 2).map(n => (
                  <div key={n.id} className="p-2.5 bg-[#050C1B] rounded-xl border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-semibold text-cyan-400">{n.appName}</span>
                      <span className="font-mono text-[10px]">{n.timestamp}</span>
                    </div>
                    <p className="font-medium text-white text-[11px]">{n.title}</p>
                    <p className="text-slate-300 text-[11px] truncate">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 2. TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Task Management & Reminders</h3>
              <button
                onClick={() => setShowTaskModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-black" />
                New Task
              </button>
            </div>

            {/* Task Creation Modal */}
            {showTaskModal && (
              <form onSubmit={handleCreateTask} className="p-4 bg-[#0A1329] border border-cyan-500/30 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-cyan-300 uppercase">Create Reminder</h4>
                <input
                  type="text"
                  placeholder="Task title (e.g. Schedule oil change)..."
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full bg-[#050C1B] border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Due Time (e.g. Tomorrow at 9 AM)"
                    value={newTaskDue}
                    onChange={e => setNewTaskDue(e.target.value)}
                    className="bg-[#050C1B] border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                  />
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as any)}
                    className="bg-[#050C1B] border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowTaskModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-cyan-500 text-black font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Save Task
                  </button>
                </div>
              </form>
            )}

            {/* Task List */}
            <div className="space-y-2">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-[#0A1329] rounded-xl border border-cyan-500/15 text-xs hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${
                        task.isCompleted
                          ? 'bg-cyan-500 border-cyan-500 text-black'
                          : 'border-slate-600 hover:border-cyan-400'
                      }`}
                    >
                      {task.isCompleted && <Check className="w-3 h-3 text-black stroke-[3]" />}
                    </button>
                    <div>
                      <p className={`font-medium ${task.isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
                        {task.title}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">{task.dueTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-mono uppercase ${
                        task.priority === 'high'
                          ? 'bg-rose-500/20 text-rose-300'
                          : task.priority === 'medium'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. CALLS TAB */}
        {activeTab === 'calls' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Call History & Missed Calls</h3>
                <p className="text-[11px] text-slate-400">Android CallLog Provider Integration</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 text-xs font-mono">
                {missedCalls.length} Missed
              </span>
            </div>

            <div className="space-y-2">
              {calls.map(call => (
                <div
                  key={call.id}
                  className="flex items-center justify-between p-3 bg-[#0A1329] rounded-xl border border-cyan-500/15 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        call.type === 'missed'
                          ? 'bg-rose-500/20 text-rose-400'
                          : call.type === 'incoming'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{call.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{call.number}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-mono">{call.timestamp}</p>
                    {call.duration && (
                      <p className="text-[10px] text-cyan-400 font-mono">{call.duration}</p>
                    )}
                    {call.type === 'missed' && (
                      <button
                        onClick={() =>
                          onRequestSensitiveAction({
                            id: `act-call-${call.id}`,
                            actionType: 'make_call',
                            title: 'Initiate Phone Call',
                            recipientOrTarget: `${call.name} (${call.number})`,
                            details: `Place outgoing phone call via Android Telecom subsystem`,
                          })
                        }
                        className="mt-1 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] hover:bg-cyan-500/30 cursor-pointer"
                      >
                        Call Back
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SMS TAB */}
        {activeTab === 'sms' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">SMS Management</h3>
                <p className="text-[11px] text-slate-400">Accessible SMS Records & Safe Composer</p>
              </div>
              <span className="text-xs text-cyan-400 font-mono">
                {unreadSms.length} Unread Messages
              </span>
            </div>

            {/* Compose SMS Form */}
            <form onSubmit={handleSendSmsRequest} className="p-3.5 bg-[#0A1329] border border-cyan-500/25 rounded-2xl space-y-2.5">
              <h4 className="text-xs font-bold text-cyan-300">Prepare & Draft SMS</h4>
              <input
                type="text"
                placeholder="Recipient Name or Phone (e.g. Sarah Jenkins)..."
                value={smsRecipient}
                onChange={e => setSmsRecipient(e.target.value)}
                className="w-full bg-[#050C1B] border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
              />
              <textarea
                placeholder="Message body..."
                rows={2}
                value={smsContent}
                onChange={e => setSmsContent(e.target.value)}
                className="w-full bg-[#050C1B] border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-amber-400 font-mono">
                  * Triggers Tier 3 Security Confirmation Dialog
                </span>
                <button
                  type="submit"
                  disabled={!smsRecipient || !smsContent}
                  className="px-4 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 disabled:opacity-40 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Request Send
                </button>
              </div>
            </form>

            {/* Existing SMS Messages */}
            <div className="space-y-2">
              {sms.map(msg => (
                <div key={msg.id} className="p-3 bg-[#0A1329] rounded-xl border border-cyan-500/15 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{msg.sender}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Notification Assistant</h3>
                <p className="text-[11px] text-slate-400">Android NotificationListenerService</p>
              </div>
              <button
                onClick={onClearNotifications}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl cursor-pointer"
              >
                Clear Captured Logs
              </button>
            </div>

            {/* Privacy App Exclusions */}
            <div className="p-3.5 bg-[#0A1329] border border-cyan-500/20 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                Sensitive App Privacy Exclusions
              </h4>
              <p className="text-[11px] text-slate-400">
                Excluded applications are discarded at memory arrival and never recorded or summarized:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {excludedApps.map(app => (
                  <span
                    key={app}
                    className="px-2.5 py-1 rounded-lg bg-[#050C1B] text-slate-300 text-[11px] border border-slate-700 flex items-center gap-1.5"
                  >
                    {app}
                    <button
                      onClick={() => setExcludedApps(excludedApps.filter(a => a !== app))}
                      className="text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Notifications Feed */}
            <div className="space-y-2">
              {notifications.map(item => (
                <div key={item.id} className="p-3 bg-[#0A1329] rounded-xl border border-cyan-500/15 text-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="font-semibold text-cyan-300">{item.appName}</span>
                    <span className="text-[10px] font-mono">{item.timestamp}</span>
                  </div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-slate-300 text-[11px]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. EMAIL TAB */}
        {activeTab === 'email' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Gmail Integration</h3>
                <p className="text-[11px] text-slate-400">OAuth 2.0 Client Authorization</p>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs font-mono">
                {unreadEmails.length} Unread
              </span>
            </div>

            {/* Email Summaries */}
            <div className="space-y-2">
              {emails.map(email => (
                <div key={email.id} className="p-3 bg-[#0A1329] rounded-xl border border-cyan-500/15 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{email.from}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{email.timestamp}</span>
                  </div>
                  <p className="font-medium text-cyan-300">{email.subject}</p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{email.snippet}</p>
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() =>
                        onRequestSensitiveAction({
                          id: `act-email-reply-${email.id}`,
                          actionType: 'send_email',
                          title: 'Send Authorized Email Reply',
                          recipientOrTarget: email.from,
                          details: `Reply to subject "${email.subject}"`,
                        })
                      }
                      className="px-2.5 py-1 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 rounded-lg text-[10px] cursor-pointer"
                    >
                      Draft Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. BATTERY & SIM STATUS */}
        {activeTab === 'battery' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">Phone & SIM Allowances Dashboard</h3>
              <p className="text-[11px] text-slate-400">Real-time Telemetry & Official Carrier Integration</p>
            </div>

            {/* Battery Status Card */}
            <div className="p-4 bg-[#0A1329] border border-cyan-500/20 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BatteryCharging className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs font-bold text-white">Battery Health & Power</span>
                </div>
                <span className="text-lg font-bold font-mono text-cyan-300">{telemetry.batteryLevel}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                  style={{ width: `${telemetry.batteryLevel}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Status: {telemetry.isCharging ? 'Connected to Rapid Charger' : 'Discharging normally on battery power'}
              </p>
            </div>

            {/* SIM & Network Telemetry */}
            <div className="p-4 bg-[#0A1329] border border-cyan-500/20 rounded-2xl space-y-2.5 text-xs">
              <h4 className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-cyan-400" />
                SIM & Network Subsystem
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-[#050C1B] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Active Carrier</span>
                  <span className="font-semibold text-white">{telemetry.simCarrier}</span>
                </div>
                <div className="bg-[#050C1B] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Mobile Network</span>
                  <span className="font-semibold text-cyan-400">{telemetry.networkType}</span>
                </div>
                <div className="bg-[#050C1B] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Signal Strength</span>
                  <span className="font-semibold text-white">{telemetry.signalStrength}</span>
                </div>
                <div className="bg-[#050C1B] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Wi-Fi Connection</span>
                  <span className="font-semibold text-emerald-400">{telemetry.wifiSsid}</span>
                </div>
              </div>
            </div>

            {/* Official Carrier Portal Guidance */}
            <div className="p-4 bg-blue-950/30 border border-blue-500/30 rounded-2xl space-y-2 text-xs">
              <h4 className="font-bold text-blue-300">Carrier Allowance & Balance Policy:</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                JARVIS does <span className="text-white font-medium">NOT</span> hallucinate fake calling minutes or remaining data balances. Accurate remaining allowances are retrieved exclusively from your provider:
              </p>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="https://fi.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 rounded-lg text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  Check Official Carrier Balance
                </a>
              </div>
            </div>

            {/* Background & Battery Profiles (Section 17) */}
            <div className="p-4 bg-[#0A1329] border border-cyan-500/20 rounded-2xl space-y-3 text-xs">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Background & Battery Profiles
              </h4>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <button
                  onClick={() => onSetBatteryProfile('saver')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    activeProfile === 'saver'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-[#050C1B] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Battery Saver
                </button>
                <button
                  onClick={() => onSetBatteryProfile('balanced')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    activeProfile === 'balanced'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-[#050C1B] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Balanced
                </button>
                <button
                  onClick={() => onSetBatteryProfile('always_available')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    activeProfile === 'always_available'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-[#050C1B] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Always Available
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Current profile: <span className="text-cyan-400 font-semibold">{activeProfile}</span>. Maintains foreground keep-alive notification and schedules periodic background checks.
              </p>
            </div>

          </div>
        )}

        {/* 8. PRIVACY TAB */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">Privacy & Security Governance</h3>
              <p className="text-[11px] text-slate-400">Zero Unsolicited Telemetry · Android Keystore Enforced</p>
            </div>

            <div className="p-4 bg-[#0A1329] border border-cyan-500/20 rounded-2xl space-y-3 text-xs">
              <h4 className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-cyan-400" />
                Security Standards Check
              </h4>
              <ul className="space-y-2 text-slate-300 text-[11px]">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Local database stored on device via Room SQLite; no private logs uploaded.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>3-tier controlled tool-calling security gate for sensitive actions.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Push-to-talk microphone activation: no ambient surveillance.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Overlay bubble runs under TYPE_APPLICATION_OVERLAY without reading other screens.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-[#0A1329] border border-cyan-500/20 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-white">Permission Configuration</h4>
              <button
                onClick={onOpenPermissionWizard}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                Launch Permission Setup Wizard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
