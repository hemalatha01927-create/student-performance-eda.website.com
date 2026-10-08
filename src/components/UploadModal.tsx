import { useRef, useState } from 'react';
import { Upload, X, FileText, CheckCircle2 } from 'lucide-react';
import { parseCSV, defaultDataset, type StudentRecord } from '../data';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (data: StudentRecord[]) => void;
}

export function UploadModal({ open, onClose, onUpload }: UploadModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<StudentRecord[] | null>(null);

  if (!open) return null;

  const handleFile = (file: File) => {
    setError('');
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const records = parseCSV(text);
        if (records.length === 0) {
          setError('Could not parse any valid records. Make sure the CSV has the right columns.');
          setPreview(null);
          return;
        }
        setPreview(records);
      } catch {
        setError('Failed to read the CSV file. Please check the format.');
        setPreview(null);
      }
    };
    reader.onerror = () => {
      setError('Failed to read the file.');
      setPreview(null);
    };
    reader.readAsText(file);
  };

  const handleConfirm = () => {
    if (preview && preview.length > 0) {
      onUpload(preview);
      handleClose();
    }
  };

  const handleReset = () => {
    onUpload(defaultDataset);
    handleClose();
  };

  const handleClose = () => {
    setFileName('');
    setError('');
    setPreview(null);
    onClose();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-800">Upload CSV Dataset</h3>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200"
        >
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm text-slate-600 font-medium">
            Click to browse or drag &amp; drop a CSV file
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Expected columns: Student_ID, Name, Gender, Maths, Science, English, Attendance
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>

        {fileName && !error && (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{fileName}</span>
            {preview && (
              <span className="flex items-center gap-1 text-emerald-600 ml-auto">
                <CheckCircle2 className="w-4 h-4" />
                {preview.length} records parsed
              </span>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 text-sm text-rose-600 bg-rose-50 rounded-lg p-3 border border-rose-100">
            {error}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
          >
            Reset to default dataset
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!preview || preview.length === 0}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md transition-all"
            >
              Confirm Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
