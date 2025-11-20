import React from 'react';
import { Sparkles, Command, Download, ChevronRight } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-[1920px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Section - Minimal & Architectural */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg shadow-slate-200 ring-1 ring-slate-900/5">
              <div className="w-3 h-3 bg-white rounded-[1px] transform rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>
            </div>
            <div className="flex flex-col justify-center h-full">
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                ScriptViz
              </h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Studio</span>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

          {/* Current Context Indicator (Optional) */}
          <div className="hidden sm:flex items-center text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            <span>Untitled Project</span>
            <ChevronRight className="w-3 h-3 mx-1 text-slate-400" />
            <span className="text-slate-900">Draft</span>
          </div>
        </div>

        {/* Right Actions - Clean & Functional */}
        <div className="flex items-center gap-3">
          {/* AI Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Gemini 2.5</span>
          </div>

          <div className="w-px h-4 bg-slate-200 hidden md:block"></div>
          
          {/* Primary Action */}
          <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-slate-900/20 active:transform active:scale-95">
            <span>Export</span>
            <Download className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;