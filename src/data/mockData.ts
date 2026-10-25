import { TaskItem, CallRecord, SmsMessage, NotificationItem, EmailItem, PhoneTelemetry, PermissionStatusMap } from '../types/jarvis';

export const initialPermissions: PermissionStatusMap = {
  overlay: true,
  background: true,
  batteryOptimization: false,
  microphone: true,
  notificationListener: true,
  contacts: true,
  callLog: true,
  sms: true,
};

export const initialTelemetry: PhoneTelemetry = {
  batteryLevel: 82,
  isCharging: false,
  networkType: '5G SA',
  signalStrength: '-79 dBm (Excellent)',
  wifiSsid: 'Pixel_Fiber_Wi-Fi 6',
  simCarrier: 'Google Fi / T-Mobile',
  mobileDataEnabled: true,
  storageUsedGb: 48.4,
  storageTotalGb: 128.0,
};

export const initialTasks: TaskItem[] = [
  {
    id: 't-1',
    title: 'Review Machine Learning thesis submission with Dr. Aris',
    dueTime: 'Today at 3:00 PM',
    priority: 'high',
    isCompleted: false,
    category: 'work',
    createdAt: Date.now() - 3600000,
  },
  {
    id: 't-2',
    title: 'Check medication refill at Apex Pharmacy',
    dueTime: 'Today at 6:30 PM',
    priority: 'medium',
    isCompleted: false,
    category: 'personal',
    createdAt: Date.now() - 7200000,
  },
  {
    id: 't-3',
    title: 'Submit quarterly energy audit report',
    dueTime: 'Tomorrow at 10:00 AM',
    priority: 'high',
    isCompleted: false,
    category: 'work',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 't-4',
    title: 'Calibrate smartwatch biometric sensors',
    dueTime: 'Tomorrow at 7:00 PM',
    priority: 'low',
    isCompleted: true,
    category: 'personal',
    createdAt: Date.now() - 90000000,
  },
];

export const initialCalls: CallRecord[] = [
  {
    id: 'c-1',
    name: 'Sarah Jenkins',
    number: '+1 (555) 234-8910',
    type: 'missed',
    timestamp: '14 minutes ago',
  },
  {
    id: 'c-2',
    name: 'Dr. Aris Vance',
    number: '+1 (555) 872-4411',
    type: 'missed',
    timestamp: '1 hour ago',
  },
  {
    id: 'c-3',
    name: 'Engineering Lab',
    number: '+1 (555) 901-2284',
    type: 'incoming',
    timestamp: '2 hours ago',
    duration: '4m 12s',
  },
  {
    id: 'c-4',
    name: 'Alex Rivera',
    number: '+1 (555) 431-7782',
    type: 'outgoing',
    timestamp: 'Yesterday at 4:15 PM',
    duration: '1m 45s',
  },
];

export const initialSms: SmsMessage[] = [
  {
    id: 's-1',
    sender: 'Sarah Jenkins',
    phone: '+1 (555) 234-8910',
    text: 'Hey! Are you still joining the briefing at 3:30? Let me know so I can print the schematics.',
    timestamp: '12m ago',
    isUnread: true,
  },
  {
    id: 's-2',
    sender: 'Bank Security Alert',
    phone: '22049',
    text: 'Security verification code: 849201. Never share this OTP with anyone.',
    timestamp: '45m ago',
    isUnread: true,
  },
  {
    id: 's-3',
    sender: 'Carrier Telecom',
    phone: '456',
    text: 'Your current billing cycle ends in 6 days. For official data and calling balance, visit your provider app.',
    timestamp: '3h ago',
    isUnread: false,
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    appName: 'WhatsApp',
    title: 'Project Group (4 unread)',
    text: 'Marcus: Updated the APK signing certificate for Android 14 target compatibility.',
    timestamp: '8m ago',
  },
  {
    id: 'n-2',
    appName: 'Gmail',
    title: 'Google Cloud Platform',
    text: 'Billing summary: Cloud Run instance running within free tier parameters.',
    timestamp: '22m ago',
  },
  {
    id: 'n-3',
    appName: 'Google Calendar',
    title: 'Meeting in 35m',
    text: 'Systems Architecture Sync with Core Engineering.',
    timestamp: '30m ago',
  },
  {
    id: 'n-4',
    appName: 'Android System',
    title: 'Google Play Protect',
    text: 'No harmful apps detected. Scanned 48 apps this morning.',
    timestamp: '2h ago',
  },
];

export const initialEmails: EmailItem[] = [
  {
    id: 'e-1',
    from: 'Prof. David Thorne <thorne@institute.edu>',
    subject: 'Autonomous Systems Symposium invitation',
    snippet: 'We would be honored if you could present Project JARVIS architecture next month in Zurich...',
    timestamp: '10:14 AM',
    isUnread: true,
  },
  {
    id: 'e-2',
    from: 'GitHub Notifications <notifications@github.com>',
    subject: '[ProjectJARVIS] CI/CD Workflow: APK Build #42 succeeded',
    snippet: 'Artifact app-debug.apk generated successfully. SHA256 verified.',
    timestamp: 'Yesterday',
    isUnread: false,
  },
  {
    id: 'e-3',
    from: 'Cloud Security Weekly <digest@securityops.org>',
    subject: 'Android 15 Foreground Service policy updates',
    snippet: 'Guidelines for specialUse service types and user transparent consent overlays...',
    timestamp: 'Oct 21',
    isUnread: false,
  },
];
