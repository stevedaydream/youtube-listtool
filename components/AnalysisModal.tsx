import React from 'react';
import { X, Sparkles, TrendingUp, Lightbulb } from 'lucide-react';
import { AnalysisResult, LeaderboardItem } from '../types';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  data: AnalysisResult | null;
  item: LeaderboardItem | null;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, isLoading, data, item }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Gemini AI Analysis</h2>
              <p className="text-xs text-slate-500">Powered by Gemini 3 Flash</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 animate-pulse">Analyzing content patterns...</p>
            </div>
          ) : data && item ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <img src={item.thumbnail} alt="Thumb" className="w-20 h-20 object-cover rounded-lg shadow-sm" />
                <div>
                    <h3 className="font-semibold text-slate-800 line-clamp-2 leading-snug">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">+{item.growth}% Growth</span>
                        <span className="text-xs text-slate-500">{item.views.toLocaleString()} Views</span>
                    </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-1 text-slate-500">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase">Viral Score</span>
                    </div>
                    <div className="text-2xl font-bold text-indigo-600">{data.viralScore}/100</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-1 text-slate-500">
                        <Lightbulb className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase">Engagement</span>
                    </div>
                    <div className="text-2xl font-bold text-indigo-600">{item.engagementRate}%</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3">Key Performance Factors</h4>
                <ul className="space-y-2">
                  {data.insights.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <h4 className="text-xs font-bold text-indigo-800 uppercase mb-1">Strategic Advice</h4>
                <p className="text-sm text-indigo-700 leading-relaxed">
                  {data.strategySuggestion}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">Unable to generate analysis.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;