import React, { useState, useEffect } from 'react';
import {
  Code2,
  Folder,
  File,
  Save,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Check,
  ShieldAlert,
} from 'lucide-react';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  children?: FileNode[];
}

export const CodeEditorSection: React.FC = () => {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>('src/types/jarvis.ts');
  const [fileContent, setFileContent] = useState<string>('');
  const [originalContent, setOriginalContent] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadingFile, setLoadingFile] = useState<boolean>(false);
  const [savingFile, setSavingFile] = useState<boolean>(false);
  const [validating, setValidating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  const loadTree = async () => {
    try {
      const res = await fetch('/api/jarvis/files');
      const data = await res.json();
      setFileTree(data.tree || []);
    } catch (e) {
      console.error('Failed to load file tree:', e);
    }
  };

  const loadFile = async (path: string) => {
    setLoadingFile(true);
    setSaveSuccessMsg('');
    setValidationResult(null);
    try {
      const res = await fetch(`/api/jarvis/file/read?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      setSelectedPath(path);
      setFileContent(data.content || '');
      setOriginalContent(data.content || '');
    } catch (e) {
      console.error('Failed to load file:', e);
    } finally {
      setLoadingFile(false);
    }
  };

  useEffect(() => {
    loadTree();
    loadFile('src/types/jarvis.ts');
  }, []);

  const handleSave = async () => {
    if (!selectedPath || savingFile) return;
    setSavingFile(true);
    setSaveSuccessMsg('');
    try {
      const res = await fetch('/api/jarvis/file/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: selectedPath, content: fileContent }),
      });
      const data = await res.json();
      if (data.success) {
        setOriginalContent(fileContent);
        setSaveSuccessMsg(`Saved! Backup created: ${data.backupId}`);
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      } else {
        alert(data.error || 'Failed to save');
      }
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSavingFile(false);
    }
  };

  const handleValidate = async () => {
    setValidating(true);
    setValidationResult(null);
    try {
      const res = await fetch('/api/jarvis/file/validate', { method: 'POST' });
      const data = await res.json();
      setValidationResult({
        valid: data.valid,
        message: data.valid ? 'TypeScript build validated cleanly.' : data.error || 'Syntax errors detected',
      });
    } catch (err: any) {
      setValidationResult({ valid: false, message: err.message });
    } finally {
      setValidating(false);
    }
  };

  // Render tree node recursively
  const renderNode = (node: FileNode, level = 0) => {
    if (node.type === 'directory') {
      return (
        <div key={node.path} className="space-y-0.5">
          <div
            className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-400 font-mono font-medium"
            style={{ paddingLeft: `${level * 12 + 8}px` }}
          >
            <Folder className="w-3.5 h-3.5 text-cyan-500/70 shrink-0" />
            <span className="truncate">{node.name}</span>
          </div>
          <div>{node.children?.map((child) => renderNode(child, level + 1))}</div>
        </div>
      );
    }

    const isSelected = selectedPath === node.path;
    return (
      <button
        key={node.path}
        onClick={() => loadFile(node.path)}
        className={`w-full flex items-center gap-1.5 px-2 py-1 text-xs font-mono text-left transition-all cursor-pointer ${
          isSelected
            ? 'bg-cyan-950 text-cyan-300 font-bold border-l-2 border-cyan-400'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <File className="w-3.5 h-3.5 shrink-0 text-slate-500" />
        <span className="truncate">{node.name}</span>
      </button>
    );
  };

  const lines = fileContent.split('\n');
  const isDirty = fileContent !== originalContent;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030712] select-none overflow-hidden">
      {/* Editor Top Bar */}
      <div className="p-3 border-b border-cyan-500/15 bg-[#050C1B] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-white font-mono truncate">{selectedPath}</span>
          {isDirty && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
              Unsaved Changes
            </span>
          )}
          {saveSuccessMsg && (
            <span className="text-[10px] font-mono text-emerald-400 truncate">{saveSuccessMsg}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Search in File */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find in file..."
              className="bg-[#030712] border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-600 font-mono w-36 focus:w-48 transition-all focus:outline-none focus:border-cyan-500"
            />
            <Search className="w-3 h-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={handleValidate}
            disabled={validating}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 border border-slate-800 flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle className={`w-3.5 h-3.5 ${validating ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
            <span>{validating ? 'Validating...' : 'Validate Code'}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={!isDirty || savingFile}
            className="px-4 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-black text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingFile ? 'Saving...' : 'Save & Backup'}</span>
          </button>
        </div>
      </div>

      {/* Validation Banner if available */}
      {validationResult && (
        <div
          className={`px-4 py-2 border-b text-xs font-mono flex items-center gap-2 ${
            validationResult.valid
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}
        >
          {validationResult.valid ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span className="truncate">{validationResult.message}</span>
        </div>
      )}

      {/* Main Split: Tree Navigator & Code Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Tree Explorer */}
        <div className="w-60 bg-[#050C1B]/60 border-r border-slate-800/80 overflow-y-auto p-2 space-y-1 shrink-0">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Project Explorer</span>
            <button onClick={loadTree} className="hover:text-cyan-400 cursor-pointer">
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
          <div>{fileTree.map((node) => renderNode(node))}</div>
        </div>

        {/* Right Code Editor Viewport */}
        <div className="flex-1 flex flex-col bg-[#030712] overflow-hidden">
          {loadingFile ? (
            <div className="flex-1 flex items-center justify-center font-mono text-xs text-slate-500">
              Loading source file...
            </div>
          ) : (
            <div className="flex-1 flex overflow-hidden">
              {/* Line Numbers */}
              <div className="w-12 bg-[#050C1B]/80 text-right pr-2 py-3 text-xs font-mono text-slate-600 select-none overflow-hidden shrink-0 border-r border-slate-800/40">
                {lines.map((_, i) => (
                  <div key={i} className="leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Editable Codearea */}
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                spellCheck={false}
                className="flex-1 p-3 bg-transparent text-xs font-mono text-cyan-100 leading-6 resize-none focus:outline-none overflow-auto whitespace-pre selection:bg-cyan-500/30"
              />
            </div>
          )}

          {/* Footer Status Bar */}
          <div className="p-2 bg-[#050C1B] border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <span>Lines: {lines.length}</span>
              <span>·</span>
              <span>UTF-8</span>
              <span>·</span>
              <span>TypeScript / React</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Automated pre-save recovery backup active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
