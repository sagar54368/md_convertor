'use client';

import { Download, FileText, FileImage } from 'lucide-react';
import { useState } from 'react';

interface ExportButtonsProps {
  markdownContent: string;
  onExport: (format: 'html' | 'pdf' | 'doc') => void;
}

export default function ExportButtons({ markdownContent, onExport }: ExportButtonsProps) {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (format: 'html' | 'pdf' | 'doc') => {
    setExporting(format);
    try {
      await onExport(format);
    } finally {
      setTimeout(() => setExporting(null), 2000);
    }
  };

  if (!markdownContent) return null;

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-400">Export:</span>

      <button
        onClick={() => handleExport('html')}
        disabled={exporting !== null}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition text-sm font-medium"
      >
        <FileText className="w-4 h-4" />
        <span>{exporting === 'html' ? 'Exporting...' : 'HTML'}</span>
      </button>

      <button
        onClick={() => handleExport('pdf')}
        disabled={exporting !== null}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg transition text-sm font-medium"
      >
        <FileImage className="w-4 h-4" />
        <span>{exporting === 'pdf' ? 'Exporting...' : 'PDF'}</span>
      </button>

      <button
        onClick={() => handleExport('doc')}
        disabled={exporting !== null}
        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg transition text-sm font-medium"
      >
        <Download className="w-4 h-4" />
        <span>{exporting === 'doc' ? 'Exporting...' : 'DOC'}</span>
      </button>
    </div>
  );
}
