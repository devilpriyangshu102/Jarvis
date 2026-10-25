export interface TaskItem {
  id: string;
  title: string;
  dueTime: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  category: 'personal' | 'work' | 'reminder';
  createdAt: number;
}

export interface CallRecord {
  id: string;
  name: string;
  number: string;
  type: 'missed' | 'incoming' | 'outgoing';
  timestamp: string;
  duration?: string;
}

export interface SmsMessage {
  id: string;
  sender: string;
  phone: string;
  text: string;
  timestamp: string;
  isUnread: boolean;
}

export interface NotificationItem {
  id: string;
  appName: string;
  title: string;
  text: string;
  timestamp: string;
  isExcluded?: boolean;
}

export interface EmailItem {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  timestamp: string;
  isUnread: boolean;
}

export interface PermissionStatusMap {
  overlay: boolean;
  background: boolean;
  batteryOptimization: boolean;
  microphone: boolean;
  notificationListener: boolean;
  contacts: boolean;
  callLog: boolean;
  sms: boolean;
}

export interface PhoneTelemetry {
  batteryLevel: number;
  isCharging: boolean;
  networkType: string;
  signalStrength: string;
  wifiSsid: string;
  simCarrier: string;
  mobileDataEnabled: boolean;
  storageUsedGb: number;
  storageTotalGb: number;
}

export type BatteryProfile = 'saver' | 'balanced' | 'always_available';

export type AssistantVisualState =
  | 'STANDBY'
  | 'WAKE_DETECTED'
  | 'LISTENING'
  | 'PROCESSING'
  | 'SEARCHING'
  | 'GENERATING'
  | 'SPEAKING'
  | 'WAITING_FOR_CONFIRMATION'
  | 'OFFLINE'
  | 'ERROR'
  | 'PAUSED';

export type JarvisNavigationSection =
  | 'home'
  | 'conversation'
  | 'browser'
  | 'research'
  | 'device'
  | 'diagnostics'
  | 'studio'
  | 'editor'
  | 'repair'
  | 'backups'
  | 'settings'
  | 'info'
  | 'exporter';

export interface WakeWordSettings {
  enabled: boolean;
  wakePhrase: 'Jarvis' | 'Hey Jarvis';
  handsFreeEnabled: boolean;
  sensitivity: 'low' | 'medium' | 'high';
  voiceResponseEnabled: boolean;
  listeningTimeoutSeconds: number;
  animationIntensity: 'low' | 'medium' | 'high';
  realtimeTranscriptionEnabled: boolean;
  isMicPaused: boolean;
}

export interface SensitiveActionRequest {
  id: string;
  actionType: 'send_sms' | 'send_email' | 'make_call' | 'delete_task';
  title: string;
  recipientOrTarget: string;
  details: string;
  dataPayload?: any;
}

export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

export interface ResearchBrief {
  topic: string;
  synthesis: string;
  sources: SearchResultItem[];
  generatedAt: string;
}

export interface DiagnosticItem {
  id: string;
  name: string;
  category: 'core' | 'ai' | 'network' | 'filesystem' | 'android' | 'security';
  status: 'PASS' | 'WARNING' | 'FAIL' | 'NOT_SUPPORTED';
  measurement: string;
  details: string;
  recommendation?: string;
}

export interface DiagnosticSuiteReport {
  timestamp: string;
  overallHealth: 'OPTIMAL' | 'DEGRADED_RESILIENT' | 'CRITICAL';
  metrics: {
    total: number;
    pass: number;
    warning: number;
    fail: number;
    notSupported: number;
    scorePercent: number;
  };
  results: DiagnosticItem[];
}

export interface BackupRecord {
  id: string;
  originalPath: string;
  timestamp: string;
  size: number;
  isManual?: boolean;
}

export interface RepairProposal {
  rootCause: string;
  affectedComponent: string;
  confidenceScore: number;
  originalSnippet: string;
  replacementSnippet: string;
  explanation: string;
  safetyPrecautions: string;
}
