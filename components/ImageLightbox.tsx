'use client';

import { useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { Download, X, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageLightboxProps {
  src?: string;
  alt?: string;
}

export default function ImageLightbox({ src, alt }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!src) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = alt || 'image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="my-6 group relative">
      <Zoom>
        <div className="relative overflow-hidden rounded-xl shadow-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
          <img
            src={src}
            alt={alt}
            className="w-full h-auto cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
          />
          {/* Hover overlay with actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span className="text-white text-sm font-medium truncate">
                {alt || 'Click to zoom'}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDownload();
                }}
                className="p-2 bg-blue-500/80 hover:bg-blue-600 rounded-lg backdrop-blur-sm transition-all"
                aria-label="Download image"
              >
                <Download className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          {/* Zoom indicator */}
          <div className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-4 h-4 text-white" />
          </div>
        </div>
      </Zoom>
      {alt && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-gray-400 mt-3 italic"
        >
          {alt}
        </motion.p>
      )}
    </div>
  );
}
