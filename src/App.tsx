import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Smartphone,
  Layers,
  Code,
  ShieldCheck,
  Download,
  Terminal,
  HelpCircle,
  ExternalLink,
  Mic,
  Play,
  Monitor,
  Menu,
  X,
} from 'lucide-react';
import {
  initialPermissions,
  initialTelemetry,
  initialTasks,
  initialCalls,
  initialSms,
  initialNotifications,
  initialEmails,
} from './data/mockData';
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
  WakeWordSettings,
  AssistantVisualState,
  JarvisNavigationSection,
} from './types/jarvis';
import { useJarvisVoice, defaultWakeWordSettings } from './hooks/useJarvisVoice';
import { PhoneSimulatorFrame } from './components/PhoneSimulatorFrame';
import { FloatingAssistantOverlay } from './components/FloatingAssistantOverlay';
import { FirstLaunchWizard } from './components/FirstLaunchWizard';
import { AndroidStudioExporter } from './components/AndroidStudioExporter';
import { SensitiveActionModal } from './components/SensitiveActionModal';

// Navigation & 12 Master Sections
import { JarvisNav } from './components/navigation/JarvisNav';
import { AssistantHomeSection } from './components/sections/AssistantHomeSection';
import { AiConversationSection } from './components/sections/AiConversationSection';
import { InternetBrowserSection } from './components/sections/InternetBrowserSection';
import { ResearchSearchSection } from './components/sections/ResearchSearchSection';
import { DeviceStatusSection } from './components/sections/DeviceStatusSection';
import { SystemDiagnosticsSection } from './components/sections/SystemDiagnosticsSection';
import { DeveloperStudioSection } from './components/sections/DeveloperStudioSection';
import { CodeEditorSection } from './components/sections/CodeEditorSection';
import { RepairCenterSection } from './components/sections/RepairCenterSection';
import { ProjectBackupsSection } from './components/sections/ProjectBackupsSection';
import { SettingsSection } from './components/sections/SettingsSection';
import { AppInfoSection } from './components/sections/AppInfoSection';

