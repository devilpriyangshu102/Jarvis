import React, { useState } from 'react';
import {
  Wrench,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  FileDiff,
  RotateCcw,
  Check,
  ShieldCheck,
  Play,
  ArrowRight,
} from 'lucide-react';
import { RepairProposal } from '../../types/jarvis';

export const RepairCenterSection: React.FC = () => {
  const [issueInput, setIssueInput] = useState<string>(
    'Optimize timeout handling and add local fallback guard for voice speech recognition'
  );
  const [targetFile, setTargetFile] = useState<string>('server.ts');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [proposal, setProposal] = useState<RepairProposal | null>(null);
  const [applying, setApplying] = useState<boolean>(false);
  const [applyResult, setApplyResult] = useState<{
    success: boolean;
    backupId?: string;
    message: string;
  } | null>(null);
  const [rollbackBackupId, setRollbackBackupId] = useState<string | null>(null);
  const [rollbackStatus, setRollbackStatus] = useState<string>('');

  const commonIssues = [
    {
      title: 'Optimize AI latency & timeouts',
      file: 'server.ts',
      desc: 'Ensure candidate models are raced with 7s timeout and fallback to local resilience engine.',
    },
    {
      title: 'Harden 3-tier action security gate',
      file: 'src/App.tsx',
      desc: 'Verify confirmation modal is displayed before SMS dispatch or data deletion.',
    },
    {
      title: 'Verify Android 16 targetSdk compliance',
      file: 'server.ts',
      desc: 'Check that targetSdk is set to 36 and edge-to-edge window insets are respected.',
    },
  ];

  const handleAnalyze = async () => {
    if (!issueInput.trim() || analyzing) return;
    setAnalyzing(true);
    setProposal(null);
    setApplyResult(null);

    try {
      const res = await fetch('/api/jarvis/repair/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueDescription: issueInput,
          filePath: targetFile,
        }),
      });

      const data = await res.json();
      setProposal(data.patch);
    } catch (err: any) {
      alert(`Analysis failed: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplyRepair = async () => {
    if (!proposal || applying) return;
    setApplying(true);
    setApplyResult(null);

    try {
      const res = await fetch('/api/jarvis/repair/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: targetFile,
          originalSnippet: proposal.originalSnippet,
          replacementSnippet: proposal.replacementSnippet,
          userConfirmed: true,
        }),
      });

      const data = await res.json();
      setApplyResult(data);
      if (data.backupId) {
        setRollbackBackupId(data.backupId);
      }
    } catch (err: any) {
      setApplyResult({
        success: false,
        message: err.message || 'Failed to apply patch',
      });
    } finally {
      setApplying(false);
    }
  };

  const handleRollback = async () => {
    if (!rollbackBackupId) return;
    setRollbackStatus('Reverting...');
    try {
      const res = await fetch('/api/jarvis/backup/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupId: rollbackBackupId }),
      });
      const data = await res.json();
      if (data.success) {
        setRollbackStatus('Rollback successful! File restored to pre-patch state.');
        setApplyResult(null);
      } else {
        setRollbackStatus(`Rollback failed: ${data.error}`);
      }
    } catch (e: any) {
      setRollbackStatus(`Rollback error: ${e.message}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030712] select-none overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-cyan-400" />
            <h1 className="text-base font-bold text-white font-mono">CONTROLLED SELF-DIAGNOSIS & REPAIR</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Detect · Collect · Analyze · Propose · Review Diff · Validate · User Approval · Apply · Rollback
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Human Approval Gate Enforced</span>
          </span>
        </div>
      </div>

      {/* Anomaly Input & Presets */}
      <div className="p-5 rounded-2xl bg-[#050C1B] border border-cyan-500/20 space-y-4">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Step 1: Anomaly Description & Target Module
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400">Diagnostic Finding or Error Log:</label>
            <textarea
              value={issueInput}
              onChange={(e) => setIssueInput(e.target.value)}
              placeholder="Describe detected failure or paste error message..."
              className="w-full h-24 bg-[#030712] border border-cyan-500/30 rounded-xl p-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400">Target Source File:</label>
            <input
              type="text"
              value={targetFile}
              onChange={(e) => setTargetFile(e.target.value)}
              className="w-full bg-[#030712] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
            />

            <button
              onClick={handleAnalyze}
              disabled={analyzing || !issueInput.trim()}
              className="w-full mt-3 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-black font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
              <span>{analyzing ? 'Analyzing Root Cause...' : 'Analyze & Propose Repair'}</span>
            </button>
          </div>
        </div>

        {/* Preset issues */}
        <div className="pt-2">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">
            Quick Diagnose Common Scenarios:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {commonIssues.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIssueInput(item.desc);
                  setTargetFile(item.file);
                }}
                className="p-2.5 rounded-lg bg-slate-900/60 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/30 text-left transition-all cursor-pointer"
              >
                <div className="text-xs font-semibold text-white">{item.title}</div>
                <div className="text-[10px] font-mono text-cyan-400 mt-0.5">{item.file}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step 2 & 3: Proposed Diff & Review */}
      {proposal && (
        <div className="p-5 rounded-2xl bg-[#050C1B] border border-cyan-500/30 shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <FileDiff className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-mono">PROPOSED REPAIR DIFF</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Component: {proposal.affectedComponent} · Confidence: {proposal.confidenceScore}%
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleApplyRepair}
                disabled={applying}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Check className="w-4 h-4" />
                <span>{applying ? 'Applying...' : 'Approve & Apply Patch'}</span>
              </button>
            </div>
          </div>

          {/* Root cause explanation */}
          <div className="p-3.5 rounded-xl bg-[#030712] border border-slate-800 space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Root Cause Analysis
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{proposal.rootCause}</p>
            <p className="text-xs text-slate-400 leading-relaxed font-sans italic mt-1">
              ↳ {proposal.explanation}
            </p>
          </div>

          {/* Unified Diff View */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Code Modification Diff:
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
              {/* Deletion / Original */}
              <div className="bg-rose-950/30 p-3 border-b border-rose-900/40 text-rose-300">
                <div className="text-[10px] uppercase font-bold text-rose-400 mb-1 flex items-center gap-1">
                  <span>- Lines to replace</span>
                </div>
                <pre className="whitespace-pre-wrap">{proposal.originalSnippet}</pre>
              </div>

              {/* Insertion / Replacement */}
              <div className="bg-emerald-950/30 p-3 text-emerald-300">
                <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1 flex items-center gap-1">
                  <span>+ Proposed corrected lines</span>
                </div>
                <pre className="whitespace-pre-wrap">{proposal.replacementSnippet}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Apply Result & Rollback Control */}
      {applyResult && (
        <div
          className={`p-5 rounded-2xl border space-y-3 ${
            applyResult.success
              ? 'bg-emerald-950/20 border-emerald-500/40'
              : 'bg-rose-950/20 border-rose-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {applyResult.success ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              )}
              <span className="text-sm font-bold font-mono text-white">
                {applyResult.success ? 'Patch Applied & Verified' : 'Application Alert'}
              </span>
            </div>

            {rollbackBackupId && (
              <button
                onClick={handleRollback}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-mono text-amber-300 border border-amber-500/30 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Instant Rollback</span>
              </button>
            )}
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed">{applyResult.message}</p>
          {rollbackStatus && (
            <p className="text-xs font-mono text-cyan-300 pt-1">{rollbackStatus}</p>
          )}
        </div>
      )}
    </div>
  );
};
