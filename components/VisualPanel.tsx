import React, { useRef, useEffect, useState } from 'react';
import { Layers, Sparkles, FileDown, Loader2, RefreshCcw, MonitorPlay } from 'lucide-react';
import { AnalysisResult } from '../types';
import { ChartRenderer } from './visuals/ChartRenderer';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface VisualPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

const VisualPanel: React.FC<VisualPanelProps> = ({ result, isAnalyzing }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (result && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [result]);

  const handleExportPDF = async () => {
    if (!contentRef.current || !result) return;
    
    setIsExporting(true);
    try {
      const element = contentRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#f8fafc',
        useCORS: true,
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'l' : 'p',
        unit: 'px',
        format: [imgWidth, imgHeight]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${result.title.replace(/[^a-zA-Z0-9]/g, '_')}_VisualBoard.pdf`);

    } catch (error) {
      console.error("PDF Export failed", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50/50 p-8 relative overflow-hidden">
        {/* 3D Background Effects */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[60px] animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-[60px] animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-20 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-[60px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-28 h-28 mb-8">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
            <div className="absolute inset-0 bg-white rounded-full shadow-2xl flex items-center justify-center ring-4 ring-indigo-50">
                <RefreshCcw className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
            </div>
            <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Generating Assets...</h3>
            <p className="text-slate-500 text-center max-w-md leading-relaxed font-medium">
              Constructing 3D visualization layers and applying vivid color treatments to your script data.
            </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         
        <div className="text-center max-w-lg px-8 py-12 relative z-10">
          <div className="w-28 h-28 bg-white rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(79,70,229,0.3)] flex items-center justify-center mx-auto mb-8 transform -rotate-6 hover:rotate-0 transition-transform duration-500 group border border-white/60 backdrop-blur-sm">
            <Layers className="w-12 h-12 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">ScriptViz AI</h3>
          <p className="text-xl text-slate-500 leading-relaxed mb-8 font-medium">
            Transform scripts into broadcast-ready 3D infographic assets.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-indigo-500 uppercase tracking-widest">
             <Sparkles className="w-4 h-4" />
             Gemini 2.5 Flash
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full overflow-y-auto bg-slate-100 custom-scrollbar relative">
      {/* Fixed Action Bar */}
      <div className="absolute top-8 right-8 z-50 flex gap-3">
        <button 
          onClick={handleExportPDF}
          disabled={isExporting}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
        >
          {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileDown className="w-5 h-5" />}
          <span className="font-bold">Export PDF Asset</span>
        </button>
      </div>

      {/* Background Noise Texture */}
      <div className="absolute inset-0 opacity-30 pointer-events-none fixed mix-blend-soft-light bg-repeat" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <div ref={contentRef} className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 py-12 space-y-16 relative z-10 pb-32">
        
        {/* Cover Slide */}
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 text-white shadow-2xl shadow-indigo-900/40 aspect-video flex flex-col justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900"></div>
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px] opacity-40 mix-blend-screen"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[400px] h-[400px] bg-emerald-600 rounded-full blur-[100px] opacity-30 mix-blend-screen"></div>
          
          <div className="relative p-12 md:p-16 flex flex-col h-full justify-between">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-xl w-fit">
                <MonitorPlay className="w-4 h-4 text-indigo-200" />
                <span className="text-sm font-bold text-indigo-100 tracking-wide uppercase">Generated Storyboard</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.95] drop-shadow-lg line-clamp-3">
                {result.title}
              </h2>
              
              <p className="text-xl text-slate-300 leading-relaxed font-light max-w-3xl border-l-4 border-indigo-500 pl-6 line-clamp-3">
                {result.summary}
              </p>
            </div>
            
            <div className="flex gap-16 border-t border-white/10 pt-8">
              <div>
                <div className="text-4xl font-black text-white tracking-tight">{result.cards.length}</div>
                <div className="text-xs text-indigo-200 uppercase tracking-widest font-bold mt-2">Scenes</div>
              </div>
              <div>
                <div className="text-4xl font-black text-white tracking-tight">
                   {result.cards.reduce((acc, card) => acc + (card.data ? card.data.length : 0), 0)}
                </div>
                <div className="text-xs text-emerald-200 uppercase tracking-widest font-bold mt-2">Data Points</div>
              </div>
            </div>
          </div>
        </div>

        {/* Artboards Grid */}
        <div className="grid grid-cols-1 gap-16">
          {result.cards.map((card, index) => (
            <div 
              key={card.id} 
              className="bg-white rounded-[2rem] p-2 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50"
            >
              <div className="bg-gradient-to-b from-white to-slate-50 rounded-[1.8rem] p-8 overflow-hidden relative border border-slate-100">
                
                {/* Header */}
                <div className="flex justify-between items-start gap-6 mb-6 relative z-10">
                   <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white font-black shadow-xl shadow-slate-900/20">
                        <span className="text-lg leading-none">{index + 1}</span>
                      </div>
                      <div>
                         <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{card.title}</h3>
                         <p className="text-sm text-slate-500 font-semibold mt-1 line-clamp-1">
                            "{card.scriptSegment.length > 60 ? card.scriptSegment.substring(0, 60) + '...' : card.scriptSegment}"
                         </p>
                      </div>
                   </div>
                </div>

                {/* 16:9 High-Fidelity Visual Frame */}
                <div className="relative z-10 w-full aspect-video bg-white rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                  <ChartRenderer 
                    type={card.type} 
                    data={card.data} 
                    visualSymbol={card.visualSymbol}
                    colorTheme={card.colorTheme}
                  />
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisualPanel;
