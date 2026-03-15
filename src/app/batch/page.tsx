'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useGenerator } from '@/hooks/useGenerator';
import { Check, Download, Layers, Loader2, Play, Sparkles } from 'lucide-react';
import SceneCard from '@/components/SceneCard';
import { VideoPackage } from '@/types';

export default function BatchPage() {
  const [topics, setTopics] = useState<string>('');
  const [isBatching, setIsBatching] = useState(false);
  const [completedVideos, setCompletedVideos] = useState<VideoPackage[]>([]);
  
  const { generateFullPackage, findAssetsForScene, isGenerating } = useGenerator();

  const runBatch = async () => {
    const topicList = topics.split('\n').filter(t => t.trim());
    setIsBatching(true);
    
    for (const t of topicList) {
      // 1. Fetch hooks (simplified for batch)
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ type: 'hooks', topic: t })
      });
      const hooks = await res.json();
      const bestHook = hooks[0];

      // 2. Generate Package
      const pkg = await generateFullPackage(bestHook);
      if (pkg) {
        // 3. Auto-find assets for first scene as a preview
        await findAssetsForScene(0, pkg.script[0].text);
        setCompletedVideos(prev => [pkg, ...prev]);
      }
    }
    
    setIsBatching(false);
  };

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-10 max-w-6xl mx-auto">
        <header className="mb-10">
          <h2 className="text-4xl font-bold mb-2">Batch Generator</h2>
          <p className="text-gray-400">Generate up to 10 video packages in one click.</p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="glass-card p-6">
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-widest">
                Insert Topics (One per line)
              </label>
              <textarea 
                value={topics}
                onChange={e => setTopics(e.target.value)}
                placeholder="AI robots&#10;NASA space discovery&#10;Deep ocean mysteries..."
                className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
              />
              <button 
                onClick={runBatch}
                disabled={isBatching || !topics.trim()}
                className="w-full mt-6 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all"
              >
                {isBatching ? <Loader2 className="animate-spin" /> : <Layers size={20} />}
                {isBatching ? 'Generating Batch...' : 'Start Batch Generation'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Check className="text-green-400" />
              Completed Packages ({completedVideos.length})
            </h3>
            
            <div className="space-y-4 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {completedVideos.map((video, i) => (
                <div key={i} className="glass-card p-4 flex items-center justify-between animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium line-clamp-1">{video.topic}</h4>
                      <p className="text-xs text-gray-500">{video.hook.substring(0, 40)}...</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white">
                    <Download size={20} />
                  </button>
                </div>
              ))}
              
              {!isBatching && completedVideos.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-white/5 rounded-2xl">
                  <Play size={40} className="mb-4 opacity-10" />
                  <p>Ready to generate content at scale.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
