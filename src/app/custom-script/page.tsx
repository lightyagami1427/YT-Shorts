'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import SceneCard from '@/components/SceneCard';
import { Scene } from '@/types';
import { ArrowLeft, Loader2, Film, FileText, Sparkles, Clock, ChevronRight, Search, Zap, Copy, Check } from 'lucide-react';
import Link from 'next/link';

const EXAMPLE_SCRIPT = `[0-3s] Did you know honey never expires? Archaeologists found 3,000-year-old jars in Egyptian tombs that were still perfectly edible.
[3-7s] The secret is in its chemistry — honey is naturally acidic and has almost no moisture, which means bacteria simply can't survive in it.
[7-12s] On top of that, bees add an enzyme called glucose oxidase, which produces small amounts of hydrogen peroxide — a natural antiseptic.
[12-17s] So whether it's 10 years old or 3,000 years old, as long as you keep it sealed, honey stays good forever.
[17-20s] Nature's perfect preservative, designed by tiny little engineers. Follow for more insane facts.`;

function parseScript(raw: string): Scene[] {
  const lines = raw.trim().split('\n').filter(l => l.trim());
  const scenes: Scene[] = [];

  for (const line of lines) {
    // Try to match patterns like [0-3s], [0s-3s], [0:00-0:03], etc.
    const match = line.match(/^\[?\s*(\d+:?\d*)\s*s?\s*[-–]\s*(\d+:?\d*)\s*s?\s*\]?\s*(.+)/i);
    if (match) {
      const start = parseTimeValue(match[1]);
      const end = parseTimeValue(match[2]);
      const text = match[3].trim();
      scenes.push({ start, end, text, assets: [] });
    } else {
      // If no timestamp found, treat as a scene with auto-incrementing time
      const lastEnd = scenes.length > 0 ? scenes[scenes.length - 1].end : 0;
      scenes.push({ start: lastEnd, end: lastEnd + 5, text: line.trim(), assets: [] });
    }
  }

  return scenes;
}

