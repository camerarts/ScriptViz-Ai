import React, { useState } from 'react';
import { Send, Eraser, FileText } from 'lucide-react';

interface InputPanelProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

const EXAMPLE_SCRIPT = `Welcome to our Q3 Financial Report video. 

First, let's look at our user growth. We started the quarter with 10,000 active users. By August, we hit 12,500, and we closed September with a record 15,000 active users. This represents a consistent upward trend.

Next, let's break down our revenue sources. Subscription fees account for 60% of our income. Consulting services bring in 25%, and the remaining 15% comes from marketplace transaction fees.

The key takeaway is our retention rate, which now stands at an industry-leading 94%. This stability allows us to project a 20% revenue increase for Q4.

Finally, our roadmap for next quarter involves three steps: 1. Launch mobile app beta. 2. Expand into the European market. 3. Host our annual developer conference.`;

const InputPanel: React.FC<InputPanelProps> = ({ onAnalyze, isAnalyzing }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  const loadExample = () => {
    setText(EXAMPLE_SCRIPT);
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-indigo-500" />
          Input Script
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Paste your video script, article, or notes here.
        </p>
      </div>

      <div className="flex-1 p-6 relative">
        <textarea
          className="w-full h-full resize-none p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-700 placeholder-slate-400 transition-all font-mono text-sm leading-relaxed"
          placeholder="Enter your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isAnalyzing}
        />
        {text.length === 0 && (
          <button 
            onClick={loadExample}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm text-indigo-600 bg-white px-4 py-2 rounded-full shadow-sm border border-indigo-100 hover:bg-indigo-50 transition-colors"
          >
            Try Example Script
          </button>
        )}
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setText('')}
            className="text-slate-500 hover:text-slate-700 text-sm font-medium flex items-center px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            disabled={isAnalyzing || !text}
          >
            <Eraser className="w-4 h-4 mr-2" />
            Clear
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isAnalyzing || !text.trim()}
            className={`flex items-center px-6 py-2.5 rounded-xl text-white font-medium shadow-lg shadow-indigo-200 transition-all transform active:scale-95 ${
              isAnalyzing || !text.trim()
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300'
            }`}
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <span>Visualize</span>
                <Send className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputPanel;