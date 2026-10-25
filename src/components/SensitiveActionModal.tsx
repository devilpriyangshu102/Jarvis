import React from 'react';
import { ShieldAlert, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { SensitiveActionRequest } from '../types/jarvis';

interface SensitiveActionModalProps {
  request: SensitiveActionRequest | null;
  onConfirm: (request: SensitiveActionRequest) => void;
  onCancel: () => void;
}

export const SensitiveActionModal: React.FC<SensitiveActionModalProps> = ({
  request,
  onConfirm,
  onCancel,
}) => {
  if (!request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-gradient-to-b from-[#0B1528] to-[#070D1B] border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,210,255,0.25)] text-slate-100">
        
        {/* Security Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">Security Gate: Tier 3 Sensitive Action</h3>
            <p className="text-xs text-amber-400/90 font-mono">Explicit User Authorization Required</p>
          </div>
        </div>

        {/* Action Description */}
        <div className="bg-[#050C1B] rounded-xl p-4 border border-cyan-500/20 mb-5 space-y-2.5 text-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Requested Action</span>
            <span className="font-mono text-cyan-400 uppercase font-semibold">{request.actionType.replace('_', ' ')}</span>
          </div>

          <div className="border-t border-slate-800/80 pt-2">
            <span className="text-xs text-slate-400 block mb-0.5">Target Destination:</span>
            <span className="font-medium text-white">{request.recipientOrTarget}</span>
          </div>

          <div className="border-t border-slate-800/80 pt-2">
            <span className="text-xs text-slate-400 block mb-0.5">Payload Content:</span>
            <p className="text-slate-300 italic text-xs bg-slate-900/60 p-2.5 rounded border border-slate-800">
              "{request.details}"
            </p>
          </div>
        </div>

        {/* Privacy Note */}
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          JARVIS strictly enforces Android privacy sandbox rules. No transmission or modification will occur until you confirm.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all cursor-pointer"
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            Deny & Cancel
          </button>
          <button
            onClick={() => onConfirm(request)}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-xl shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-black" />
            Approve & Execute
          </button>
        </div>

      </div>
    </div>
  );
};
