import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Globe,
  BookOpen,
  Filter,
  ArrowUpRight,
} from 'lucide-react';
import { SearchResultItem, ResearchBrief } from '../../types/jarvis';

export const ResearchSearchSection: React.FC = () => {
  const [query, setQuery] = useState('Android 16 release developer features');
  const [loading, setLoading] = useState(false);
  const [researchBrief, setResearchBrief] = useState<ResearchBrief | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setCopied(false);

    try {
      const res = await fetch('/api/jarvis/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: query.trim() }),
      });
      const data = await res.json();
      setResearchBrief(data);
    } catch (err: any) {
      console.error('Research query failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyBrief = () => {
    if (!researchBrief) return;
    const text = `JARVIS RESEARCH BRIEF: ${researchBrief.topic}\n\n` +
      `${researchBrief.synthesis}\n\n` +
      `Sources:\n` +
      researchBrief.sources.map((s, i) => `[${i + 1}] ${s.title}: ${s.url}`).join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickTopics = [
    'Android 16 API 36 features',
    'Quantum computing breakthroughs 2026',
    'Jetpack Compose performance optimizations',
    'Room SQLite encryption best practices',
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030712] select-none overflow-hidden">
      {/* Search Header */}
      <div className="p-4 border-b border-cyan-500/15 bg-[#050C1B]">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-bold text-white font-mono">GENUINE WEB RESEARCH</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                Live Retrieval + Citations
              </span>
            </div>

            {researchBrief && (
              <button
                onClick={handleCopyBrief}
                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 border border-slate-800 flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copied ? 'Copied' : 'Copy Brief'}</span>
              </button>
            )}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter research topic or question to query real web sources..."
                className="w-full bg-[#030712] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-black font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Researching...' : 'Conduct Research'}</span>
            </button>
          </form>

          {/* Quick Topics */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider shrink-0">
              Suggested:
            </span>
            {quickTopics.map((t, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(t);
                  setTimeout(() => handleSearch(), 50);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-colors whitespace-nowrap cursor-pointer text-xs font-mono"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results View */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3 font-mono text-xs">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <span>Querying active web indices & synthesizing source-grounded report...</span>
          </div>
        ) : researchBrief ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Grounded AI Synthesis Card */}
            <div className="p-5 rounded-2xl bg-[#050C1B] border border-cyan-500/30 shadow-lg space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/15">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>SYNTHESIZED RESEARCH BRIEF</span>
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  Topic: "{researchBrief.topic}"
                </div>
              </div>

              <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {researchBrief.synthesis}
              </div>
            </div>

            {/* Verified Sources Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Verified Web Sources ({researchBrief.sources.length})</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Clickable links directly connect to remote pages
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {researchBrief.sources.map((source, index) => (
                  <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-[#050C1B] hover:bg-[#081329] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-cyan-500/20">
                          Source [{index + 1}] · {source.source}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                      </div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {source.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {source.snippet}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-900 text-[10px] font-mono text-slate-500 truncate">
                      {source.url}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 space-y-2 font-mono">
            <Search className="w-10 h-10 text-cyan-500/20" />
            <p className="text-sm text-slate-400">Search any subject to conduct web research</p>
            <p className="text-xs text-slate-600 max-w-sm">
              JARVIS retrieves organic search results, reads the pages, and synthesizes a structured report with source citations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