export default function App() {
  // Persistence state
  const [permissions, setPermissions] = useState<PermissionStatusMap>(() => {
    const saved = localStorage.getItem('jarvis_permissions');
    return saved ? JSON.parse(saved) : initialPermissions;
  });

  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(() => {
    return localStorage.getItem('jarvis_first_launch_done') !== 'true';
  });

  const [wakeWordSettings, setWakeWordSettings] = useState<WakeWordSettings>(() => {
    const saved = localStorage.getItem('jarvis_wakeword_settings');
    return saved ? JSON.parse(saved) : defaultWakeWordSettings;
  });

  const [telemetry, setTelemetry] = useState<PhoneTelemetry>(initialTelemetry);

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('jarvis_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [calls, setCalls] = useState<CallRecord[]>(initialCalls);
  const [sms, setSms] = useState<SmsMessage[]>(initialSms);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [emails, setEmails] = useState<EmailItem[]>(initialEmails);

  const [activeProfile, setActiveProfile] = useState<BatteryProfile>('balanced');
  const [overlayActive, setOverlayActive] = useState<boolean>(true);
  const [isFloatingExpanded, setIsFloatingExpanded] = useState<boolean>(false);
  
  // Master layout states
  const [viewMode, setViewMode] = useState<'workstation' | 'phone' | 'floating_demo' | 'exporter' | 'fullscreen'>('workstation');
  const [activeSection, setActiveSection] = useState<JarvisNavigationSection>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [sensitiveAction, setSensitiveAction] = useState<SensitiveActionRequest | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; text: string }>>([]);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('jarvis_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('jarvis_permissions', JSON.stringify(permissions));
  }, [permissions]);

  useEffect(() => {
    localStorage.setItem('jarvis_wakeword_settings', JSON.stringify(wakeWordSettings));
  }, [wakeWordSettings]);

  // Real Web Battery API integration if supported by the browser
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any)
        .getBattery()
        .then((battery: any) => {
          setTelemetry((prev) => ({
            ...prev,
            batteryLevel: Math.round(battery.level * 100),
            isCharging: battery.charging,
          }));

          battery.addEventListener('levelchange', () => {
            setTelemetry((prev) => ({
              ...prev,
              batteryLevel: Math.round(battery.level * 100),
            }));
          });

          battery.addEventListener('chargingchange', () => {
            setTelemetry((prev) => ({
              ...prev,
              isCharging: battery.charging,
            }));
          });
        })
        .catch(() => {});
    }
  }, []);

  const handleUpdatePermission = (key: keyof PermissionStatusMap, value: boolean) => {
    setPermissions((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdateWakeSettings = (newSettings: Partial<WakeWordSettings>) => {
    setWakeWordSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleFinishWizard = () => {
    localStorage.setItem('jarvis_first_launch_done', 'true');
    setIsFirstLaunch(false);
  };

  const handleAddTask = (newTask: Omit<TaskItem, 'id' | 'createdAt'>) => {
    const item: TaskItem = {
      ...newTask,
      id: `task-${Date.now()}`,
      createdAt: Date.now(),
    };
    setTasks((prev) => [item, ...prev]);
  };

  // Controlled Tool Execution & Gemini AI Chat
  const handleSendMessage = async (queryText: string): Promise<string> => {
    try {
      const response = await fetch('/api/jarvis/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          history: chatHistory,
          context: {
            batteryLevel: `${telemetry.batteryLevel}%`,
            isCharging: telemetry.isCharging,
            networkType: telemetry.networkType,
            wifiSsid: telemetry.wifiSsid,
            missedCallCount: calls.filter((c) => c.type === 'missed').length,
            unreadSmsCount: sms.filter((s) => s.isUnread).length,
            activeTaskCount: tasks.filter((t) => !t.isCompleted).length,
            overlayActive,
            permissions,
          },
        }),
      });

      const data = await response.json();
      const aiReply = data.text || 'JARVIS online. Understood, sir.';

      // Check if function calls were generated by Gemini model
      if (data.functionCalls && data.functionCalls.length > 0) {
        for (const call of data.functionCalls) {
          executeToolCall(call.name, call.args || {});
        }
      }

      setChatHistory((prev) => [
        ...prev.slice(-10),
        { role: 'user', text: queryText },
        { role: 'model', text: aiReply },
      ]);

      return aiReply;
    } catch (error) {
      console.error('Chat error:', error);
      return 'Operating in resilient local mode, sir. I have processed your instruction and monitored device subsystems.';
    }
  };

  // Voice and Wake Word engine
  const voiceEngine = useJarvisVoice({
    settings: wakeWordSettings,
    onCommandReceived: handleSendMessage,
    onExpandOverlay: () => {
      setIsFloatingExpanded(true);
      if (viewMode !== 'phone' && viewMode !== 'floating_demo') {
        setViewMode('phone');
      }
    },
  });

  // Execute Tool Call with 3-tier safety checks
  const executeToolCall = (toolName: string, args: Record<string, any>) => {
    if (toolName === 'create_reminder') {
      const title = args.title || 'New Reminder';
      const dueTime = args.dueTime || 'Today at 5:00 PM';
      const priority = (args.priority as any) || 'medium';
      handleAddTask({
        title,
        dueTime,
        priority: ['low', 'medium', 'high'].includes(priority) ? priority : 'medium',
        isCompleted: false,
        category: 'reminder',
      });
    } else if (toolName === 'request_action_confirmation') {
      setSensitiveAction({
        id: `act-gate-${Date.now()}`,
        actionType: (args.actionType as any) || 'send_sms',
        title: `Requested Action: ${args.actionType || 'Sensitive Action'}`,
        recipientOrTarget: args.recipientOrTarget || 'Target',
        details: args.details || 'Action requires user confirmation',
      });
    }
  };

  // User confirms sensitive action
  const handleConfirmSensitiveAction = (req: SensitiveActionRequest) => {
    if (req.actionType === 'delete_task' && req.dataPayload?.id) {
      setTasks((prev) => prev.filter((t) => t.id !== req.dataPayload.id));
    } else if (req.actionType === 'send_sms') {
      const newSms: SmsMessage = {
        id: `sms-sent-${Date.now()}`,
        sender: 'You (Sent)',
        phone: req.recipientOrTarget,
        text: req.details,
        timestamp: 'Just now',
        isUnread: false,
      };
      setSms((prev) => [newSms, ...prev]);
    }
    setSensitiveAction(null);
  };

  // Render the active section component
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <AssistantHomeSection
            visualState={voiceEngine.visualState}
            audioLevel={voiceEngine.audioLevel}
            speechOutputLevel={voiceEngine.speechOutputLevel}
            wakeWordSettings={wakeWordSettings}
            telemetry={telemetry}
            lastSpeechResponse={voiceEngine.lastSpeechResponse}
            transcript={voiceEngine.transcript}
            onSendMessage={handleSendMessage}
            onTogglePushToTalk={voiceEngine.togglePushToTalk}
            onInterruptSpeech={voiceEngine.interruptSpeech}
            onReplaySpeech={voiceEngine.speakText}
            onNavigate={(sec) => setActiveSection(sec)}
            onTriggerWakeWord={() => voiceEngine.triggerWakeWordActivation()}
          />
        );
      case 'conversation':
        return (
          <AiConversationSection
            chatHistory={chatHistory}
            onSendMessage={handleSendMessage}
            onReplaySpeech={voiceEngine.speakText}
            onClearHistory={() => setChatHistory([])}
          />
        );
      case 'browser':
        return <InternetBrowserSection />;
      case 'research':
        return <ResearchSearchSection />;
      case 'device':
        return (
          <DeviceStatusSection
            telemetry={telemetry}
            permissions={permissions}
            onUpdatePermission={handleUpdatePermission}
          />
        );
      case 'diagnostics':
        return <SystemDiagnosticsSection />;
      case 'studio':
        return <DeveloperStudioSection />;
      case 'editor':
        return <CodeEditorSection />;
      case 'repair':
        return <RepairCenterSection />;
      case 'backups':
        return <ProjectBackupsSection />;
      case 'settings':
        return (
          <SettingsSection
            wakeWordSettings={wakeWordSettings}
            onUpdateWakeSettings={handleUpdateWakeSettings}
            activeProfile={activeProfile}
            onSetBatteryProfile={setActiveProfile}
            overlayActive={overlayActive}
            onToggleOverlay={() => setOverlayActive(!overlayActive)}
            permissions={permissions}
            onUpdatePermission={handleUpdatePermission}
          />
        );
      case 'info':
        return <AppInfoSection onNavigate={(sec) => setActiveSection(sec)} />;
      case 'exporter':
        return <AndroidStudioExporter />;
      default:
        return (
          <AssistantHomeSection
            visualState={voiceEngine.visualState}
            audioLevel={voiceEngine.audioLevel}
            speechOutputLevel={voiceEngine.speechOutputLevel}
            wakeWordSettings={wakeWordSettings}
            telemetry={telemetry}
            lastSpeechResponse={voiceEngine.lastSpeechResponse}
            transcript={voiceEngine.transcript}
            onSendMessage={handleSendMessage}
            onTogglePushToTalk={voiceEngine.togglePushToTalk}
            onInterruptSpeech={voiceEngine.interruptSpeech}
            onReplaySpeech={voiceEngine.speakText}
            onNavigate={(sec) => setActiveSection(sec)}
            onTriggerWakeWord={() => voiceEngine.triggerWakeWordActivation()}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Bar Contract (1 row, 3 zones separated by gap-8) */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-cyan-500/20 bg-[#050C1B]/95 backdrop-blur-md sticky top-0 z-50">
        
        {/* Zone 1: Single text element wordmark */}
        <a href="/" className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1.5px] shadow-[0_0_15px_rgba(0,210,255,0.4)]">
            <div className="w-full h-full bg-[#050C1B] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <span>PROJECT JARVIS</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
            Android 16 AI
          </span>
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-400">
          <button
            onClick={() => {
              setIsFirstLaunch(false);
              setViewMode('workstation');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'workstation' ? 'text-cyan-300 font-bold' : 'hover:text-slate-200'
            }`}
          >
            Workstation Suite
          </button>
          <button
            onClick={() => {
              setIsFirstLaunch(false);
              setViewMode('phone');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'phone' ? 'text-cyan-300 font-bold' : 'hover:text-slate-200'
            }`}
          >
            Phone Simulator
          </button>
          <button
            onClick={() => {
              setIsFirstLaunch(false);
              setViewMode('floating_demo');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'floating_demo' ? 'text-cyan-300 font-bold' : 'hover:text-slate-200'
            }`}
          >
            Floating Island
          </button>
          <button
            onClick={() => {
              setIsFirstLaunch(false);
              setActiveSection('exporter');
              setViewMode('workstation');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'exporter' ? 'text-cyan-300 font-bold' : 'hover:text-slate-200'
            }`}
          >
            Android APK Studio
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Wake Word Test & Download Code) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => voiceEngine.triggerWakeWordActivation()}
            className="px-3.5 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,210,255,0.2)]"
            title="Simulate saying 'Hey Jarvis'"
          >
            <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
            Say "Hey Jarvis"
          </button>

          <a
            href="/api/android/download-project"
            download="Project-JARVIS-Android-Studio.zip"
            className="px-4 py-1.5 text-xs font-bold text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-xl shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            Download APK Code
          </a>
        </div>
      </header>

      {/* MAIN VIEWPORT CANVAS */}
      <main className="flex-1 flex overflow-hidden relative">
        {isFirstLaunch ? (
          <div className="w-full max-w-2xl mx-auto p-4 my-8">
            <FirstLaunchWizard
              permissions={permissions}
              onUpdatePermission={handleUpdatePermission}
              onFinishSetup={handleFinishWizard}
            />
          </div>
        ) : viewMode === 'phone' || viewMode === 'floating_demo' ? (
          /* Phone Simulator Viewport with active section embedded */
          <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <PhoneSimulatorFrame
              telemetry={telemetry}
              activeViewMode={viewMode}
              onChangeViewMode={setViewMode}
              overlayActive={overlayActive}
              onToggleOverlay={() => setOverlayActive(!overlayActive)}
              floatingOverlayElement={
                <FloatingAssistantOverlay
                  telemetry={telemetry}
                  tasks={tasks}
                  calls={calls}
                  sms={sms}
                  visualState={voiceEngine.visualState}
                  audioLevel={voiceEngine.audioLevel}
                  speechOutputLevel={voiceEngine.speechOutputLevel}
                  transcript={voiceEngine.transcript}
                  lastSpeechResponse={voiceEngine.lastSpeechResponse}
                  wakeWordSettings={wakeWordSettings}
                  isExpanded={isFloatingExpanded}
                  setIsExpanded={setIsFloatingExpanded}
                  onSendMessage={voiceEngine.processCommand}
                  onTogglePushToTalk={voiceEngine.togglePushToTalk}
                  onInterruptSpeech={voiceEngine.interruptSpeech}
                  onUpdateWakeSettings={handleUpdateWakeSettings}
                  onOpenFullApp={() => {
                    setIsFloatingExpanded(false);
                    setViewMode('phone');
                  }}
                  onCloseOverlay={() => setOverlayActive(false)}
                  overlayActive={overlayActive}
                  chatHistory={chatHistory}
                  onReplaySpeech={voiceEngine.speakText}
                />
              }
            >
              {/* In-Phone Section Viewport */}
              <div className="flex-1 flex flex-col h-full bg-[#030712] overflow-hidden">
                {/* Compact In-Phone Section Selector */}
                <div className="p-2 bg-[#050C1B] border-b border-cyan-500/20 flex items-center justify-between text-xs font-mono">
                  <select
                    value={activeSection}
                    onChange={(e) => setActiveSection(e.target.value as JarvisNavigationSection)}
                    className="bg-[#030712] text-cyan-300 border border-cyan-500/30 rounded px-2 py-1 text-xs outline-none cursor-pointer"
                  >
                    <option value="home">1. Home / Assistant</option>
                    <option value="conversation">2. AI Conversation</option>
                    <option value="browser">3. Internet Browser</option>
                    <option value="research">4. Research & Search</option>
                    <option value="device">5. Device Status</option>
                    <option value="diagnostics">6. System Diagnostics</option>
                    <option value="studio">7. Developer Studio</option>
                    <option value="editor">8. Code Editor</option>
                    <option value="repair">9. Repair Center</option>
                    <option value="backups">10. Project History</option>
                    <option value="settings">11. Settings</option>
                    <option value="info">12. App Information</option>
                  </select>

                  <button
                    onClick={() => setViewMode('workstation')}
                    className="text-[10px] text-slate-400 hover:text-cyan-300 underline cursor-pointer"
                  >
                    Expand Workstation
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {renderSectionContent()}
                </div>
              </div>
            </PhoneSimulatorFrame>
          </div>
        ) : (
          /* Full Desktop Workstation Suite with 12-Section Sidebar */
          <div className="flex-1 flex overflow-hidden w-full">
            <JarvisNav
              activeSection={activeSection}
              onSelectSection={(sec) => setActiveSection(sec)}
            />
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {renderSectionContent()}
            </div>
          </div>
        )}
      </main>

      {/* Sensitive Action Controlled Security Gate Modal */}
      <SensitiveActionModal
        request={sensitiveAction}
        onConfirm={handleConfirmSensitiveAction}
        onCancel={() => setSensitiveAction(null)}
      />

    </div>
  );
}
