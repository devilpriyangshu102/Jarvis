import React, { useState, useEffect } from 'react';
import {
  History,
  RotateCcw,
  Plus,
  FileCheck,
  Calendar,
  HardDrive,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';
import { BackupRecord } from '../../types/jarvis';

export const ProjectBackupsSection: React.FC = () => {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('');

  const loadBackups = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/jarvis/backups');
      const data = await res.json();
      setBackups(data.backups || []);
    } catch (e) {
      console.error('Failed to load backups:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBackups();
  }, []);

  const handleCreateManualCheckpoint = async () => {
    setCreating(true);
    setStatusMsg('');
    try {
      const res = await fetch('/api/jarvis/backup/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetPath: 'server.ts' }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg(`Checkpoint ${data.backupId} created.`);
        await loadBackups();
      }
    } catch (err: any) {
      alert(`Checkpoint creation failed: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  const handleRestore = async (backupId: string) => {
    if (!confirm(`Are you sure you want to restore checkpoint ${backupId}? Current file content will be reverted.`)) {
      return;
    }

    try {
      const res = await fetch('/api/jarvis/backup/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupId }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg(`Checkpoint ${backupId} restored successfully!`);
        await loadBackups();
      } else {
        alert(data.error || 'Restore failed');
      }
    } catch (e: any) {
      alert(`Restore error: ${e.message}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030712] select-none overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h1 className="text-base font-bold text-white font-mono">PROJECT HISTORY & BACKUPS</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable version snapshots, pre-edit recovery points, and instant state rollback
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadBackups}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
            title="Refresh backups list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleCreateManualCheckpoint}
            disabled={creating}
            className="px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-black font-bold text-xs font-mono shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{creating ? 'Creating...' : 'Create Snapshot'}</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Backups List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Recorded Recovery Checkpoints ({backups.length})
          </h2>
          <span className="text-[11px] font-mono text-slate-500">Stored in .jarvis_backups/</span>
        </div>

        {backups.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 font-mono space-y-2">
            <History className="w-10 h-10 text-cyan-500/20" />
            <p className="text-sm text-slate-400">No backup snapshots recorded yet</p>
            <p className="text-xs text-slate-600 max-w-sm">
              Backups are automatically created before any code edit or repair patch, or manually using "Create Snapshot".
            </p>
          </div>
        ) : (
          <div className="border border-cyan-500/20 rounded-xl overflow-hidden bg-[#050C1B]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#030712] border-b border-cyan-500/15 text-slate-400">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Backup Checkpoint ID</th>
                    <th className="py-3 px-4 font-semibold">Source File</th>
                    <th className="py-3 px-4 font-semibold">Timestamp</th>
                    <th className="py-3 px-4 font-semibold">File Size</th>
                    <th className="py-3 px-4 font-semibold">Type</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {backups.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4 text-cyan-300 font-semibold">{b.id}</td>
                      <td className="py-3 px-4 text-white font-medium">{b.originalPath}</td>
                      <td className="py-3 px-4 text-slate-400 tabular-nums">
                        {new Date(b.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-400 tabular-nums">
                        {Math.round(b.size / 1024)} KB
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            b.isManual
                              ? 'bg-blue-950 text-blue-300 border border-blue-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {b.isManual ? 'Manual Snapshot' : 'Auto Pre-Edit'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleRestore(b.id)}
                          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-cyan-950 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 text-xs font-mono flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restore</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
