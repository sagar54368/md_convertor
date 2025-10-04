'use client';

import { FileText, X, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  files: File[];
  onRemoveFile: (index: number) => void;
  headings: any[];
}

export default function Sidebar({ isOpen, files, onRemoveFile, headings }: SidebarProps) {
  if (!isOpen) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-80 bg-gray-900/95 backdrop-blur-lg border-r border-gray-700 overflow-y-auto z-40">
      <div className="p-6">
        {/* Loaded Files */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Loaded Files ({files.length})
          </h2>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3 group hover:bg-gray-800 transition"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300 truncate">{file.name}</span>
                </div>
                <button
                  onClick={() => onRemoveFile(index)}
                  className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-red-500/20 rounded"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Table of Contents */}
        {headings.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Navigation
            </h2>
            <nav className="space-y-1">
              {headings.map((heading, index) => (
                <button
                  key={index}
                  onClick={() => scrollToHeading(heading.id)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800/50 transition text-gray-300 hover:text-white group flex items-center"
                  style={{ paddingLeft: `${heading.level * 0.75}rem` }}
                >
                  <ChevronRight className="w-3 h-3 mr-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition" />
                  <span className="text-sm truncate">{heading.text}</span>
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Features List */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Features
          </h3>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Search
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              TOC
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Code Copy
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
