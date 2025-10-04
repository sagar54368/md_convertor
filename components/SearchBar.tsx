'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';

interface SearchBarProps {
  content: string;
  onResultClick: (headingId: string) => void;
}

interface SearchResult {
  heading: string;
  id: string;
  preview: string;
}

export default function SearchBar({ content, onResultClick }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Extract headings from markdown
  const headings: SearchResult[] = content
    .split('\n')
    .filter(line => line.match(/^#{1,3}\s/))
    .map(line => {
      const text = line.replace(/^#{1,3}\s/, '').trim();
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      const preview = content
        .split(line)[1]
        ?.split('\n')
        .slice(0, 2)
        .join(' ')
        .substring(0, 100) || '';
      return { heading: text, id, preview };
    });

  // Fuse.js configuration for fuzzy search
  const fuse = new Fuse(headings, {
    keys: ['heading', 'preview'],
    threshold: 0.3,
    includeScore: true,
  });

  useEffect(() => {
    if (query.trim()) {
      const searchResults = fuse.search(query).map(result => result.item);
      setResults(searchResults.slice(0, 5));
    } else {
      setResults([]);
    }
  }, [query]);

  // Keyboard shortcut (Ctrl+F / Cmd+F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Search trigger button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-500/30 rounded-lg transition-all backdrop-blur-sm"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search (Ctrl+F)</span>
      </motion.button>

      {/* Search modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Search box */}
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
            >
              <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
                {/* Input */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-700">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search in document..."
                    className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="p-1.5 hover:bg-gray-800 rounded-lg transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Results */}
                {results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-h-96 overflow-y-auto"
                  >
                    {results.map((result, index) => (
                      <motion.button
                        key={result.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          onResultClick(result.id);
                          setIsOpen(false);
                          setQuery('');
                        }}
                        className="w-full text-left p-4 hover:bg-gray-800/50 transition-colors border-b border-gray-800 last:border-0"
                      >
                        <div className="font-medium text-blue-400 mb-1">
                          {result.heading}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {result.preview}
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {/* No results */}
                {query && results.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No results found for "{query}"
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
