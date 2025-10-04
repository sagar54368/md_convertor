'use client';

import { AlertTriangle, SkipForward, Upload } from 'lucide-react';

interface MarkdownErrorHandlerProps {
  error: string;
  fileName: string;
  onSkip: () => void;
  onReupload: () => void;
}

export default function MarkdownErrorHandler({ error, fileName, onSkip, onReupload }: MarkdownErrorHandlerProps) {
  return (
    <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-6 my-4">
      <div className="flex items-start space-x-4">
        <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-yellow-500 font-semibold text-lg mb-2">
            Error in {fileName}
          </h3>
          <p className="text-gray-300 mb-4">{error}</p>

          <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400 mb-2">Common fixes:</p>
            <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
              <li>Check for unclosed code blocks (```)</li>
              <li>Verify table syntax is correct</li>
              <li>Ensure proper heading formats (# ## ###)</li>
              <li>Check for special characters that need escaping</li>
            </ul>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onSkip}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition text-sm font-medium"
            >
              <SkipForward className="w-4 h-4" />
              <span>Skip & Continue</span>
            </button>
            <button
              onClick={onReupload}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm font-medium"
            >
              <Upload className="w-4 h-4" />
              <span>Fix & Reupload</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
