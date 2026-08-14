'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, FlaskConical, ArrowRight } from 'lucide-react';

export function ResearchGateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('xfactor_research_verified');
      if (!consent) {
        setIsOpen(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleConfirm = () => {
    try {
      localStorage.setItem('xfactor_research_verified', 'true');
    } catch {
      // ignore
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0c131f] border border-cyan-500/30 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 text-foreground relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
              Laboratory Research Verification
            </span>
            <h2 className="text-xl font-display font-bold text-white mt-1">Research Use Only Access Gate</h2>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-5">
          All chemical compounds and peptides distributed by <strong>X-Factor Peptides</strong> are strictly synthesized for <strong>in-vitro laboratory, scientific research, and analytical development</strong>.
        </p>

        <div className="bg-[#070d18] border border-slate-800 rounded-xl p-4 space-y-2.5 mb-6 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>Products are <strong>strictly NOT for human or animal consumption</strong>, medical diagnostics, or therapeutic treatment.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>Purchaser must possess appropriate laboratory safety infrastructure and handling protocols.</span>
          </div>
        </div>

        <label className="flex items-start gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition-colors mb-6">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-400 accent-cyan-500"
          />
          <span className="text-xs text-slate-200 leading-tight">
            I certify that I am a qualified laboratory researcher or academic institution acquiring materials solely for in-vitro research purposes.
          </span>
        </label>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!agreed}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-900/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Enter Research Portal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
