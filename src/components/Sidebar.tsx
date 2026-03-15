'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Zap, Layers, History, Settings, Search, HelpCircle, ChevronDown, Monitor, Sparkles } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, category: 'General' },
    { name: 'Generator', href: '/generator', icon: Zap, category: 'General' },
    { name: 'Batch', href: '/batch', icon: Layers, category: 'General' },
    { name: 'Library', href: '/history', icon: History, category: 'Tools' },
    { name: 'Analytics', href: '#', icon: Search, category: 'Tools', badge: 'BETA', disabled: true },
    { name: 'Settings', href: '/settings', icon: Settings, category: 'Support' },
    { name: 'Help', href: '#', icon: HelpCircle, category: 'Support', disabled: true },
  ];

  const categories = ['General', 'Tools', 'Support'];

  return (
    <aside className="sidebar flex flex-col bg-white overflow-y-auto border-r border-[#eaedf3] shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-black text-[#0f172a] tracking-tightest flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-indigo-200">
            <Sparkles size={18} fill="currentColor" />
          </div>
          Nexus
        </h1>
      </div>
      
      <div className="flex-1 px-2 space-y-6 mt-2 custom-scrollbar">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-6 mb-3 opacity-70">{cat}</p>
            <nav className="space-y-1">
              {navigation
                .filter((item) => item.category === cat)
                .map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  
                  if (item.disabled) {
                    return (
                      <div key={item.name} className="sidebar-item opacity-40 cursor-not-allowed grayscale">
                        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="ml-auto text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black uppercase">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link 
                      key={item.name} 
                      href={item.href} 
                      className={`sidebar-item group ${isActive ? 'active' : ''}`}
                    >
                      <Icon
                        size={18} 
                        strokeWidth={isActive ? 2.5 : 2} 
                        className={`transition-colors duration-300 ${isActive ? 'text-indigo-600' : 'group-hover:text-slate-900 text-slate-400'}`}
                      />
                      <span className="transition-all duration-300">{item.name}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.6)] animate-pulse" />
                      )}
                    </Link>
                  );
                })}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-4 mt-auto border-t border-slate-50">
        <div className="p-3 glass-card bg-slate-50/50 border-transparent hover:bg-slate-50/80 cursor-pointer transition-all duration-300 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-indigo-100 ring-2 ring-white">
            YA
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-black text-slate-900 truncate leading-tight">Young Alaska</p>
            <p className="text-[9px] text-indigo-600 font-bold uppercase tracking-tighter">Business Pro</p>
          </div>
          <ChevronDown size={14} className="text-slate-400 opacity-50" />
        </div>
        <button className="w-full mt-4 py-3 gradient-btn rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.98]">
          Upgrade to Vision
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
