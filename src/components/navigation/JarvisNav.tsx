import React from 'react';
import {
  Home,
  MessageSquare,
  Globe,
  Search,
  Smartphone,
  Activity,
  Terminal,
  Code2,
  Wrench,
  History,
  Settings,
  Info,
  Download,
} from 'lucide-react';
import { JarvisNavigationSection } from '../../types/jarvis';

interface JarvisNavProps {
  activeSection: JarvisNavigationSection;
  onSelectSection: (section: JarvisNavigationSection) => void;
  diagnosticHealth?: 'OPTIMAL' | 'DEGRADED_RESILIENT' | 'CRITICAL';
}

interface NavItem {
  id: JarvisNavigationSection;
  label: string;
  icon: React.ElementType;
  badge?: string;
  category: 'core' | 'intelligence' | 'system' | 'developer';
}

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home / Assistant', icon: Home, category: 'core' },
  { id: 'conversation', label: 'AI Conversation', icon: MessageSquare, category: 'core' },
  { id: 'browser', label: 'Internet Browser', icon: Globe, category: 'intelligence' },
  { id: 'research', label: 'Research & Search', icon: Search, category: 'intelligence' },
  { id: 'device', label: 'Device Status', icon: Smartphone, category: 'system' },
  { id: 'diagnostics', label: 'System Diagnostics', icon: Activity, category: 'system' },
  { id: 'studio', label: 'Developer Studio', icon: Terminal, category: 'developer' },
  { id: 'editor', label: 'Code Editor', icon: Code2, category: 'developer' },
  { id: 'repair', label: 'Repair Center', icon: Wrench, category: 'developer' },
  { id: 'backups', label: 'Project History', icon: History, category: 'developer' },
  { id: 'settings', label: 'Settings', icon: Settings, category: 'system' },
  { id: 'info', label: 'App Information', icon: Info, category: 'system' },
];

export const JarvisNav: React.FC<JarvisNavProps> = ({
  activeSection,
  onSelectSection,
  diagnosticHealth = 'OPTIMAL',
}) => {
  return (
    <aside className="w-64 bg-[#050C1B] border-r border-cyan-500/15 flex flex-col shrink-0 select-none overflow-y-auto">
      {/* Brand Identification */}
      <div className="p-4 border-b border-cyan-500/15 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-white font-mono">JARVIS OS</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              API 36
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">Android 16 Assistant</div>
        </div>
        <div
          className={`w-2 h-2 rounded-full ${
            diagnosticHealth === 'OPTIMAL'
              ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,210,255,0.8)]'
              : diagnosticHealth === 'DEGRADED_RESILIENT'
              ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
              : 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
          }`}
          title={`Diagnostics: ${diagnosticHealth}`}
        />
      </div>

      {/* Nav List grouped by category */}
      <div className="flex-1 p-2.5 space-y-4">
        {/* Core Section */}
        <div>
          <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Assistant Core
          </div>
          <div className="space-y-0.5 mt-1">
            {navItems
              .filter((i) => i.category === 'core')
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectSection(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,210,255,0.15)]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Intelligence & Web */}
        <div>
          <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Internet & Intelligence
          </div>
          <div className="space-y-0.5 mt-1">
            {navItems
              .filter((i) => i.category === 'intelligence')
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectSection(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,210,255,0.15)]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* System & Telemetry */}
        <div>
          <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Device & Health
          </div>
          <div className="space-y-0.5 mt-1">
            {navItems
              .filter((i) => i.category === 'system')
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectSection(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,210,255,0.15)]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Developer & Repair */}
        <div>
          <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Developer & Repair
          </div>
          <div className="space-y-0.5 mt-1">
            {navItems
              .filter((i) => i.category === 'developer')
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectSection(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,210,255,0.15)]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Exporter shortcut at bottom of nav */}
      <div className="p-3 border-t border-cyan-500/15">
        <button
          onClick={() => onSelectSection('exporter')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSection === 'exporter'
              ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,210,255,0.4)]'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-cyan-500/30'
          }`}
        >
          <span className="flex items-center gap-2">
            <Download className="w-3.5 h-3.5" />
            <span>Android APK Studio</span>
          </span>
          <span className="text-[10px] font-mono text-cyan-300">v1.0</span>
        </button>
      </div>
    </aside>
  );
};