function parseTimeValue(val: string): number {
  if (val.includes(':')) {
    const parts = val.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return parseInt(val);
}

export default function CustomScriptPage() {
  const [rawScript, setRawScript] = useState('');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'input' | 'results'>('input');
  const [processingIndex, setProcessingIndex] = useState(-1);
  const [copied, setCopied] = useState(false);

  const handleProcess = async () => {
    if (!rawScript.trim()) return;
    
    const parsed = parseScript(rawScript);
    if (parsed.length === 0) return;
    
    setScenes(parsed);
    setIsProcessing(true);
    setStep('results');

    // Process each scene sequentially for stock videos
    for (let i = 0; i < parsed.length; i++) {
      setProcessingIndex(i);
      try {
        // Extract keywords from scene text
        const kwRes = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'keywords', sceneText: parsed[i].text })
        });
        const keywords = await kwRes.json();

        // Find stock videos
        const assetRes = await fetch('/api/assets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keywords })
        });
        const assets = await assetRes.json();

        // Update the scene with assets
        setScenes(prev => {
          const updated = [...prev];
          updated[i] = { ...updated[i], assets, keywords };
          return updated;
        });
      } catch (err) {
        console.error(`Error processing scene ${i}:`, err);
      }
    }

    setIsProcessing(false);
    setProcessingIndex(-1);
  };

  const refreshSceneAssets = async (index: number, text: string) => {
    try {
      const kwRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'keywords', sceneText: text })
      });
      const keywords = await kwRes.json();

      const assetRes = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords })
      });
      const assets = await assetRes.json();

      setScenes(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], assets, keywords };
        return updated;
      });
    } catch (err) {
      console.error('Error refreshing assets:', err);
    }
  };

  const handleCopyAll = () => {
    const content = scenes.map((s, i) => 
      `Scene ${i + 1} [${s.start}-${s.end}s]: ${s.text}\nAssets: ${s.assets?.map(a => a.url).join(', ') || 'None'}`
    ).join('\n\n');
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => {
    setRawScript(EXAMPLE_SCRIPT);
  };

  return (
    <div className="app-container bg-[#fcfdfe] min-h-screen text-slate-900">
      <Sidebar />
      <main className="main-content flex-1 flex flex-col max-w-[1400px] mx-auto px-12 py-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-slate-100 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Link href="/mode-selection" className="text-slate-400 hover:text-indigo-600 transition-colors">
                <ArrowLeft size={20} strokeWidth={2.5} />
              </Link>
              <span className="bg-violet-50 text-violet-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-violet-100 shadow-sm">
                Custom Script Mode
              </span>
            </div>
            <h2 className="text-5xl font-black text-[#0f172a] tracking-tightest leading-none mb-4">
              {step === 'input' ? 'Paste Your Script' : 'Stock Videos Matched'}
            </h2>
            <p className="text-slate-500 font-medium text-lg max-w-2xl">
              {step === 'input' 
                ? <>Add your script with timestamps like <code className="text-violet-600 bg-violet-50 px-2 py-0.5 rounded-lg text-sm font-bold">[0-5s]</code> and we&apos;ll find the perfect stock videos.</>
                : <>Your scenes have been analyzed. We found <span className="text-violet-600 font-bold">{scenes.filter(s => s.assets && s.assets.length > 0).length}</span> matching video sets.</>
              }
            </p>
          </div>

          {step === 'results' && (
            <div className="flex gap-3">
              <button 
                onClick={() => { setStep('input'); setScenes([]); }}
                className="flex items-center gap-2 bg-white text-slate-600 px-6 py-4 rounded-2xl font-black text-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
              >
                <ArrowLeft size={18} />
                Edit Script
              </button>
              <button 
                onClick={handleCopyAll}
                className="gradient-btn px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 active:scale-95"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copied!' : 'Copy All Assets'}
              </button>
            </div>
          )}
        </div>

        {/* Step: Input */}
        {step === 'input' && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
              
              {/* Script Editor */}
              <div className="xl:col-span-8">
                <div className="glass-card bg-white p-10 border border-slate-200">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100">
                        <FileText size={20} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-[#0f172a]">Script Editor</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paste with timestamps</p>
                      </div>
                    </div>
                    <button 
                      onClick={loadExample}
                      className="text-[11px] font-black uppercase tracking-widest text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-5 py-2.5 rounded-xl border border-violet-100 transition-all"
                    >
                      Load Example
                    </button>
                  </div>

                  <textarea
                    value={rawScript}
                    onChange={(e) => setRawScript(e.target.value)}
                    placeholder={`Paste your script here...\n\nFormat each line as:\n[0-3s] Your script text for this scene\n[3-7s] Next scene text here\n[7-12s] And so on...`}
                    className="w-full h-[400px] p-8 bg-slate-50 rounded-2xl border-2 border-slate-100 text-base font-medium leading-[2] resize-none focus:outline-none focus:border-violet-200 focus:ring-4 focus:ring-violet-50 transition-all placeholder:text-slate-300 font-mono"
                    spellCheck="false"
                  />

                  <div className="flex justify-between items-center mt-6">
                    <p className="text-xs font-bold text-slate-400">
                      {rawScript.trim() ? `${rawScript.trim().split('\n').filter(l => l.trim()).length} scenes detected` : 'No script entered yet'}
                    </p>
                    <button
                      onClick={handleProcess}
                      disabled={!rawScript.trim()}
                      className={`gradient-btn px-10 py-5 rounded-2xl font-black text-sm flex items-center gap-3 active:scale-95 ${!rawScript.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <Search size={18} />
                      Find Stock Videos
                      <ChevronRight size={18} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tips Sidebar */}
              <div className="xl:col-span-4 flex flex-col gap-6">
                <div className="rounded-[2rem] bg-gradient-to-br from-violet-600 to-purple-700 p-10 text-white relative overflow-hidden shadow-2xl shadow-violet-100">
                  <div className="absolute -right-6 -bottom-6 opacity-10">
                    <Clock size={160} strokeWidth={1} />
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-lg font-black mb-6">Timestamp Format</h4>
                    <div className="space-y-4">
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                        <code className="text-sm font-bold text-white/90">[0-3s] Scene text here</code>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                        <code className="text-sm font-bold text-white/90">[3-7s] Next scene...</code>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                        <code className="text-sm font-bold text-white/90">[7-12s] And so on...</code>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-white/50 mt-6 leading-relaxed">
                      Each line = one scene. We&apos;ll find stock videos that match each scene&apos;s content.
                    </p>
                  </div>
                </div>

                <div className="glass-card bg-white p-8 border border-slate-200 flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                    <Zap size={22} fill="currentColor" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-[#0f172a] mb-1">Pro Tip</h4>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed">
                      Keep each scene 3-5 seconds for maximum retention. Be specific and visual in your descriptions for better stock matches.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Step: Results */}
        {step === 'results' && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col gap-8">
              {scenes.map((scene, i) => (
                <div key={i} className="relative">
                  {/* Processing overlay */}
                  {isProcessing && processingIndex === i && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center z-20 border-2 border-violet-100">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <Loader2 className="animate-spin text-violet-600" size={40} />
                          <Film className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-400" size={16} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-violet-600">
                          Finding videos for Scene {i + 1}...
                        </span>
                      </div>
                    </div>
                  )}
                  {isProcessing && processingIndex < i && (
                    <div className="absolute inset-0 bg-slate-50/60 backdrop-blur-[1px] rounded-3xl flex items-center justify-center z-20">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                        Queued...
                      </span>
                    </div>
                  )}
                  <SceneCard
                    index={i}
                    scene={scene}
                    isLoading={isProcessing && processingIndex === i}
                    onRefreshAssets={() => refreshSceneAssets(i, scene.text)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
