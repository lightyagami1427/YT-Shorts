'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { TrendingTopic, TrendCategory } from '@/types';
import { ArrowRight, RefreshCw, TrendingUp, Zap, Search, Bell, HelpCircle, ChevronRight, Filter, Download, Monitor, Activity, Sparkles, LayoutGrid, Brain, Music, Gamepad2, FlaskConical, Tv, Flame } from 'lucide-react';
import Link from 'next/link';
import KpiCard from '@/components/KpiCard';

const CATEGORIES: { key: string; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'all', label: 'All Trends', icon: <Flame size={16} strokeWidth={2.5} />, color: 'from-slate-600 to-slate-800' },
  { key: 'technology', label: 'Technology', icon: <Monitor size={16} strokeWidth={2.5} />, color: 'from-blue-500 to-cyan-500' },
  { key: 'music', label: 'Music', icon: <Music size={16} strokeWidth={2.5} />, color: 'from-rose-500 to-pink-500' },
  { key: 'entertainment', label: 'Entertainment', icon: <Tv size={16} strokeWidth={2.5} />, color: 'from-amber-500 to-orange-500' },
  { key: 'viral-facts', label: '🤯 Viral Facts', icon: <Brain size={16} strokeWidth={2.5} />, color: 'from-violet-500 to-purple-500' },
  { key: 'gaming', label: 'Gaming', icon: <Gamepad2 size={16} strokeWidth={2.5} />, color: 'from-emerald-500 to-teal-500' },
  { key: 'science', label: 'Science', icon: <FlaskConical size={16} strokeWidth={2.5} />, color: 'from-indigo-500 to-blue-500' },
];

