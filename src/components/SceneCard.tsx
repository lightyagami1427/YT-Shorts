import React, { useState } from 'react';
import { Scene, VideoAsset } from '@/types';
import ClipPreview from './ClipPreview';
import { RefreshCw, Monitor, Download, Film, MoreHorizontal, Video, Clock, ChevronRight, ExternalLink, Copy } from 'lucide-react';

interface SceneCardProps {
  scene: Scene;
  index: number;
  onRefreshAssets: () => void;
  isLoading: boolean;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene, index, onRefreshAssets, isLoading }) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(
    scene.assets?.[0]?.id || null
  );

  return (
    <div className="glass-card bg-white overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-white">
        <div>
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1 block">Scene 0{index + 1}</span>
          <h4 className="text-xl font-black text-slate-900 leading-tight">
            {scene.end - scene.start}s <span className="text-slate-400 font-medium text-sm">Sequence</span>
          </h4>
        </div>
        <button 
          onClick={onRefreshAssets}
          disabled={isLoading}
          className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-indigo-600"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>
      
      <div className="p-6 bg-slate-50/50 border-b border-slate-50">
        <p className="text-slate-700 font-medium leading-relaxed italic border-l-4 border-indigo-200 pl-4 text-sm">
          "{scene.text}"
        </p>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Monitor size={14} className="text-indigo-600" />
            Stock Asset Matches
          </h5>
          {scene.keywords && (
            <div className="flex gap-1 overflow-hidden">
               {((Array.isArray(scene.keywords) 
                 ? scene.keywords 
                 : (typeof scene.keywords === 'string' ? scene.keywords.split(',') : [])
                ) as string[]).slice(0, 2).map((kw, i) => (
                <span key={i} className="text-[9px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100 uppercase truncate max-w-[80px]">
                  {String(kw).trim()}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Assets Grid */}
        <div className="p-5 bg-slate-50/50">
          <div className="grid grid-cols-3 gap-3">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="aspect-[9/16] bg-slate-100 animate-shimmer rounded-xl" />
              ))
            ) : scene.assets && scene.assets.length > 0 ? (
              scene.assets.map((asset, i) => (
                <div key={i} className="group/asset relative">
                  <div className="aspect-[9/16] bg-[#0f172a] rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group">
                    <video 
                      src={asset.url} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      muted 
                      loop 
                      onMouseOver={(e) => e.currentTarget.play()}
                      onMouseOut={(e) => e.currentTarget.pause()}
                    />
                    
                    {/* URL-First Controls */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      <button 
                        onClick={() => window.open(asset.downloadUrl || '', '_blank')}
                        className="w-full py-2 bg-white text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center gap-1"
                      >
                        <ExternalLink size={10} />
                        Source
                      </button>
                      <button 
                        onClick={() => {
                          if (asset.downloadUrl) navigator.clipboard.writeText(asset.downloadUrl);
                        }}
                        className="w-full py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <Copy size={10} />
                        URL
                      </button>
                    </div>

                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
                      {asset.duration}s
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 py-12 flex flex-col items-center justify-center gap-3 text-slate-300">
                 <Film size={32} strokeWidth={1.5} className="opacity-20" />
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-40">No Visual Intelligence Matches</p>
                 <button 
                   onClick={onRefreshAssets}
                   className="flex items-center gap-2 text-[9px] font-black text-indigo-600 bg-white px-4 py-2 rounded-lg border border-indigo-100 hover:bg-indigo-50 transition-all shadow-sm active:scale-95"
                 >
                   <RefreshCw size={10} strokeWidth={3} />
                   RE-INITIALIZE MATCHING
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneCard;
