import React, { useState, useEffect } from 'react';
import {
  Activity,
  Play,
  Download,
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  Cpu,
  Server,
  Wifi,
  HardDrive,
  FileCode,
} from 'lucide-react';
import { DiagnosticSuiteReport, DiagnosticItem } from '../../types/jarvis';

export const SystemDiagnosticsSection: React.FC = () => {
  const [report, setReport] = useState<DiagnosticSuiteReport | null>(null);
  const [running, setRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const runDiagnostics = async () => {
    setRunning(true);
    try {
      const res = await fetch('/api/jarvis/diagnostics/run');
      const data = await res.json();
      setReport(data);
    } catch (err: any) {
      console.error('Diagnostics failed:', err);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const categories = [
    { id: 'all', label: 'All Tests (20)' },
    { id: 'core', label: 'Core Runtime' },
    { id: 'ai', label: 'AI Engine' },
    { id: 'network', label: 'Networking' },
    { id: 'filesystem', label: 'Filesystem' },
    { id: 'android', label: 'Android 16' },
    { id: 'security', label: 'Security Gate' },
  ];

  const filteredResults = report
    ? report.results.filter(
        (r) => selectedCategory === 'all' || r.category === selectedCategory
      )
    : [];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030712] select-none overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Diagnostics Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h1 className="text-base font-bold text-white font-mono">20-POINT SYSTEM DIAGNOSTICS SUITE</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Comprehensive audit of runtime engine, AI models, network gateways, Room DB, and Android 16 specs
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={runDiagnostics}
            disabled={running}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-black font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
            <span>{running ? 'Testing Subsystems...' : 'Run Full Diagnostics'}</span>
          </button>

          <a
            href="/api/jarvis/diagnostics/export?format=markdown"
            download="jarvis-diagnostics-report.md"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Report</span>
          </a>
        </div>
      </div>

      {/* Metrics Banner */}
      {report && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-xl bg-[#050C1B] border border-cyan-500/20">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Overall Health</div>
            <div
              className={`text-lg font-bold font-mono mt-1 ${
                report.overallHealth === 'OPTIMAL'
                  ? 'text-cyan-400'
                  : report.overallHealth === 'DEGRADED_RESILIENT'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {report.overallHealth}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">
              Score: {report.metrics.scorePercent}%
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#050C1B] border border-emerald-500/20">
            <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Passing Tests</div>
            <div className="text-xl font-bold font-mono text-emerald-300 mt-1 tabular-nums">
              {report.metrics.pass} / {report.metrics.total}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">Fully operational</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#050C1B] border border-amber-500/20">
            <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">Warnings</div>
            <div className="text-xl font-bold font-mono text-amber-300 mt-1 tabular-nums">
              {report.metrics.warning}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">Resilient fallback active</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#050C1B] border border-rose-500/20">
            <div className="text-[10px] font-mono text-rose-400 uppercase tracking-wider">Critical Failures</div>
            <div className="text-xl font-bold font-mono text-rose-300 mt-1 tabular-nums">
              {report.metrics.fail}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">Action required</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#050C1B] border border-cyan-500/20">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Execution Time</div>
            <div className="text-xs font-mono text-slate-300 mt-1.5 truncate">
              {new Date(report.timestamp).toLocaleTimeString()}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">Auto-sanitized</div>
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Test Execution Results Table */}
      <div className="border border-cyan-500/20 rounded-xl overflow-hidden bg-[#050C1B]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#030712] border-b border-cyan-500/15 text-slate-400">
              <tr>
                <th className="py-3 px-4 font-semibold">Test ID</th>
                <th className="py-3 px-4 font-semibold">Subsystem Name</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Measurement</th>
                <th className="py-3 px-4 font-semibold">Inspection Details & Diagnostics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredResults.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-300 whitespace-nowrap">{item.id}</td>
                  <td className="py-3 px-4 font-medium text-white whitespace-nowrap">{item.name}</td>
                  <td className="py-3 px-4 text-slate-400 uppercase text-[10px]">{item.category}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'PASS'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : item.status === 'WARNING'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                          : item.status === 'FAIL'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {item.status === 'PASS' ? (
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                      ) : item.status === 'WARNING' ? (
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                      ) : item.status === 'FAIL' ? (
                        <XCircle className="w-3 h-3 text-rose-400" />
                      ) : (
                        <HelpCircle className="w-3 h-3 text-slate-400" />
                      )}
                      <span>{item.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-cyan-300 font-semibold">{item.measurement}</td>
                  <td className="py-3 px-4 text-slate-300 max-w-md">
                    <div>{item.details}</div>
                    {item.recommendation && (
                      <div className="text-[11px] text-amber-400 mt-1 italic">
                        ↳ Recommendation: {item.recommendation}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
