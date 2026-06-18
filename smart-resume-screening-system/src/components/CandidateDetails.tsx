import React, { useState } from 'react';
import { Candidate, KeywordMatch } from '../types';
import { User, Mail, Phone, Calendar, Briefcase, Award, GraduationCap, CheckCircle, AlertTriangle, HelpCircle, FileText, ChevronRight, Copy, Share2, ClipboardCheck } from 'lucide-react';

interface Props {
  candidate: Candidate;
  onRegenerateQuestions?: (id: string) => void;
}

export default function CandidateDetails({ candidate }: Props) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'skills'>('timeline');
  const [copiedQuestions, setCopiedQuestions] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  if (candidate.status === 'processing') {
    return (
      <div id="details-processing-state" className="bg-white rounded-2xl border border-slate-100 p-8 text-center space-y-4 shadow-sm h-full flex flex-col items-center justify-center min-h-[500px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-600">
            <User className="w-6 h-6 animate-pulse" />
          </div>
        </div>
        <div className="max-w-md">
          <h3 className="text-base font-bold text-slate-800">Processing Applicant File...</h3>
          <p className="text-xs text-slate-400 mt-1">
            Gemini AI is parsing the resume, validating background credentials, audit-matching keywords, scoring dimensions, and compiling specialized interview questions.
          </p>
        </div>
      </div>
    );
  }

  if (candidate.status === 'failed' || !candidate.result) {
    return (
      <div id="details-failed-state" className="bg-white rounded-2xl border border-slate-100 p-8 text-center space-y-4 shadow-sm h-full flex flex-col items-center justify-center min-h-[500px]">
        <div className="p-4 bg-rose-50 text-rose-500 rounded-full">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="max-w-md">
          <h3 className="text-base font-bold text-slate-800">Screening Pipeline Incomplete</h3>
          <p className="text-xs text-slate-400 mt-1 mb-3">
            An error occurred while compiling the AI analysis scorecard. Please check your Gemini API key inside Secrets or try a different file.
          </p>
          <div className="p-3 bg-rose-50/50 text-rose-700/95 font-mono text-[10px] break-all rounded-lg border border-rose-100 text-left">
            Error: {candidate.error || "Model analysis failed to return strict json structures."}
          </div>
        </div>
      </div>
    );
  }

  const result = candidate.result;

  // Custom coordinate calculation for 5-sided Radar Chart
  // Center: 120, 120. Radius: 85
  const size = 240;
  const cx = 120;
  const cy = 120;
  const r = 85;
  const metricsKeys = [
    { key: 'technicalAlignment', label: 'Tech Fit' },
    { key: 'experienceDepth', label: 'Exp Depth' },
    { key: 'domainKnowledge', label: 'Domain' },
    { key: 'softSkills', label: 'Soft Skills' },
    { key: 'growthPotential', label: 'Growth' }
  ];

  // Helper to compute (x,y) for metric score value (0-100)
  const getCoordinates = (index: number, scoreValue: number) => {
    // 5 vertices, starting at -90 degrees (top vertical point)
    const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
    const factor = scoreValue / 100;
    const x = cx + r * Math.cos(angle) * factor;
    const y = cy + r * Math.sin(angle) * factor;
    return { x, y };
  };

  // Build the background concentric pentagons and label anchors
  const backgroundPentagons = [0.35, 0.7, 1.0].map((ratio) => {
    return metricsKeys.map((_, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = cx + r * ratio * Math.cos(angle);
      const y = cy + r * ratio * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  });

  // Calculate coordinates for the actual candidate metric polygon
  const candidateCoordinates = metricsKeys.map((m, i) => {
    const val = (result.radarMetrics as any)[m.key] || 0;
    const { x, y } = getCoordinates(i, val);
    return { x, y, value: val };
  });

  const candidatePointsString = candidateCoordinates.map(p => `${p.x},${p.y}`).join(' ');

  const handleCopyQuestions = () => {
    const qText = result.customQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n\n');
    navigator.clipboard.writeText(qText);
    setCopiedQuestions(true);
    setTimeout(() => setCopiedQuestions(false), 3000);
  };

  const handleCopySummary = () => {
    const summary = `
Candidate: ${result.candidateName}
Email: ${result.email} | Phone: ${result.phone}
Overall Score: ${result.overallScore}% (${result.fitLevel} Fit)
Executive Summary: ${result.matchExplanation}

Strengths:
${result.strengths.map(s => `- ${s}`).join('\n')}

Gaps identified:
${result.weaknesses.map(w => `- ${w}`).join('\n')}
    `.trim();
    navigator.clipboard.writeText(summary);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 3000);
  };

  return (
    <div id="candidate-details-pane" className="space-y-6">
      {/* Candidate Main Header Scorecard - Clean White Editorial Sheet */}
      <div className="bg-white border border-slate-200 text-slate-900 p-6 relative rounded-none shadow-sm overflow-hidden animate-fade-in">
        {/* Subtle accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] font-black uppercase tracking-widest py-1 px-2.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-none">
                Candidate Profile Sheet
              </span>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Processed {new Date().toLocaleDateString()}</span>
            </div>

            <div>
              <h1 className="text-2xl font-serif font-black tracking-tight text-slate-900">{result.candidateName}</h1>
              <p className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 mt-1">{result.experience[0]?.role || "Professionally Screened applicant"}</p>
            </div>

            {/* Contacts Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {result.email || "No email"}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {result.phone || "No phone"}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                {candidate.fileSize} Original File
              </span>
            </div>
          </div>

          {/* Quick metrics standard */}
          <div className="flex items-center gap-4 shrink-0 bg-slate-50 border border-slate-200 rounded-none p-4 self-start md:self-auto">
            <div className="text-center space-y-0.5">
              <div className="text-3xl font-serif font-black text-slate-900">{result.overallScore}%</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">MATCH RATE</div>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">HIRING FIT</div>
              <div className="text-sm font-serif font-semibold italic text-indigo-600 mt-0.5 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
                {result.fitLevel} Alignment
              </div>
            </div>
          </div>
        </div>

        {/* Executive Action Strip */}
        <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 mt-5 pt-4">
          <button
            type="button"
            onClick={handleCopySummary}
            className="px-3.5 py-1.5 border border-slate-200 hover:border-slate-800 bg-white hover:bg-slate-50 text-slate-705 text-[10px] font-bold uppercase tracking-widest rounded-none flex items-center gap-1.5 transition cursor-pointer2 cursor-pointer"
          >
            {copiedAll ? <ClipboardCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedAll ? "COPIED" : "COPY SCORECARD"}
          </button>
        </div>
      </div>

      {/* Grid: Radar Analysis + Keyword Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Metric Chart */}
        <div id="radar-card" className="bg-white border border-slate-200 p-6 space-y-4 rounded-none shadow-sm flex flex-col items-center justify-between">
          <div className="w-full text-left self-start">
            <h3 className="text-base font-serif font-bold text-slate-900">5-Dimensional Alignment</h3>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Skill weight metrics vector</p>
          </div>

          <div className="relative flex justify-center items-center py-2 h-[240px] w-full">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-[230px] h-[230px] overflow-visible">
              {/* Pentagonal dashed concentric rings */}
              {backgroundPentagons.map((points, index) => (
                <polygon
                  key={index}
                  points={points}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  strokeDasharray={index === 2 ? 'none' : '4,4'}
                />
              ))}

              {/* Angle radial lines from center */}
              {metricsKeys.map((_, i) => {
                const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={x}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Actual candidate score area polygon */}
              <polygon
                points={candidatePointsString}
                fill="rgba(79, 70, 229, 0.12)"
                stroke="#1e293b"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Render small points and overlay scores */}
              {candidateCoordinates.map((coord, i) => (
                <g key={i}>
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="4"
                    fill="#1e293b"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  {/* Score text directly plotted for instant recognition */}
                  <text
                    x={coord.x}
                    y={coord.y - 8}
                    textAnchor="middle"
                    className="font-serif text-[10px] font-extrabold fill-slate-900"
                  >
                    {coord.value}
                  </text>
                </g>
              ))}

              {/* Label texts */}
              {metricsKeys.map((m, i) => {
                const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                const tx = cx + (r + 20) * Math.cos(angle);
                const ty = cy + (r + 14) * Math.sin(angle);
                
                let textAnchor = 'middle';
                if (Math.cos(angle) > 0.1) textAnchor = 'start';
                if (Math.cos(angle) < -0.1) textAnchor = 'end';

                return (
                  <text
                    key={i}
                    x={tx}
                    y={ty + 3}
                    textAnchor={textAnchor}
                    className="fill-slate-650 font-bold text-[9px] uppercase tracking-widest font-sans"
                  >
                    {m.label}
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="w-full bg-slate-50 border border-slate-200 p-3 rounded-none flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              <strong className="text-slate-905 font-bold uppercase tracking-wider text-[9px]">Match Summary:</strong> {result.matchExplanation}
            </p>
          </div>
        </div>

        {/* Skills Audit & Match Verification */}
        <div id="skills-audit-card" className="bg-white border border-slate-200 p-6 space-y-4 rounded-none shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-serif font-bold text-slate-900">Target Keyword Match</h3>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Job spec cross comparison analysis</p>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-[196px] overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-none">
            {result.keywordMatch.map((km, i) => {
              return (
                <div
                  key={i}
                  className={`p-2 rounded-none border flex items-center justify-between gap-1.5 text-xs transition-colors ${
                    km.matched
                      ? 'bg-white text-slate-800 border-slate-300 shadow-sm'
                      : 'bg-white/40 text-slate-450 border-slate-200/60 line-through'
                  }`}
                >
                  <span className="font-bold uppercase tracking-tight text-[10px] truncate">{km.keyword}</span>
                  <span className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-extrabold ${
                    km.matched ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {km.matched ? '✓' : '✗'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-3 text-center border-t border-slate-200 pt-3">
            <div className="p-2.5 bg-indigo-50/20 border border-indigo-100 rounded-none">
              <div className="text-lg font-serif font-black text-indigo-700">
                {result.keywordMatch.filter(k => k.matched).length}
              </div>
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Keywords Grounded</div>
            </div>
            
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-none">
              <div className="text-lg font-serif font-black text-slate-700">
                {result.keywordMatch.filter(k => !k.matched).length}
              </div>
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Missing Gaps</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Split: Strengths vs Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Strengths */}
        <div id="strengths-card" className="bg-white border border-slate-200 p-6 space-y-4 rounded-none shadow-sm">
          <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-slate-800" />
            Core Strengths & Fit Validations
          </h3>
          <div className="space-y-2 uppercase text-xs">
            {result.strengths.map((str, i) => (
              <div key={i} className="flex gap-2.5 items-start bg-slate-50 p-2.5 border border-slate-200 rounded-none text-slate-700 font-sans normal-case">
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-xs font-semibold leading-relaxed">{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mitigation Areas / Gaps */}
        <div id="gaps-card" className="bg-white border border-slate-200 p-6 space-y-4 rounded-none shadow-sm">
          <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-slate-800" />
            Identified Gaps & Probing Gaps
          </h3>
          <div className="space-y-2 text-xs">
            {result.weaknesses.map((weak, i) => (
              <div key={i} className="flex gap-2.5 items-start bg-slate-50 p-2.5 border border-slate-200 rounded-none text-slate-700">
                <ChevronRight className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span className="text-xs font-semibold leading-relaxed">{weak}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Layout: Resume Chronology & Gaps Audit */}
      <div className="bg-white border border-slate-200 rounded-none shadow-sm overflow-hidden animate-fade-in">
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-5 py-3.5 text-[10px] font-black uppercase tracking-widest border-b-2 transition rounded-none cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-slate-900 text-slate-900 bg-white font-black'
                : 'border-transparent text-slate-400 hover:text-slate-705'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Role Chronology
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-2 px-5 py-3.5 text-[10px] font-black uppercase tracking-widest border-b-2 transition rounded-none cursor-pointer ${
              activeTab === 'skills'
                ? 'border-slate-900 text-slate-900 bg-white font-black'
                : 'border-transparent text-slate-400 hover:text-slate-705'
            }`}
          >
            <Award className="w-4 h-4" />
            Skill Stock List
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'timeline' ? (
            <div className="space-y-6">
              {/* Experience Node */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" /> Professional History Timeline
                </h4>
                
                <div className="space-y-5 relative pl-4 border-l border-slate-205">
                  {result.experience.map((exp, i) => (
                    <div key={i} className="relative group">
                      {/* Chrono timeline marker dot */}
                      <span className="absolute -left-[21px] top-1 h-2 w-2 bg-slate-400 group-hover:bg-slate-900 ring-4 ring-white transition"></span>
                      
                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h5 className="text-sm font-serif font-black text-slate-900 leading-tight">{exp.role}</h5>
                          <span className="inline-flex py-0.5 px-2 bg-slate-100 border border-slate-350 text-slate-700 font-mono text-[9px] font-bold rounded-none self-start sm:self-auto">
                            {exp.duration}
                          </span>
                        </div>
                        <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">{exp.company}</p>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Node */}
              <div className="border-t border-slate-150 pt-5">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5" /> Academic Credentials
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.education.map((edu, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-none space-y-1 flex items-start gap-2.5">
                      <GraduationCap className="w-5 h-5 text-slate-505 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-serif font-black text-slate-900">{edu.degree}</h5>
                        <p className="text-xs font-semibold text-slate-600">{edu.institution}</p>
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5">GRADUATION: {edu.graduationYear}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Inventory of Skills Extracted</h4>
              <div className="flex flex-wrap gap-1.5">
                {result.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex px-3 py-1 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-none hover:border-slate-800 transition"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Interview Planner - customized probing questions */}
      <div id="interview-copilot-card" className="bg-slate-50 border border-slate-200 p-6 rounded-none shadow-sm relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-white border border-slate-200 text-slate-800 rounded-none">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900">Interview Copilot</h3>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Auto-generated probing diagnostic matrix</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyQuestions}
            className="px-3.5 py-1.5 border border-slate-200 hover:border-slate-800 bg-white hover:bg-slate-50 text-slate-800 text-[10px] font-bold uppercase tracking-widest rounded-none flex items-center justify-center gap-1.5 cursor-pointer transition"
          >
            {copiedQuestions ? <ClipboardCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedQuestions ? "COPIED" : "COPY QUESTIONS"}
          </button>
        </div>

        <div className="space-y-3">
          {result.customQuestions.map((q, i) => (
            <div key={i} className="p-3.5 bg-white border border-slate-200 hover:border-slate-400 rounded-none flex items-start gap-3 transition">
              <span className="h-5 w-5 bg-slate-900 font-mono text-[9px] font-bold text-white flex items-center justify-center shrink-0 rounded-none">
                {i + 1}
              </span>
              <p className="text-xs text-slate-700 font-serif italic leading-relaxed">"{q}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
