import React, { useState } from 'react';
import {
  Terminal,
  Cpu,
  Layers,
  Shield,
  Send,
  Code,
  CheckCircle,
  Copy,
  Check,
  Server,
  Play,
} from 'lucide-react';

export const DeveloperStudioSection: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/jarvis/chat');
  const [requestPayload, setRequestPayload] = useState<string>(
    JSON.stringify({ message: 'Hello JARVIS, report status' }, null, 2)
  );
  const [responseOutput, setResponseOutput] = useState<string>('Click "Send Request" to test endpoint');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const apiEndpoints = [
    {
      method: 'POST',
      path: '/api/jarvis/chat',
      desc: 'Primary conversational AI route with function calls & local fallback',
      sample: { message: 'What is my battery level?', context: { batteryLevel: '88%' } },
    },
    {
      method: 'POST',
      path: '/api/jarvis/search',
      desc: 'Genuine public web search querying DuckDuckGo & Wikipedia',
      sample: { query: 'Android 16 release date' },
    },
    {
      method: 'POST',
      path: '/api/jarvis/fetch-page',
      desc: 'Live page fetcher and sanitized HTML reader',
      sample: { url: 'https://en.wikipedia.org/wiki/Artificial_intelligence' },
    },
    {
      method: 'GET',
      path: '/api/jarvis/diagnostics/run',
      desc: '20-point comprehensive subsystem diagnostics runner',
      sample: null,
    },
    {
      method: 'GET',
      path: '/api/jarvis/files',
      desc: 'Secure workspace project file tree scanner',
      sample: null,
    },
    {
      method: 'GET',
      path: '/api/jarvis/backups',
      desc: 'List all project backups and recovery checkpoints',
      sample: null,
    },
  ];

  const handleSelectEndpoint = (ep: (typeof apiEndpoints)[0]) => {
    setSelectedEndpoint(ep.path);
    setRequestPayload(ep.sample ? JSON.stringify(ep.sample, null, 2) : '');
    setResponseOutput('Ready for test.');
  };

  const handleExecuteRequest = async () => {
    setLoading(true);
    setResponseOutput('Dispatching HTTP request...');
    try {
      const ep = apiEndpoints.find((e) => e.path === selectedEndpoint);
      const isPost = ep?.method === 'POST';

      const res = await fetch(selectedEndpoint, {
        method: isPost ? 'POST' : 'GET',
        headers: isPost ? { 'Content-Type': 'application/json' } : {},
        body: isPost ? requestPayload : undefined,
      });

      const data = await res.json();
      setResponseOutput(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResponseOutput(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(responseOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030712] select-none overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Studio Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h1 className="text-base font-bold text-white font-mono">DEVELOPER STUDIO & ARCHITECTURE</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Architecture topology, runtime services status, and interactive REST API explorer
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/30">
            Node.js v22 · React 19 · Vite 8
          </span>
        </div>
      </div>

      {/* Architecture Topology Cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          System Architecture Topology
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-[#050C1B] border border-cyan-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
              <Layers className="w-4 h-4" />
              <span>Layer 1: Android 16 Native</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              • FloatingBubbleService (Overlay window)
              <br />• JarvisWakeWordService (Microphone FGS)
              <br />• Room SQLite Database with WorkManager
              <br />• Jetpack Compose & Material 3 UI
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#050C1B] border border-cyan-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
              <Server className="w-4 h-4" />
              <span>Layer 2: Server & Router</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              • Express.js Full-Stack Backend
              <br />• Vite Dev Middleware Mounting
              <br />• DuckDuckGo & Wikipedia Search Gateway
              <br />• Sandboxed File Read/Write Engine
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#050C1B] border border-cyan-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
              <Cpu className="w-4 h-4" />
              <span>Layer 3: AI Intelligence</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              • Primary: Gemini 3.1 Flash Lite (~800ms)
              <br />• Secondary: Gemini 3.8 Flash
              <br />• Multi-Tier Local Resilience Engine
              <br />• 3-Tier Security Confirmation Gate
            </p>
          </div>
        </div>
      </div>

      {/* Interactive REST API Sandbox */}
      <div className="p-5 rounded-2xl bg-[#050C1B] border border-cyan-500/20 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-mono">JARVIS REST API EXPLORER</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Live Endpoint Inspection</span>
        </div>

        {/* Endpoints List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {apiEndpoints.map((ep) => (
            <button
              key={ep.path}
              onClick={() => handleSelectEndpoint(ep)}
              className={`p-2.5 rounded-lg text-left font-mono transition-all cursor-pointer border ${
                selectedEndpoint === ep.path
                  ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-200'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[10px]">
                <span
                  className={`px-1 rounded font-bold ${
                    ep.method === 'POST' ? 'bg-cyan-900 text-cyan-300' : 'bg-emerald-900 text-emerald-300'
                  }`}
                >
                  {ep.method}
                </span>
                <span className="truncate text-white font-semibold">{ep.path}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{ep.desc}</p>
            </button>
          ))}
        </div>

        {/* Request & Response Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Request Payload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                Request JSON Payload
              </span>
              <button
                onClick={handleExecuteRequest}
                disabled={loading}
                className="px-3 py-1 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-black text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-black" />
                <span>{loading ? 'Sending...' : 'Send Request'}</span>
              </button>
            </div>
            <textarea
              value={requestPayload}
              onChange={(e) => setRequestPayload(e.target.value)}
              placeholder="No payload required for GET"
              className="w-full h-48 bg-[#030712] border border-cyan-500/20 rounded-xl p-3 text-xs font-mono text-cyan-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          {/* Response Inspector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                Response Output
              </span>
              <button
                onClick={handleCopyResponse}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="w-full h-48 bg-[#030712] border border-cyan-500/20 rounded-xl p-3 text-xs font-mono text-slate-300 overflow-y-auto whitespace-pre-wrap">
              {responseOutput}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
