'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, FileText, ArrowRight, Zap, Film, Clock, Type, Wand2 } from 'lucide-react';
import { useState } from 'react';

export default function ModeSelection() {
  const router = useRouter();
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);

  const handleSelect = (mode: 'scratch' | 'custom-script') => {
    localStorage.setItem('yt_shorts_mode', mode);
    if (mode === 'custom-script') {
      router.push('/custom-script');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#fcfdfe] flex items-center justify-center relative overflow-hidden fixed inset-0 z-[100]">
      {/* Background decorative blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-5%] w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] bg-purple-100/40 rounded-full blur-[100px]" />
        <div className="absolute top-[30%] right-[15%] w-[250px] h-[250px] bg-violet-100/30 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2.5 bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] border border-indigo-100 shadow-sm mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
            YT Shorts Studio
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-[#0f172a] tracking-tighter leading-[1.1] mb-5">
            What&apos;s your
            <span className="block bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-600 bg-clip-text text-transparent">workflow?</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-md mx-auto">
            Pick how you want to create your next viral short.
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Generate from Scratch */}
          <button
            onClick={() => handleSelect('scratch')}
            onMouseEnter={() => setHoveredMode('scratch')}
            onMouseLeave={() => setHoveredMode(null)}
            className="group relative bg-white rounded-[2rem] p-10 text-left transition-all duration-500 overflow-hidden border-2 border-slate-100 hover:border-indigo-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(99,102,241,0.12)] hover:-translate-y-1"
          >
            {/* Hover glow */}
            <div className={`absolute inset-0 bg-gradient-to-br from-indigo-50/80 to-violet-50/50 transition-opacity duration-500 ${hoveredMode === 'scratch' ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`absolute -right-10 -bottom-10 transition-all duration-700 ${hoveredMode === 'scratch' ? 'opacity-[0.06] rotate-12 scale-110' : 'opacity-[0.03] rotate-0 scale-100'}`}>
              <Wand2 size={180} strokeWidth={1} className="text-indigo-600" />
            </div>
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-8 shadow-lg shadow-indigo-200/50 group-hover:shadow-indigo-300/60 group-hover:scale-105 transition-all">
                <Sparkles size={24} className="text-white" />
              </div>
              
              {/* Title */}
              <h2 className="text-2xl font-black text-[#0f172a] mb-3 tracking-tight group-hover:text-indigo-600 transition-colors">
                Generate from Scratch
              </h2>
              <p className="text-slate-500 font-medium text-[15px] leading-relaxed mb-8">
                AI picks trending topics, writes viral hooks & scripts, and finds stock videos automatically.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-500">
                  <Wand2 size={11} className="text-indigo-500" /> AI Scripts
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-500">
                  <Film size={11} className="text-indigo-500" /> Auto Assets
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-500">
                  <Zap size={11} className="text-amber-500" /> Trending Topics
                </span>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-2 text-indigo-600 font-black text-sm tracking-wide group-hover:gap-4 transition-all">
                <span>Start Creating</span>
                <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          {/* Custom Script */}
          <button
            onClick={() => handleSelect('custom-script')}
            onMouseEnter={() => setHoveredMode('custom-script')}
            onMouseLeave={() => setHoveredMode(null)}
            className="group relative bg-white rounded-[2rem] p-10 text-left transition-all duration-500 overflow-hidden border-2 border-slate-100 hover:border-violet-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(139,92,246,0.12)] hover:-translate-y-1"
          >
            {/* Hover glow */}
            <div className={`absolute inset-0 bg-gradient-to-br from-violet-50/80 to-rose-50/50 transition-opacity duration-500 ${hoveredMode === 'custom-script' ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`absolute -right-10 -bottom-10 transition-all duration-700 ${hoveredMode === 'custom-script' ? 'opacity-[0.06] rotate-12 scale-110' : 'opacity-[0.03] rotate-0 scale-100'}`}>
              <FileText size={180} strokeWidth={1} className="text-violet-600" />
            </div>
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center mb-8 shadow-lg shadow-violet-200/50 group-hover:shadow-violet-300/60 group-hover:scale-105 transition-all">
                <FileText size={24} className="text-white" />
              </div>
              
              {/* Title */}
              <h2 className="text-2xl font-black text-[#0f172a] mb-3 tracking-tight group-hover:text-violet-600 transition-colors">
                I Have My Script
              </h2>
              <p className="text-slate-500 font-medium text-[15px] leading-relaxed mb-8">
                Paste your script with timestamps — we&apos;ll find the perfect stock videos for each scene.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-500">
                  <Type size={11} className="text-violet-500" /> Your Script
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-500">
                  <Clock size={11} className="text-violet-500" /> Timestamps
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-500">
                  <Film size={11} className="text-violet-500" /> Stock Match
                </span>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-2 text-violet-600 font-black text-sm tracking-wide group-hover:gap-4 transition-all">
                <span>Upload Script</span>
                <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-slate-400 font-medium mt-10 tracking-wider">
          You can switch modes anytime from the sidebar
        </p>
      </div>
    </div>
  );
}