export default function Dashboard() {
  const [trends, setTrends] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d'>('7d');
  const [activeCategory, setActiveCategory] = useState('all');

  const fetchTrends = (forceRefresh = false) => {
    setLoading(true);
    const url = `/api/trends?time=${timeFilter}&category=${activeCategory}${forceRefresh ? `&refresh=${Date.now()}` : ''}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setTrends(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTrends();
  }, [timeFilter, activeCategory]);

  const kpiData = {
    '24h': {
      throughput: '1,245', throughputTrend: 5.2, throughputPos: true,
      retention: '342.1s', retentionTrend: 1.2, retentionPos: false,
      velocity: '82.1%', velocityTrend: 8.4, velocityPos: true,
    },
    '7d': {
      throughput: '12,450', throughputTrend: 15.8, throughputPos: true,
      retention: '363.9s', retentionTrend: 34.0, retentionPos: false,
      velocity: '86.5%', velocityTrend: 24.2, velocityPos: true,
    },
    '30d': {
      throughput: '48,290', throughputTrend: 12.4, throughputPos: true,
      retention: '391.2s', retentionTrend: 8.7, retentionPos: true,
      velocity: '88.2%', velocityTrend: 14.1, velocityPos: true,
    }
  };
  const currentKpi = kpiData[timeFilter];

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      window.location.href = `/generator?topic=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'technology': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'music': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'entertainment': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'viral-facts': return 'bg-violet-50 text-violet-600 border-violet-100';
      case 'gaming': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'science': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getSourceColor = (source: string) => {
    if (source === 'Reddit') return 'bg-orange-50 text-orange-600 border-orange-100';
    if (source === 'Google') return 'bg-blue-50 text-blue-600 border-blue-100';
    if (source === 'YouTube') return 'bg-red-50 text-red-600 border-red-100';
    if (source === 'NASA' || source === 'Space.com') return 'bg-sky-50 text-sky-600 border-sky-100';
    if (source === 'Spotify' || source === 'SoundCloud') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };

  return (
    <div className="app-container bg-[#fcfdfe] min-h-screen">
      <Sidebar />
      <main className="main-content flex flex-col gap-12 px-12 py-16 max-w-[1600px] mx-auto">
        
        {/* Top Header */}
        <header className="flex justify-between items-center bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] sticky top-6 z-50">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="System Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-[450px] pl-14 pr-6 py-4 bg-slate-50/50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 transition-all placeholder:text-slate-500"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex gap-1 items-center opacity-30 group-focus-within:opacity-0 transition-opacity">
              <kbd className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black">⌘</kbd>
              <kbd className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black">K</kbd>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-6 text-slate-500">
               <div className="relative cursor-pointer hover:text-indigo-600 transition-all">
                  <Bell size={22} strokeWidth={2.5} />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm" />
               </div>
               <HelpCircle size={22} strokeWidth={2.5} className="cursor-pointer hover:text-indigo-600 transition-all" />
            </div>
            <div className="h-8 w-[1px] bg-slate-100" />
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right">
                <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">Young Alaska</p>
                <div className="flex items-center gap-1.5 justify-end">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Online</p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white shadow-xl shadow-indigo-100 ring-1 ring-slate-100" />
            </div>
          </div>
        </header>

        {/* Global Stats Section */}
        <section className="animate-in fade-in duration-700">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <Activity size={16} className="text-indigo-600" />
                 <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em]">Real-time Metrics</span>
              </div>
              <h2 className="text-5xl font-black text-[#0f172a] tracking-tightest">Control Center</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm">
                <button 
                  onClick={() => setTimeFilter('24h')}
                  className={`px-5 py-2.5 text-xs font-black transition-all rounded-xl ${timeFilter === '24h' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-indigo-600'}`}
                >
                  24h
                </button>
                <button 
                  onClick={() => setTimeFilter('7d')}
                  className={`px-5 py-2.5 text-xs font-black transition-all rounded-xl ${timeFilter === '7d' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-indigo-600'}`}
                >
                  7d
                </button>
                <button 
                  onClick={() => setTimeFilter('30d')}
                  className={`px-5 py-2.5 text-xs font-black transition-all rounded-xl ${timeFilter === '30d' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-indigo-600'}`}
                >
                  30d
                </button>
              </div>
              <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all shadow-sm">
                 <Filter size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KpiCard title="Studio Throughput" value={currentKpi.throughput} trend={currentKpi.throughputTrend} isPositive={currentKpi.throughputPos} />
            <KpiCard title="Retention Baseline" value={currentKpi.retention} trend={currentKpi.retentionTrend} isPositive={currentKpi.retentionPos} />
            <KpiCard title="Viral Velocity" value={currentKpi.velocity} trend={currentKpi.velocityTrend} isPositive={currentKpi.velocityPos} />
          </div>
        </section>

        {/* Category Pills */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 border-2 ${
                  activeCategory === cat.key
                    ? `bg-gradient-to-r ${cat.color} text-white border-transparent shadow-lg`
                    : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200 hover:text-slate-700 shadow-sm'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Intelligence Grid */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="xl:col-span-8 flex flex-col gap-8">
            <div className="glass-card bg-white p-12 border-transparent">
              <div className="flex justify-between items-center mb-12 border-b border-slate-50 pb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                    <TrendingUp size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#0f172a] tracking-tight">Trending Intelligence</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                      {activeCategory === 'all' ? 'Cross-platform US Analysis' : `${CATEGORIES.find(c => c.key === activeCategory)?.label} · US Analysis`}
                    </p>
                  </div>
                </div>
                <button onClick={() => fetchTrends(true)} className="p-4 hover:bg-slate-50 rounded-2xl text-slate-400 transition-all border border-slate-50 hover:border-slate-100">
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {loading ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-24 w-full animate-shimmer bg-slate-50 rounded-3xl" />
                  ))
                ) : trends.length === 0 ? (
                  <div className="py-20 flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-300">
                      <TrendingUp size={32} />
                    </div>
                    <p className="text-lg font-black text-slate-400">No trends found for this category</p>
                    <p className="text-sm text-slate-400">Try a different category or time range.</p>
                  </div>
                ) : (
                  trends.map((topic, i) => (
                    <div key={i} className="flex items-center justify-between p-8 rounded-[2rem] hover:bg-slate-50 transition-all group border-2 border-transparent hover:border-indigo-50/50 cursor-pointer relative overflow-hidden">
                      <div className="flex items-center gap-8 relative z-10">
                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center font-black text-xl shadow-sm border-2 ${getSourceColor(topic.source)}`}>
                          {topic.source[0]}
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-[#0f172a] mb-1 group-hover:text-indigo-600 transition-colors">{topic.title}</h4>
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{topic.source} Intelligence</span>
                             <div className="w-1 h-1 rounded-full bg-slate-200" />
                             {topic.category && (
                               <>
                                 <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${getCategoryColor(topic.category)}`}>
                                   {topic.category === 'viral-facts' ? '🤯 Facts' : topic.category}
                                 </span>
                                 <div className="w-1 h-1 rounded-full bg-slate-200" />
                               </>
                             )}
                             <div className="flex items-center gap-1.5">
                                <Zap size={12} className="text-amber-400 fill-amber-400" />
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{topic.hotness}% Velocity</span>
                             </div>
                          </div>
                        </div>
                      </div>
                      
                      <Link 
                        href={`/generator?topic=${encodeURIComponent(topic.title)}`}
                        className="flex items-center gap-4 bg-white border border-slate-100 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 group-hover:shadow-indigo-100 transition-all relative z-10 active:scale-95"
                      >
                        Launch Studio
                        <ChevronRight size={18} strokeWidth={3} />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 flex flex-col gap-10">
            <div className="rounded-[2rem] bg-[#4f46e5] p-12 text-white relative overflow-hidden group shadow-2xl shadow-indigo-100">
               <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                  <Monitor size={240} strokeWidth={1} />
               </div>
               <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20">
                      <LayoutGrid size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80">Connected Systems</span>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="flex items-center gap-6">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-3">
                           <p className="text-sm font-black uppercase tracking-widest">OpenRouter L4</p>
                           <span className="text-[10px] font-black opacity-60 italic">Online</span>
                        </div>
                        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)]" style={{ width: '85%' }} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-3">
                           <p className="text-sm font-black uppercase tracking-widest">Pexels Visuals</p>
                           <span className="text-[10px] font-black opacity-60 italic">Ready</span>
                        </div>
                        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)]" style={{ width: '60%' }} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 divide-y divide-white/10">
                       <div className="py-6 flex justify-between items-center">
                          <div>
                             <p className="text-2xl font-black">8.4 GB</p>
                             <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Studio Storage</p>
                          </div>
                          <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                             <span className="text-[10px] font-black uppercase">84% Full</span>
                          </div>
                       </div>
                       <div className="pt-6">
                          <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-700/40 hover:scale-[1.02] active:scale-[0.98] transition-all">
                             Expand Ecosystem
                          </button>
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            <div className="glass-card bg-white p-10 border-transparent relative overflow-hidden flex flex-col items-center text-center justify-center gap-6 group cursor-pointer hover:bg-slate-50 transition-colors">
               <div className="w-16 h-16 rounded-[2rem] bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Sparkles size={28} strokeWidth={2.5} fill="currentColor" />
               </div>
               <div>
                  <h4 className="text-xl font-black text-[#0f172a] mb-2">Automate with AI</h4>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-loose">Launch 10 unique scripts<br/>In less than 60 seconds</p>
               </div>
               <button className="mt-4 px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-200 hover:shadow-indigo-100 transition-all">
                  Initialize Batch
               </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
