import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Volume2,
  Trash2,
  Download,
  Send,
  Sparkles,
  User,
  Wrench,
  Bot,
} from 'lucide-react';

interface ChatMessage {
  role: string;
  text: string;
  functionCalls?: Array<{ name: string; args: any }>;
  timestamp?: string;
}

interface AiConversationSectionProps {
  chatHistory: Array<{ role: string; text: string }>;
  onSendMessage: (query: string) => Promise<string>;
  onReplaySpeech: (text: string) => void;
  onClearHistory: () => void;
}

export const AiConversationSection: React.FC<AiConversationSectionProps> = ({
  chatHistory,
  onSendMessage,
  onReplaySpeech,
  onClearHistory,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const msg = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);
    try {
      await onSendMessage(msg);
    } finally {
      setIsSending(false);
    }
  };

  const handleExportTranscript = () => {
    const text = chatHistory
      .map((m) => `[${m.role.toUpperCase()}]\n${m.text}\n`)
      .join('\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jarvis-conversation-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030712] select-none overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 border-b border-cyan-500/15 bg-[#050C1B] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-white font-mono">CONVERSATION LOG</span>
          <span className="text-xs text-slate-400 tabular-nums font-mono">
            ({chatHistory.length} exchanges)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportTranscript}
            disabled={chatHistory.length === 0}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-xs font-mono text-slate-300 border border-slate-800 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export</span>
          </button>

          <button
            onClick={onClearHistory}
            disabled={chatHistory.length === 0}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 disabled:opacity-40 text-xs font-mono text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <Bot className="w-12 h-12 text-cyan-500/30 mb-3" />
            <p className="text-sm font-mono text-slate-400">No conversation history yet</p>
            <p className="text-xs text-slate-600 mt-1 max-w-sm">
              Initiate voice commands or type a prompt below to converse with JARVIS.
            </p>
          </div>
        ) : (
          chatHistory.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 max-w-2xl ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                    isUser
                      ? 'bg-slate-800 text-slate-300 border border-slate-700'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,210,255,0.2)]'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-cyan-400" />}
                </div>

                {/* Bubble */}
                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-cyan-950/50 text-cyan-100 border border-cyan-500/30 rounded-tr-none'
                      : 'bg-[#050C1B] text-slate-200 border border-slate-800 rounded-tl-none shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                      {isUser ? 'You' : 'JARVIS'}
                    </span>
                    {!isUser && (
                      <button
                        onClick={() => onReplaySpeech(msg.text)}
                        className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer opacity-70 hover:opacity-100"
                        title="Play audio speech synthesis"
                      >
                        <Volume2 className="w-3 h-3" />
                        Play
                      </button>
                    )}
                  </div>

                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-cyan-500/15 bg-[#050C1B]">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message to JARVIS..."
            className="flex-1 bg-[#030712] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-black font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
