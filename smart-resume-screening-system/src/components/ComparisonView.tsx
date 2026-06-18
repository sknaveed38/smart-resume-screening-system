import React from 'react';
import { Candidate } from '../types';
import { X, Check, Users, ShieldAlert, Award, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

interface Props {
  candidates: Candidate[];
  onRemoveFromCompare: (id: string) => void;
  onClearAll: () => void;
}

export default function ComparisonView({ candidates, onRemoveFromCompare, onClearAll }: Props) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-100';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-100';
    return 'text-rose-700 bg-rose-50 border-rose-100';
  };

  const getFitColor = (fit: string) => {
    switch (fit) {
      case 'Very High': return 'bg-emerald-500 text-white';
      case 'High': return 'bg-teal-500 text-white';
      case 'Medium': return 'bg-amber-500 text-white';
      case 'Low': return 'bg-rose-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  if (candidates.length === 0) {
    return (
      <div id="comparison-empty-state" className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center space-y-3">
        <div className="p-3 bg-slate-50 text-slate-400 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
          <Users className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700">Comparative Grid is Empty</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Check the square boxes on some finished candidate cards in the ranked leaderboard pool to load them side-by-side for comparison review!
        </p>
      </div>
    );
  }

  return (
    <div id="comparison-drawer" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Side-by-Side Candidate Matrix
          </h2>
          <p className="text-xs text-slate-500">Compare applicant scoring dimension ratios and structural alignment matrices side-by-side</p>
        </div>
        
        <button
          type="button"
          onClick={onClearAll}
          className="px-4 py-1.5 border border-dashed text-xs font-bold text-slate-500 hover:text-rose-600 hover:border-rose-300 rounded-lg cursor-pointer active:scale-95 transition"
        >
          Clear Grid ({candidates.length})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((c) => {
          const result = c.result!;
          const name = result.candidateName;

          return (
            <div
              key={c.id}
              id={`compare-column-${c.id}`}
              className="border border-slate-100 rounded-2xl p-5 relative overflow-hidden bg-slate-50/20 hover:shadow-md hover:border-indigo-100 transition-all space-y-5"
            >
              {/* Close / Deselect */}
              <button
                type="button"
                onClick={() => onRemoveFromCompare(c.id)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1 rounded-lg transition"
                title="Remove from comparative chart"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header profile cards */}
              <div className="space-y-2 border-b border-slate-100 pb-3">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getFitColor(result.fitLevel)}`}>
                  {result.fitLevel} Fit
                </span>
                <h3 className="text-base font-bold text-slate-800 line-clamp-1">{name}</h3>
                
                <div className="flex items-center gap-1.5 pt-1">
                  <div className={`px-2.5 py-1 rounded-lg border text-lg font-bold font-mono ${getScoreColor(result.overallScore)}`}>
                    {result.overallScore}%
                  </div>
                  <div className="text-[10px] text-slate-500">
                    <div>{result.email}</div>
                    <div className="font-mono mt-0.5">{result.phone}</div>
                  </div>
                </div>
              </div>

              {/* executive summary matcher */}
              <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Executive Match Conclusion</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium mt-1">{result.matchExplanation}</p>
              </div>

              {/* Dimensions bars stacked */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-indigo-500" />
                  Category Metrics Breakdown
                </h4>
                
                {/* Tech Alignment bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">Technical Alignment</span>
                    <span className="font-mono font-bold text-indigo-600">{result.radarMetrics.technicalAlignment}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${result.radarMetrics.technicalAlignment}%` }}></div>
                  </div>
                </div>

                {/* Experience Depth bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">Experience Depth</span>
                    <span className="font-mono font-bold text-indigo-600">{result.radarMetrics.experienceDepth}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full rounded-full transition-all" style={{ width: `${result.radarMetrics.experienceDepth}%` }}></div>
                  </div>
                </div>

                {/* Domain relevance bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">Domain Suitability</span>
                    <span className="font-mono font-bold text-indigo-600">{result.radarMetrics.domainKnowledge}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${result.radarMetrics.domainKnowledge}%` }}></div>
                  </div>
                </div>

                {/* Soft skills bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">Mentorship & Communication</span>
                    <span className="font-mono font-bold text-indigo-600">{result.radarMetrics.softSkills}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${result.radarMetrics.softSkills}%` }}></div>
                  </div>
                </div>

                {/* Growth Potential bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">Leadership / Growth</span>
                    <span className="font-mono font-bold text-indigo-600">{result.radarMetrics.growthPotential}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${result.radarMetrics.growthPotential}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Strengths lists compare */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1 font-sans">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Key Strengths
                </h4>
                <div className="space-y-1.5">
                  {result.strengths.slice(0, 3).map((st, idx) => (
                    <div key={idx} className="flex gap-1.5 text-xs text-slate-700 bg-emerald-50/20 p-2 border border-emerald-100/30 rounded-lg">
                      <ChevronRight className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-[11px] leading-relaxed font-sans">{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weakness lists compare */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1 font-sans">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  Experience & Skills Gaps
                </h4>
                <div className="space-y-1.5">
                  {result.weaknesses.slice(0, 3).map((wk, idx) => (
                    <div key={idx} className="flex gap-1.5 text-xs text-slate-700 bg-rose-50/10 p-2 border border-rose-100/20 rounded-lg">
                      <ChevronRight className="w-3 h-3 text-rose-400 mt-0.5 shrink-0" />
                      <span className="text-[11px] leading-relaxed font-sans">{wk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
