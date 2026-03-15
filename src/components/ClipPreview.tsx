import React from 'react';
import { VideoAsset } from '@/types';
import { Download, ExternalLink, Play, Zap } from 'lucide-react';

interface ClipPreviewProps {
  asset: VideoAsset;
  onSelect?: (asset: VideoAsset) => void;
  isSelected?: boolean;
}

const ClipPreview: React.FC<ClipPreviewProps> = ({ asset, onSelect, isSelected }) => {
  return (
    <div 
      className={`relative group rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-white px-1 py-1 ${
        isSelected ? 'border-indigo-600 shadow-xl shadow-indigo-100 scale-[1.02]' : 'border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md'
      }`}
      onClick={() => onSelect?.(asset)}
    >
      <div className="aspect-[9/16] bg-slate-900 rounded-xl overflow-hidden relative group/internal">
        <video 
          src={asset.url} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover/internal:scale-105"
          poster={asset.thumbnail}
          onMouseOver={e => e.currentTarget.play()}
          onMouseOut={e => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
          muted
          loop
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 transition-opacity">
          <div className="absolute top-3 left-3 flex gap-2">
            <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-black text-slate-900 border border-white/20 uppercase tracking-tighter">
              {asset.source}
            </div>
            <div className="bg-indigo-600 px-2 py-1 rounded-lg text-[9px] font-black text-white shadow-lg uppercase tracking-tighter">
              {asset.duration.toFixed(1)}s
            </div>
          </div>
          
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center opacity-0 group-hover/internal:opacity-100 transition-all transform translate-y-2 group-hover/internal:translate-y-0">
             <div className="flex items-center gap-1 text-[10px] font-bold text-white bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">
              <Zap size={10} fill="currentColor" className="text-indigo-400" />
              {Math.round((asset.score ?? 0) * 100)}% Match
            </div>
            <a 
              href={asset.downloadUrl || asset.url} 
              target="_blank" 
              rel="noreferrer"
              className="p-2 bg-white text-indigo-600 rounded-xl hover:bg-slate-50 shadow-xl transition-all"
              onClick={e => e.stopPropagation()}
            >
              <Download size={14} />
            </a>
          </div>
        </div>
      </div>
      
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-indigo-600 p-2 rounded-full text-white shadow-xl shadow-indigo-200 border-4 border-white z-10 animate-in zoom-in-50 duration-300">
          <Check size={14} strokeWidth={4} />
        </div>
      )}
    </div>
  );
};

// Internal Check icon helper since Lucide Check wasn't imported initially but is used in my mental template
const Check = ({ size, strokeWidth, className }: { size: number, strokeWidth: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default ClipPreview;
