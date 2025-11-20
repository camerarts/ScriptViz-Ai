import React, { useState } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import VisualPanel from './components/VisualPanel';
import { analyzeScript } from './services/geminiService';
import { AnalysisResult } from './types';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeScript(text);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while processing the script. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
      <Header />
      
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Mobile Error Toast */}
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
              ✕
            </button>
          </div>
        )}

        {/* Left Panel: Input */}
        <div className="w-full lg:w-5/12 h-1/2 lg:h-full z-10">
          <InputPanel onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        </div>

        {/* Right Panel: Visuals */}
        <div className="w-full lg:w-7/12 h-1/2 lg:h-full border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50">
          <VisualPanel result={analysisResult} isAnalyzing={isAnalyzing} />
        </div>
      </main>
    </div>
  );
};

export default App;