'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import { useGenerator } from '@/hooks/useGenerator';
import { Check, Copy, Loader2, Sparkles, Wand2, Zap, RefreshCw, ChevronRight, Monitor, Download, ArrowLeft, Layers, Film, Search } from 'lucide-react';
import SceneCard from '@/components/SceneCard';

import { Suspense } from 'react';

function GeneratorContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get('topic') || '';
  
  const { 
    topic, setTopic, 
    hooks, fetchHooks, 
    selectedHook, setSelectedHook,
    pkg, generateFullPackage,
    findAssetsForScene,
    isGenerating 
  } = useGenerator();

  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);

  useEffect(() => {
    if (initialTopic && !hooks.length && !isGenerating) {
      setTopic({ title: initialTopic, source: 'External' });
      fetchHooks(initialTopic);
    }
  }, [initialTopic, hooks.length, isGenerating, fetchHooks, setTopic]);

  const handleHookPick = async (hook: string) => {
    setSelectedHook(hook);
    setInternalLoading(true);
    await generateFullPackage(hook);
    setStep(2);
    setInternalLoading(false);
  };

  const handleCopyEverything = () => {
    if (!pkg) return;
    const content = `
TOPIC: ${pkg.topic}
HOOK: ${pkg.hook}

SCRIPT:
${pkg.script.map(s => s.text).join('\n')}

METADATA:
Titles: ${pkg.titles.join(' | ')}
Desc: ${pkg.description}
Tags: ${pkg.hashtags.join(' ')}
Viral Strategy: ${pkg.viralStrategy || 'N/A'}

ASSETS:
${pkg.script.map((s, i) => `Scene ${i+1}: ${s.assets?.[0]?.url || 'N/A'}`).join('\n')}
    `.trim();
    
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app-container bg-[#fcfdfe] min-h-screen text-slate-900">
      <Sidebar />
      <main className="main-content flex-1 flex flex-col max-w-6xl mx-auto px-8 py-10">
        
        {/* Extraordinary Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-4xl mx-auto px-4 relative">
            <div className="absolute top-[1.375rem] left-8 right-8 h-[2px] bg-slate-100 -z-10" />
            <div 
              className="absolute top-[1.375rem] left-8 h-[2px] bg-indigo-600 -z-10 transition-all duration-700 cubic-bezier(0.65, 0, 0.35, 1)" 
              style={{ width: `${(step - 1) * 50}%` }} 
            />
            
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-col items-center gap-4 bg-[#fcfdfe] px-6">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all duration-500 border-2 ${
                  step >= s 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-110' 
                    : 'bg-white border-slate-200 text-slate-300'
                }`}>
                  {step > s ? <Check size={18} strokeWidth={3} /> : s}
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${step >= s ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {s === 1 ? 'Viral Hook' : s === 2 ? 'Studio' : 'Export'}
                  </span>
                  {step === s && (
                    <div className="h-1 w-4 bg-indigo-600 rounded-full animate-bounce" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b border-slate-100 pb-8">
          <div>
             <div className="flex items-center gap-3 mb-3">
              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm">
                Pro Engine v2.0
              </span>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Sparkles size={14} className="text-amber-400" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">AI Enhanced</span>
              </div>
            </div>
            <h2 className="text-4xl font-black text-[#0f172a] tracking-tightest leading-none mb-4">
              {step === 1 ? 'High-Performance Hooks' : step === 2 ? 'Production Studio' : 'Global Distribution'}
            </h2>
            <p className="text-slate-500 font-medium text-base max-w-2xl">
              {step === 1 ? (
                <>Select a hook that <span className="text-indigo-600 font-bold underline decoration-indigo-200 underline-offset-4 decoration-4">forces stop-scrolling</span> behavior.</>
              ) : step === 2 ? (
                <>Direct each scene with <span className="text-indigo-600 font-bold">pixel-perfect</span> stock assets and viral formatting.</>
              ) : (
                <>Your viral package is ready. All metadata is <span className="text-indigo-600 font-bold">SEO-optimized</span> for US trends.</>
              )}
            </p>
          </div>
          
          <div className="flex gap-4">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 bg-white text-slate-600 px-6 py-4 rounded-2xl font-black text-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
              >
                <ArrowLeft size={18} />
                Back
              </button>
            )}
            {step === 2 && (
              <button 
                onClick={() => setStep(3)}
                className="gradient-btn px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 active:scale-95"
              >
                Proceed to Export
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Step 1: Extraordinary Hook Selection */}
        {step === 1 && (
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {hooks.length > 0 ? (
                hooks.map((hook, i) => (
                  <div 
                    key={i}
                    onClick={() => handleHookPick(hook)}
                    className={`glass-card p-8 cursor-pointer relative group flex flex-col justify-between border-2 ${
                      selectedHook === hook ? 'border-indigo-600 ring-4 ring-indigo-50/50 bg-white' : 'border-transparent'
                    } ${internalLoading && selectedHook === hook ? 'opacity-80 pointer-events-none' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em]">Framework 0{i+1}</span>
                        <div className="h-0.5 w-8 bg-indigo-100 group-hover:w-full transition-all duration-500" />
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-[10px] font-bold text-slate-400 uppercase">Retention Potential:</span>
                         <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(star => <div key={star} className="w-1 h-3 rounded-full bg-emerald-400" />)}
                         </div>
                      </div>
                    </div>
                    <p className="text-xl lg:text-2xl font-black text-slate-800 leading-[1.3] group-hover:text-indigo-600 transition-colors">
                      {hook}
                    </p>
                    
                    {internalLoading && selectedHook === hook && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
                        <Loader2 className="animate-spin text-indigo-600" size={32} />
                        <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Assembling Script...</span>
                      </div>
                    )}

                    <div className="mt-8 flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                      <span>Select This Hook</span>
                      <ChevronRight size={14} className="text-indigo-500" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-24 glass-card bg-white flex flex-col items-center justify-center text-slate-300 border-dashed border-2 border-slate-100">
                  {isGenerating ? (
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative">
                        <Loader2 className="animate-spin text-indigo-600" size={64} strokeWidth={3} />
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-400" size={24} />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-lg font-black text-slate-900">Engineering Viral Openers...</p>
                        <p className="text-sm font-bold opacity-60">Consulting YouTube retention algorithms</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-8 w-full max-w-xl px-12">
                      <div className="w-16 h-16 rounded-[2rem] bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                        <Wand2 size={32} strokeWidth={2.5} />
                      </div>
                      <div className="text-center">
                        <h3 className="text-xl font-black text-slate-900 mb-2">Initialize Production</h3>
                        <p className="text-sm font-medium text-slate-400">Enter a topic to generate masterclass hooks</p>
                      </div>
                      <div className="w-full relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input 
                          type="text" 
                          placeholder="e.g. Psychology of Wealth or AI Robots"
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-3xl text-base font-black focus:outline-none focus:bg-white focus:border-indigo-100 focus:ring-8 focus:ring-indigo-50/50 transition-all placeholder:text-slate-200"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const val = (e.target as HTMLInputElement).value;
                              if (val.trim()) {
                                setTopic({ title: val.trim(), source: 'Manual' });
                                fetchHooks(val.trim());
                              }
                            }
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-3 opacity-40">
                        <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-black">ENTER</kbd>
                        <span className="text-[10px] font-black uppercase tracking-widest">To Initialize</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Step 2: Extraordinary Studio View */}
        {step === 2 && pkg && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
              <div className="xl:col-span-4 space-y-8">
                <div className="glass-card bg-indigo-600 p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap size={80} fill="currentColor" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 block mb-4">Master Hook</span>
                  <p className="text-xl lg:text-2xl font-black leading-tight relative z-10 italic">"{pkg.hook}"</p>
                </div>
                
                <div className="glass-card bg-white p-6 border border-slate-100 divide-y divide-slate-50">
                  <div className="pb-6">
                     <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Current Topic</h5>
                     <p className="text-base font-black text-slate-900 leading-tight">#{pkg.topic}</p>
                  </div>
                   <div className="py-6">
                     <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Layers size={14} className="text-indigo-600" />
                        Composition
                     </h5>
                     <p className="text-sm font-bold text-slate-600">5 Dynamic Storyboard Scenes</p>
                     <p className="text-sm font-bold text-slate-600">{pkg.script.length} Premium Asset Slugs</p>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-8 flex flex-col gap-8">
                {pkg.script.map((scene, i) => (
                  <SceneCard 
                    key={i}
                    index={i}
                    scene={scene}
                    isLoading={isGenerating}
                    onRefreshAssets={() => findAssetsForScene(i, scene.text)}
                  />
                ))}

                {/* Additional Details: Script without timestamps & Viral elements */}
                <div className="glass-card bg-white p-8 border border-slate-200 mt-4 space-y-10">
                  <div>
                    <h4 className="text-[12px] uppercase tracking-[0.3em] text-indigo-600 font-extrabold mb-6 flex items-center gap-3">
                       <Film size={18} />
                       Point-Wise Script Content
                    </h4>
                    <ul className="space-y-4 list-disc pl-6 text-slate-800 text-lg font-medium leading-[1.6]">
                      {pkg.script.map((scene, i) => (
                        <li key={i}>{scene.text}</li>
                      ))}
                    </ul>
                  </div>

                  {pkg.viralStrategy && (
                    <div className="pt-6 border-t border-slate-100">
                      <h4 className="text-[12px] uppercase tracking-[0.3em] text-indigo-600 font-extrabold mb-6 flex items-center gap-3">
                         <Zap size={18} />
                         Viral Strategy & Growth Elements
                      </h4>
                      <div className="bg-indigo-50/70 p-6 rounded-2xl border border-indigo-100">
                        <p className="text-slate-800 font-bold leading-[1.7] whitespace-pre-line text-base">{pkg.viralStrategy}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-slate-100">
                     <h4 className="text-[12px] uppercase tracking-[0.3em] text-indigo-600 font-extrabold mb-6 flex items-center gap-3">
                        <Check size={18} />
                        Trending Hashtags
                     </h4>
                     <div className="flex flex-wrap gap-3">
                      {pkg.hashtags.map((tag, i) => (
                        <span key={i} className="text-sm font-black text-slate-700 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-200 transition-colors cursor-default">
                          {tag}
                        </span>
                      ))}
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Step 3: Extraordinary Export View */}
        {step === 3 && pkg && (
          <section className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            <div className="glass-card bg-[#0f172a] p-10 text-center text-white relative overflow-hidden rounded-3xl group">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 via-transparent to-transparent group-hover:opacity-60 transition-opacity" />
               <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 mb-2">
                    <Check className="text-emerald-400" size={18} strokeWidth={4} />
                    <span className="text-[11px] font-black uppercase tracking-widest">Production Complete</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-black tracking-tightest leading-none">Your Video Package<br/>Is Ready for Launch</h2>
                  <p className="text-lg font-medium text-slate-400 max-w-2xl mx-auto leading-relaxed">Everything below is cross-referenced with US trending algorithms. High SEO resonance guaranteed.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="glass-card bg-white p-8 border border-slate-200">
                <div className="flex justify-between items-center mb-10">
                  <h4 className="text-[12px] uppercase tracking-[0.3em] text-indigo-600 font-extrabold flex items-center gap-3">
                    <Monitor size={20} className="text-slate-900" />
                    SEO Viral Titles
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Best Performers</span>
                </div>
                <div className="space-y-4">
                  {pkg.titles.map((t, i) => (
                    <div key={i} className="flex gap-6 p-6 bg-slate-50 rounded-[1.5rem] group hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 cursor-copy">
                      <span className="font-black text-2xl text-slate-200 group-hover:text-indigo-200 transition-colors">0{i+1}</span>
                      <p className="font-extrabold text-[#0f172a] text-lg leading-tight">{t}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-10">
                <div className="glass-card bg-white p-8 border border-slate-200">
                  <h4 className="text-[12px] uppercase tracking-[0.3em] text-indigo-600 font-extrabold mb-8">Description Algorithm</h4>
                  <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 relative group">
                    <p className="text-slate-800 font-bold leading-[1.8] text-base italic">"{pkg.description}"</p>
                    <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-100 transition-opacity">
                      <Copy size={24} className="text-indigo-600" />
                    </div>
                  </div>
                </div>

                <div className="glass-card bg-white p-8 border border-slate-200">
                  <h4 className="text-[12px] uppercase tracking-[0.3em] text-indigo-600 font-extrabold mb-8">Hashtag Cloud</h4>
                  <div className="flex flex-wrap gap-3">
                    {pkg.hashtags.map((tag, i) => (
                      <span key={i} className="text-sm font-black text-indigo-600 bg-indigo-50 border-2 border-indigo-100/50 px-6 py-3 rounded-2xl shadow-sm hover:shadow-indigo-100 transition-all hover:-translate-y-1 cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-12">
              <button 
                onClick={handleCopyEverything}
                className="gradient-btn px-10 py-5 rounded-[1.5rem] font-black text-xl flex items-center gap-8 shadow-2xl shadow-indigo-300 transition-all active:scale-[0.98] group"
              >
                <div className="bg-white/20 p-4 rounded-2xl group-hover:rotate-12 transition-transform">
                  {copied ? <Check size={24} strokeWidth={4} /> : <Copy size={24} strokeWidth={3} />}
                </div>
                {copied ? 'All Data Copied!' : 'Copy Full Studio Package'}
              </button>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <Suspense fallback={
      <div className="app-container bg-[#fcfdfe] min-h-screen flex items-center justify-center">
        <Sidebar />
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="animate-spin text-indigo-600" size={64} strokeWidth={3} />
          <p className="text-lg font-black text-slate-900 uppercase tracking-widest">Initializing Studio...</p>
        </div>
      </div>
    }>
      <GeneratorContent />
    </Suspense>
  );
}
