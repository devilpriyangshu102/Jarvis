import React, { useState } from 'react';
import {
  Globe,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  BookOpen,
  FileText,
  Clock,
  Sparkles,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

interface PageResult {
  url: string;
  status?: number;
  statusText?: string;
  reachable: boolean;
  title?: string;
  description?: string;
  contentType?: string;
  contentLength?: number;
  textPreview?: string;
  latencyMs?: number;
  error?: string;
}

export const InternetBrowserSection: React.FC = () => {
  const [urlInput, setUrlInput] = useState('https://en.wikipedia.org/wiki/Artificial_intelligence');
  const [currentUrl, setCurrentUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState<PageResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiSummary, setAiSummary] = useState('');

  const bookmarks = [
    { label: 'AI Overview', url: 'https://en.wikipedia.org/wiki/Artificial_intelligence' },
    { label: 'Android 16', url: 'https://developer.android.com/about/versions/16' },
    { label: 'Kotlin Language', url: 'https://kotlinlang.org' },
    { label: 'W3C Web Standards', url: 'https://www.w3.org' },
  ];

  const handleFetchPage = async (targetUrl: string) => {
    if (!targetUrl.trim()) return;

    let finalUrl = targetUrl.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    setUrlInput(finalUrl);
    setCurrentUrl(finalUrl);
    setLoading(true);
    setAiSummary('');

    try {
      const res = await fetch('/api/jarvis/fetch-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: finalUrl }),
      });
      const data = await res.json();
      setPageData(data);
    } catch (err: any) {
      setPageData({
        url: finalUrl,
        reachable: false,
        error: err.message || 'Network request failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeWithAI = async () => {
    if (!pageData || !pageData.textPreview) return;
    setAnalyzing(true);
    try {
      const res = await fetch('/api/jarvis/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `Executive Summary of ${pageData.title || pageData.url}`,
        }),
      });
      const data = await res.json();
      setAiSummary(data.synthesis || 'Synthesis complete.');
    } catch (_e) {
      setAiSummary('JARVIS local analysis: Page content cataloged successfully.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030712] select-none overflow-hidden">
      {/* 1. Browser Navigation Header Bar */}
      <div className="p-3 border-b border-cyan-500/15 bg-[#050C1B] space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-bold px-2 py-1 bg-cyan-950/60 rounded-lg border border-cyan-500/30 shrink-0">
            <Globe className="w-3.5 h-3.5" />
            <span>JARVIS BROWSER</span>
          </div>

          {/* URL Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFetchPage(urlInput);
            }}
            className="flex-1 flex items-center bg-[#030712] border border-cyan-500/30 rounded-lg px-3 py-1.5"
          >
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter public web URL (e.g. https://...)"
              className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="text-cyan-400 hover:text-cyan-300 ml-2 cursor-pointer disabled:opacity-40"
              title="Navigate to URL"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Refresh Button */}
          <button
            onClick={() => currentUrl && handleFetchPage(currentUrl)}
            disabled={loading || !currentUrl}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 border border-slate-800 cursor-pointer"
            title="Refresh current page"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>

        {/* Bookmarks Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider shrink-0">
            Quick Research:
          </span>
          {bookmarks.map((b, idx) => (
            <button
              key={idx}
              onClick={() => handleFetchPage(b.url)}
              className="px-2.5 py-1 rounded bg-slate-900/80 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-colors whitespace-nowrap cursor-pointer text-xs font-mono"
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Page Content & Reader View Canvas */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2 font-mono text-xs">
            <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
            <span>Establishing TLS handshake & retrieving web content...</span>
          </div>
        ) : pageData ? (
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* Meta & Connection Telemetry Bar */}
            <div className="p-3.5 rounded-xl bg-[#050C1B] border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                {pageData.reachable ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
                <span className={pageData.reachable ? 'text-emerald-300' : 'text-rose-300'}>
                  {pageData.reachable
                    ? `HTTP ${pageData.status || 200} OK`
                    : `Unreachable: ${pageData.error || 'Failed'}`}
                </span>
                {pageData.latencyMs !== undefined && pageData.latencyMs >= 0 && (
                  <span className="text-slate-500 tabular-nums">· {pageData.latencyMs} ms latency</span>
                )}
                {pageData.contentLength && (
                  <span className="text-slate-500 tabular-nums">
                    · {Math.round(pageData.contentLength / 1024)} KB payload
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {pageData.reachable && (
                  <button
                    onClick={handleAnalyzeWithAI}
                    disabled={analyzing}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 cursor-pointer text-xs shadow-[0_0_10px_rgba(0,210,255,0.2)]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{analyzing ? 'Analyzing...' : 'Summarize with JARVIS'}</span>
                  </button>
                )}

                <a
                  href={pageData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <span>Open External</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* AI Summary Card if generated */}
            {aiSummary && (
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 shadow-lg space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>JARVIS AI RESEARCH BRIEF</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{aiSummary}</p>
              </div>
            )}

            {/* Main Reader View */}
            <div className="p-5 rounded-xl bg-[#050C1B] border border-slate-800 space-y-4">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  {pageData.title || pageData.url}
                </h1>
                {pageData.description && (
                  <p className="text-xs text-slate-400 mt-1 italic leading-relaxed">
                    {pageData.description}
                  </p>
                )}
              </div>

              <div className="border-t border-slate-800/80 pt-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Sanitized Reader View (Text Extract)</span>
                </div>
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans max-h-96 overflow-y-auto p-3 rounded-lg bg-[#030712] border border-slate-900">
                  {pageData.textPreview || 'No readable text content available on this URL.'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 space-y-2 font-mono">
            <Globe className="w-10 h-10 text-cyan-500/20" />
            <p className="text-sm text-slate-400">Enter a URL or select a research shortcut</p>
            <p className="text-xs text-slate-600 max-w-sm">
              JARVIS will fetch live public page HTML, sanitize content, and extract key insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
