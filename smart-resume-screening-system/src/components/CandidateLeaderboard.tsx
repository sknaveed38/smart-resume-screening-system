import React, { useState } from 'react';
import { Candidate } from '../types';
import { Search, SlidersHorizontal, UserCheck, AlertCircle, RefreshCw, Layers, CheckSquare, Square, Info } from 'lucide-react';

interface Props {
  candidates: Candidate[];
  selectedCandidateId: string | null;
  onSelectCandidate: (id: string) => void;
  selectedForCompare: string[];
  onToggleCompare: (id: string) => void;
  onClearCompare: () => void;
}

export default function CandidateLeaderboard({
  candidates,
  selectedCandidateId,
  onSelectCandidate,
  selectedForCompare,
  onToggleCompare,
  onClearCompare
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-slate-900 bg-white border-slate-900';
    if (score >= 60) return 'text-slate-800 bg-white border-slate-400';
    return 'text-slate-500 bg-white border-slate-200';
  };

  const getFitColor = (fit: string) => {
    switch (fit) {
      case 'Very High': return 'bg-slate-900 text-white border border-slate-900';
      case 'High': return 'bg-slate-800 text-slate-100 border border-slate-800';
      case 'Medium': return 'bg-slate-100 text-slate-800 border border-slate-300';
      default: return 'bg-white text-slate-400 border border-slate-200';
    }
  };

  // Filter and rank descending
  const filteredCandidates = candidates
    .filter(c => {
      const matchSearch = 
        c.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.result?.candidateName && c.result.candidateName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.result?.skills && c.result.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const scoreValue = c.result?.overallScore ?? 0;
      const matchScore = c.status === 'processing' || scoreValue >= minScore;

      return matchSearch && matchScore;
    })
    .sort((a, b) => {
      const scoreA = a.result?.overallScore ?? -1;
      const scoreB = b.result?.overallScore ?? -1;
      return scoreB - scoreA;
    });

  const processingCount = candidates.filter(c => c.status === 'processing').length;
  const completedCount = candidates.filter(c => c.status === 'completed').length;
  const failedCount = candidates.filter(c => c.status === 'failed').length;

  return (
    <div id="leaderboard-container" className="bg-white border border-slate-200 p-6 space-y-5 rounded-none shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-serif font-black text-slate-900">Ranked Applicants</h2>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Consolidated Competency Roster</p>
        </div>

        {/* Dynamic Pipeline Summary Counters */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          <span className="inline-flex items-center px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-none text-[10px] font-bold text-slate-600">
            TOTAL: {candidates.length}
          </span>
          {processingCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-none text-[10px] font-bold animate-pulse">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              RUNNING: {processingCount}
            </span>
          )}
          {completedCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-300 rounded-none text-[10px] font-bold">
              SCREENED: {completedCount}
            </span>
          )}
          {failedCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-none text-[10px] font-bold">
              FAIL: {failedCount}
            </span>
          )}
        </div>
      </div>

      {/* Interactive Controls & Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          {/* Search Inputs */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              id="leaderboard-search-input"
              type="text"
              placeholder="Search by name, skills, tools..."
              className="w-full text-xs bg-white border border-slate-200 text-slate-800 rounded-none py-2.5 pl-9 pr-4 focus:outline-none focus:border-indigo-600 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            type="button"
            className={`px-3 border transition-all flex items-center justify-center gap-1.5 cursor-pointer rounded-none text-xs font-bold uppercase tracking-wider ${
              showFilters ? 'border-indigo-600 bg-indigo-50 text-indigo-805' : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
            }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden md:inline">Thresholds</span>
          </button>

          {selectedForCompare.length > 0 && (
            <button
              type="button"
              onClick={onClearCompare}
              className="px-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-none transition cursor-pointer"
            >
              Clear ({selectedForCompare.length})
            </button>
          )}
        </div>

        {/* Slider Controls Drawer */}
        {showFilters && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-none space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="min-score-slider" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Min Match standard: <span className="text-slate-800 font-bold font-serif text-sm">{minScore}%</span></label>
              {minScore > 0 && (
                <button
                  type="button"
                  onClick={() => setMinScore(0)}
                  className="text-[10px] text-indigo-605 font-bold uppercase hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
            <input
              id="min-score-slider"
              type="range"
              min="0"
              max="100"
              className="w-full h-1.5 bg-slate-200 appearance-none cursor-pointer accent-slate-900"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
            />
          </div>
        )}
      </div>

      {/* Ranked Candidate List */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {filteredCandidates.length === 0 ? (
          <div id="no-candidates-card" className="border border-dashed border-slate-350 p-8 rounded-none text-center space-y-2 bg-white">
            <Info className="w-8 h-8 text-slate-350 mx-auto" />
            <h3 className="text-sm font-serif italic text-slate-750">No applicants aligned</h3>
            <p className="text-xs text-slate-450">Queue resumes on the left or adjust threshold standards.</p>
          </div>
        ) : (
          filteredCandidates.map((c, index) => {
            const isSelected = selectedCandidateId === c.id;
            const isCompared = selectedForCompare.includes(c.id);
            const score = c.result?.overallScore;
            const name = c.result?.candidateName || c.fileName.replace(/\.[^/.]+$/, '').replace(/DEMO_/, '').replace(/_/g, ' ');

            return (
              <div
                key={c.id}
                id={`candidate-row-${c.id}`}
                className={`relative border p-4 transition-all flex items-center justify-between gap-3 rounded-none ${
                  isSelected
                    ? 'border-indigo-600 bg-slate-50/50'
                    : 'border-slate-200 hover:border-slate-400 bg-white'
                }`}
              >
                {/* Left Side: Checkbox for Comparison + Info click target */}
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {/* Select for compare */}
                  {c.status === 'completed' ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCompare(c.id);
                      }}
                      className="text-slate-400 hover:text-indigo-600 transition p-1 rounded-none cursor-pointer"
                      title="Select for comparison matrix"
                    >
                      {isCompared ? (
                        <CheckSquare className="w-4.5 h-4.5 text-slate-900 fill-slate-50" />
                      ) : (
                        <Square className="w-4.5 h-4.5 text-slate-300" />
                      )}
                    </button>
                  ) : (
                    <div className="w-6.5 shrink-0" />
                  )}

                  {/* Main profile row - clickable to select for detail view */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => onSelectCandidate(c.id)}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-serif font-bold text-slate-400 italic">#{index + 1}</span>
                      <h3 className="text-sm font-serif font-black text-slate-900 truncate tracking-tight">{name}</h3>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span className="truncate max-w-[120px]">{c.fileName}</span>
                      <span>•</span>
                      <span>{c.fileSize}</span>
                    </div>

                    {c.result?.matchExplanation && (
                      <p className="text-xs text-slate-500 italic truncate mt-1">
                        "{c.result.matchExplanation}"
                      </p>
                    )}

                    {/* Sub-skills parsed preview */}
                    {c.result?.skills && c.result.skills.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-2 overflow-hidden max-h-5">
                        {c.result.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="text-[9px] font-bold uppercase tracking-tight px-1.5 py-0.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-none">
                            {skill}
                          </span>
                        ))}
                        {c.result.skills.length > 3 && (
                          <span className="text-[9px] font-bold uppercase px-1 bg-slate-50 text-slate-400 rounded-none">
                            +{c.result.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Process Indicator or Score badges */}
                <div className="shrink-0 flex flex-col items-end gap-1.5 border-l border-slate-150 pl-3.5 min-w-[75px]">
                  {c.status === 'processing' && (
                    <div className="flex flex-col items-center gap-0.5 py-1">
                      <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                      <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest animate-pulse">Running</span>
                    </div>
                  )}

                  {c.status === 'failed' && (
                    <div className="flex flex-col items-center gap-0.5 py-1" title={c.error}>
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                      <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wider">Error</span>
                    </div>
                  )}

                  {c.status === 'completed' && score !== undefined && (
                    <>
                      {/* Overall Percentage Match Badge */}
                      <div className={`px-2.5 py-1 border font-serif text-base font-bold flex items-center justify-center select-none rounded-none ${getScoreColor(score)}`}>
                        {score}%
                      </div>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 uppercase tracking-wider rounded-none ${getFitColor(c.result?.fitLevel || 'Low')}`}>
                        {c.result?.fitLevel} FIT
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
