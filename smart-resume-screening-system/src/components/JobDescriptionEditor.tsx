import React, { useState } from 'react';
import { SAMPLE_JOB_DESCRIPTIONS } from '../data/samples';
import { JobDescription } from '../types';
import { Briefcase, Plus, X, Award, FileText } from 'lucide-react';

interface Props {
  selectedJd: JobDescription;
  onUpdateJd: (jd: JobDescription) => void;
}

export default function JobDescriptionEditor({ selectedJd, onUpdateJd }: Props) {
  const [newSkill, setNewSkill] = useState('');

  const handleSelectTemplate = (id: string) => {
    const found = SAMPLE_JOB_DESCRIPTIONS.find(j => j.id === id);
    if (found) {
      onUpdateJd({ ...found });
    }
  };

  const handleFieldChange = (key: keyof JobDescription, value: any) => {
    onUpdateJd({
      ...selectedJd,
      [key]: value
    });
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newSkill.trim();
    if (clean && !selectedJd.skillsRequired.some(s => s.toLowerCase() === clean.toLowerCase())) {
      onUpdateJd({
        ...selectedJd,
        skillsRequired: [...selectedJd.skillsRequired, clean]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onUpdateJd({
      ...selectedJd,
      skillsRequired: selectedJd.skillsRequired.filter(s => s !== skillToRemove)
    });
  };

  return (
    <div id="jd-editor-container" className="bg-white border border-slate-200 p-6 space-y-6 rounded-none shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-none">
            <Briefcase className="w-5 h-5" id="jd-icon-briefcase" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-slate-900">Job Description Profile</h2>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Active Match Targeting Configurations</p>
          </div>
        </div>

        {/* Template Selector */}
        <div>
          <select
            id="template-select"
            className="text-xs bg-white border border-slate-200 text-slate-700 rounded-none py-1.5 px-3 focus:outline-none focus:border-indigo-600 transition cursor-pointer font-bold uppercase tracking-wider"
            onChange={(e) => handleSelectTemplate(e.target.value)}
            defaultValue={selectedJd.id || ""}
          >
            <option value="" disabled>-- Quick Spec --</option>
            {SAMPLE_JOB_DESCRIPTIONS.map(jd => (
              <option key={jd.id} value={jd.id}>{jd.title.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Job Title */}
        <div className="space-y-1.5">
          <label htmlFor="jd-title-input" className="text-[10px] uppercase font-black text-slate-400 mb-4 tracking-widest">Job Role / Title</label>
          <input
            id="jd-title-input"
            type="text"
            className="w-full text-sm bg-white border border-slate-200 text-slate-800 rounded-none p-2.5 focus:outline-none focus:border-indigo-600 transition"
            placeholder="e.g. Lead React Architect"
            value={selectedJd.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
          />
        </div>

        {/* Department */}
        <div className="space-y-1.5">
          <label htmlFor="jd-department-input" className="text-[10px] uppercase font-black text-slate-400 mb-4 tracking-widest">Department Unit</label>
          <input
            id="jd-department-input"
            type="text"
            className="w-full text-sm bg-white border border-slate-200 text-slate-800 rounded-none p-2.5 focus:outline-none focus:border-indigo-600 transition"
            placeholder="e.g. Core Engineering"
            value={selectedJd.department}
            onChange={(e) => handleFieldChange('department', e.target.value)}
          />
        </div>
      </div>

      {/* Target Filtering Skills Tag Builder */}
      <div className="space-y-20-out space-y-2">
        <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-indigo-600" />
          Mandatory Keyword Match Tags
        </label>
        
        <div className="flex flex-wrap gap-1.5 p-3 min-h-[50px] bg-slate-50 border border-slate-200 rounded-none">
          {selectedJd.skillsRequired.length === 0 ? (
            <span className="text-xs text-slate-400 italic font-serif">No hard skills added yet. Add skill tags below.</span>
          ) : (
            selectedJd.skillsRequired.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-white hover:bg-slate-50 text-indigo-800 border border-slate-200 rounded-none transition"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="rounded-none hover:bg-rose-50 p-0.5 text-rose-500 hover:text-rose-700 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>

        {/* Add Skill Form */}
        <form onSubmit={handleAddSkill} className="flex gap-2">
          <input
            id="new-skill-input"
            type="text"
            className="flex-1 text-sm bg-white border border-slate-200 text-slate-800 rounded-none p-2 focus:outline-none focus:border-indigo-600 transition"
            placeholder="Add keyword tag (e.g. PyTorch, GraphQL)..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <button
            id="add-skill-btn"
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-none select-none transition-colors duration-150 cursor-pointer"
          >
            <Plus className="w-4 h-4 inline mr-1" /> Add
          </button>
        </form>
      </div>

      {/* JD description field */}
      <div className="space-y-1.5">
        <label htmlFor="jd-description-textarea" className="text-[10px] uppercase font-black text-slate-400 mb-4 tracking-widest flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-indigo-600" />
          Full Job Specification Detail
        </label>
        <textarea
          id="jd-description-textarea"
          className="w-full text-sm bg-white border border-slate-200 text-slate-800 rounded-none p-3 h-44 focus:outline-none focus:border-indigo-600 transition font-sans resize-y leading-relaxed"
          placeholder="Paste or write full target job details..."
          value={selectedJd.descriptionText}
          onChange={(e) => handleFieldChange('descriptionText', e.target.value)}
        />
      </div>
    </div>
  );
}
