import React, { useRef, useState } from 'react';
import { SAMPLE_RESUMES } from '../data/samples';
import { FileUp, Clipboard, Sparkles, AlertCircle, RefreshCw, Layers } from 'lucide-react';

interface Props {
  onQueueResume: (item: {
    fileName: string;
    fileSize: string;
    fileType: string;
    resumeText?: string;
    resumeBase64?: string;
    resumeMimeType?: string;
  }) => void;
  isProcessingAny: boolean;
}

export default function ResumeUploader({ onQueueResume, isProcessingAny }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [typedName, setTypedName] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'err'; message: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const processFile = (file: File) => {
    const sizeStr = (file.size / 1024).toFixed(1) + ' KB';
    const reader = new FileReader();

    // Check if it's plain text or JSON first
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onQueueResume({
          fileName: file.name,
          fileSize: sizeStr,
          fileType: file.type || 'text/plain',
          resumeText: text
        });
        showFeedback('success', `Added "${file.name}" to screening queue.`);
      };
      reader.readAsText(file);
    } else {
      // Send as base64 inlineData for PDFs and images
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64Parts = dataUrl.split(',');
        const mimeType = file.type || getMimeTypeFromExt(file.name);
        const base64 = base64Parts[1] || base64Parts[0];

        onQueueResume({
          fileName: file.name,
          fileSize: sizeStr,
          fileType: mimeType,
          resumeBase64: base64,
          resumeMimeType: mimeType,
          // Fallback text if we want to try to parse client-side, but Gemini handles inline PDF beautifully.
          resumeText: `Name: ${file.name.replace(/\.[^/.]+$/, '')}`
        });

        showFeedback('success', `Added "${file.name}" (PDF/Image) to AI screening queue.`);
      };
      reader.readAsDataURL(file);
    }
  };

  const getMimeTypeFromExt = (filename: string): string => {
    if (filename.endsWith('.pdf')) return 'application/pdf';
    if (filename.endsWith('.png')) return 'image/png';
    if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'image/jpeg';
    return 'application/octet-stream';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      files.forEach(file => {
        processFile(file);
      });
    }
  };

  // Drag-and-drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files) as File[];
      files.forEach(file => {
        processFile(file);
      });
    }
  };

  // One-click demo loader
  const handleLoadDemo = (key: keyof typeof SAMPLE_RESUMES) => {
    const demo = SAMPLE_RESUMES[key];
    onQueueResume({
      fileName: `DEMO_${demo.name.replace(/\s+/g, '_')}.txt`,
      fileSize: '4.2 KB',
      fileType: 'text/plain',
      resumeText: demo.text
    });
    showFeedback('success', `Injected sample profile for "${demo.name}" into screening queue!`);
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const textClean = pastedText.trim();
    if (!textClean) {
      showFeedback('err', 'Please paste resume content in the block below.');
      return;
    }
    const nameClean = typedName.trim() || 'Pasted Resume ' + Math.floor(Math.random() * 1000);
    const byteSize = new Blob([textClean]).size;
    const sizeStr = (byteSize / 1024).toFixed(1) + ' KB';

    onQueueResume({
      fileName: nameClean.endsWith('.txt') ? nameClean : `${nameClean}.txt`,
      fileSize: sizeStr,
      fileType: 'text/plain',
      resumeText: textClean
    });

    showFeedback('success', `Added pasted profile "${nameClean}" to active screen queue.`);
    setPastedText('');
    setTypedName('');
  };

  const showFeedback = (type: 'success' | 'err', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 5000);
  };

  return (
    <div id="resume-uploader-container" className="bg-white border border-slate-200 p-6 space-y-6 rounded-none shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-none">
            <Layers className="w-5 h-5 animate-pulse" id="uploader-icon-layers" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-slate-900">Queue Candidate Files</h2>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Parser Ingest Panel</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 p-0.5 rounded-none self-start sm:self-auto">
          <button
            type="button"
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer ${
              activeTab === 'upload' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
            onClick={() => setActiveTab('upload')}
          >
            File Ingestion
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer ${
              activeTab === 'paste' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
            onClick={() => setActiveTab('paste')}
          >
            Manual Entry
          </button>
        </div>
      </div>

      {feedback && (
        <div
          id="uploader-feedback"
          className={`p-3 rounded-none flex items-start gap-2.5 text-xs font-medium animate-fade-in ${
            feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-250' : 'bg-rose-50 text-rose-805 border border-rose-200'
          }`}
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <div>{feedback.message}</div>
        </div>
      )}

      {activeTab === 'upload' ? (
        <div className="space-y-4">
          {/* Drag & Drop Area */}
          <div
            id="drag-drop-zone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            className={`relative border-2 border-dashed rounded-none p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 ${
              isDragging
                ? 'border-indigo-600 bg-indigo-50/20 scale-[0.99]'
                : 'border-slate-300 hover:border-indigo-600 hover:bg-slate-50/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              id="resume-file-input"
              className="hidden"
              accept=".txt,.pdf,.jpg,.jpeg,.png"
              multiple
              onChange={handleFileChange}
            />
            <div className="p-3 bg-slate-55 border border-slate-200/50 rounded-none text-slate-700">
              <FileUp className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-serif font-black text-slate-800">Drag & Drop applicant files</p>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-wider">Supports PDF, TXT, PNG, JPG (Max 10MB)</p>
            </div>
            <button
              type="button"
              className="px-4 py-1.5 bg-slate-900 border border-transparent hover:bg-indigo-750 text-white font-bold uppercase tracking-widest text-[9px] rounded-none transition duration-150 cursor-pointer"
            >
              Browse Files
            </button>
          </div>

          {/* Quick Demo Resumes */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              1-Click Benchmark Profiles
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleLoadDemo('alex')}
                className="p-3 text-left border border-slate-200 hover:border-slate-800 bg-white transition cursor-pointer rounded-none group"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-650 flex justify-between">
                  <span>ALEX RIVERA</span>
                  <span className="text-[9px] text-slate-400 font-sans tracking-wide">SENIOR</span>
                </div>
                <div className="text-[10px] text-slate-500 font-serif italic mt-1">Full stack engineer spec</div>
              </button>
              <button
                type="button"
                onClick={() => handleLoadDemo('sarah')}
                className="p-3 text-left border border-slate-200 hover:border-slate-800 bg-white transition cursor-pointer rounded-none group"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-650 flex justify-between">
                  <span>SARAH CHEN</span>
                  <span className="text-[9px] text-slate-400 font-sans tracking-wide">SPECIALIST</span>
                </div>
                <div className="text-[10px] text-slate-500 font-serif italic mt-1">Deep Learning, PyTorch, PhD</div>
              </button>
              <button
                type="button"
                onClick={() => handleLoadDemo('marcus')}
                className="p-3 text-left border border-slate-200 hover:border-slate-800 bg-white transition cursor-pointer rounded-none group"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-650 flex justify-between">
                  <span>MARCUS VANCE</span>
                  <span className="text-[9px] text-slate-400 font-sans tracking-wide">MANAGER</span>
                </div>
                <div className="text-[10px] text-slate-500 font-serif italic mt-1">Agile product execution, MBA</div>
              </button>
              <button
                type="button"
                onClick={() => handleLoadDemo('jack')}
                className="p-3 text-left border border-slate-200 hover:border-slate-800 bg-white transition cursor-pointer rounded-none group"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-650 flex justify-between">
                  <span>JACK WRIGHT</span>
                  <span className="text-[9px] text-slate-400 font-sans tracking-wide">JUNIOR</span>
                </div>
                <div className="text-[10px] text-slate-500 font-serif italic mt-1">Entry level tester, high potential</div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePasteSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="pasted-name-input" className="text-[10px] uppercase font-black text-slate-450 tracking-widest">Candidate Full Name</label>
            <input
              id="pasted-name-input"
              type="text"
              required
              className="w-full text-sm bg-white border border-slate-200 text-slate-800 rounded-none p-2.5 focus:outline-none focus:border-indigo-600 transition"
              placeholder="e.g. Liam Sterling"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="pasted-resume-textarea" className="text-[10px] uppercase font-black text-slate-450 tracking-widest">Resume Content (Plaintext)</label>
            <textarea
              id="pasted-resume-textarea"
              required
              className="w-full text-xs bg-white border border-slate-200 text-slate-800 rounded-none p-3 h-44 focus:outline-none focus:border-indigo-600 transition font-mono resize-y leading-relaxed"
              placeholder="Paste work experience timeline, skills, and academic profile..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
            />
          </div>

          <button
            id="paste-submit-btn"
            type="submit"
            className="w-full py-2.5 bg-slate-900 hover:bg-indigo-755 hover:bg-slate-800 text-white rounded-none flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition cursor-pointer"
          >
            <Clipboard className="w-4 h-4" /> INGESTE PASTED CONSTITUENT
          </button>
        </form>
      )}
    </div>
  );
}
