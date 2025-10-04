'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, X, Menu, Download, Sparkles, Zap, Code2, Image as ImageIcon, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import EnhancedMarkdownRenderer from '@/components/EnhancedMarkdownRenderer';
import Sidebar from '@/components/Sidebar';
import ExportButtons from '@/components/ExportButtons';
import ErrorReport from '@/components/ErrorReport';
import MarkdownErrorHandler from '@/components/MarkdownErrorHandler';
import SearchBar from '@/components/SearchBar';
import ReadingProgress from '@/components/ReadingProgress';
import { exportToHTML, exportToPDF, exportToDOC } from '@/lib/export-utils';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [headings, setHeadings] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [markdownErrors, setMarkdownErrors] = useState<Array<{fileName: string, error: string}>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const uploadedFiles = Array.from(e.target.files || []);
      await processFiles(uploadedFiles);
    } catch (err) {
      setError(err as Error);
      toast.error('Failed to upload files');
    }
  };

  const processFiles = async (uploadedFiles: File[]) => {
    const errors: Array<{fileName: string, error: string}> = [];
    const validContents: string[] = [];

    for (const file of uploadedFiles) {
      try {
        // Validate file type
        if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown')) {
          errors.push({
            fileName: file.name,
            error: 'Invalid file type. Only .md and .markdown files are supported.'
          });
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          errors.push({
            fileName: file.name,
            error: 'File too large. Maximum size is 10MB.'
          });
          continue;
        }

        // Read file content
        const text = await file.text();

        // Validate markdown content
        if (!text.trim()) {
          errors.push({
            fileName: file.name,
            error: 'File is empty.'
          });
          continue;
        }

        // Check for common markdown errors
        const openCodeBlocks = (text.match(/```/g) || []).length;
        if (openCodeBlocks % 2 !== 0) {
          errors.push({
            fileName: file.name,
            error: 'Unclosed code block detected. Make sure all ``` are properly closed.'
          });
          continue;
        }

        // File is valid, add to content
        validContents.push(`# ${file.name}\n\n${text}`);
        setFiles(prev => [...prev, file]);

        toast.success(`${file.name} loaded successfully!`, {
          icon: '✅',
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #10b981',
          },
        });
      } catch (fileErr) {
        errors.push({
          fileName: file.name,
          error: `Failed to read file: ${(fileErr as Error).message}`
        });
      }
    }

    // Update markdown content with valid files
    if (validContents.length > 0) {
      setMarkdownContent(prev => prev + '\n\n' + validContents.join('\n\n---\n\n'));
    }

    // Show errors if any
    if (errors.length > 0) {
      setMarkdownErrors(errors);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    await processFiles(droppedFiles);
  };

  const removeFile = (index: number) => {
    const removedFile = files[index];
    setFiles(prev => prev.filter((_, i) => i !== index));
    toast.success(`${removedFile.name} removed`, {
      icon: '🗑️',
    });
  };

  const extractHeadings = (md: string) => {
    const lines = md.split('\n');
    const headingList: any[] = [];
    lines.forEach(line => {
      const match = line.match(/^(#{1,3})\s+(.+)/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const id = text.toLowerCase().replace(/[^\w]+/g, '-');
        headingList.push({ level, text, id });
      }
    });
    return headingList;
  };

  useEffect(() => {
    if (markdownContent) {
      const h = extractHeadings(markdownContent);
      setHeadings(h);
    }
  }, [markdownContent]);

  const handleExport = async (format: 'html' | 'pdf' | 'doc') => {
    try {
      toast.loading(`Exporting to ${format.toUpperCase()}...`, { id: 'export' });

      if (format === 'html') {
        await exportToHTML(markdownContent, 'document.html');
      } else if (format === 'pdf') {
        await exportToPDF('markdown-container', 'document.pdf');
      } else {
        await exportToDOC(markdownContent, 'document.doc');
      }

      toast.success(`Exported to ${format.toUpperCase()} successfully!`, {
        id: 'export',
        icon: '🎉',
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #10b981',
        },
      });
    } catch (err) {
      console.error('Export failed:', err);
      toast.error(`Failed to export to ${format.toUpperCase()}`, { id: 'export' });
      setError(err as Error);
    }
  };

  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      element.classList.add('highlight-flash');
      setTimeout(() => element.classList.remove('highlight-flash'), 2000);
    }
  };

  const shareDocument = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'MD Converter Pro Document',
          text: 'Check out this markdown document!',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!', {
          icon: '🔗',
        });
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Toaster position="top-right" />
      <ReadingProgress />

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-40 glass-strong border-b border-gray-700/50"
      >
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                    MD → Interactive Web Converter
                  </h1>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm text-blue-400">
                v2.5
              </div>

              {markdownContent && (
                <SearchBar
                  content={markdownContent}
                  onResultClick={scrollToHeading}
                />
              )}

              {markdownContent && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={shareDocument}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                  title="Share document"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              className="fixed lg:sticky top-[73px] left-0 w-80 h-[calc(100vh-73px)] glass-strong border-r border-gray-700/50 overflow-y-auto z-30"
            >
              <Sidebar
                files={files}
                headings={headings}
                onRemoveFile={removeFile}
                onHeadingClick={scrollToHeading}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          {!markdownContent ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen flex items-center justify-center p-8"
            >
              <div className="max-w-4xl w-full">
                {/* Upload Area */}
                <motion.div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer
                    transition-all duration-300 glass hover-glow
                    ${isDragging ? 'border-blue-500 bg-blue-500/10 scale-105' : 'border-gray-600'}
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".md,.markdown"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <motion.div
                    animate={{
                      y: isDragging ? -10 : 0,
                      scale: isDragging ? 1.1 : 1,
                    }}
                    className="flex flex-col items-center gap-6"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-xl"
                      />
                      <div className="relative p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full">
                        <Upload className="w-20 h-20 text-blue-400" />
                      </div>
                    </div>

                    <div>
                      <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Drop your Markdown files here
                      </h2>
                      <p className="text-gray-400 text-lg">
                        or click to <span className="text-blue-400 font-medium">browse</span>
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        Supports .md and .markdown files • Max 10MB per file
                      </p>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
                >
                  {[
                    {
                      icon: <Code2 className="w-8 h-8" />,
                      title: "Interactive Code",
                      desc: "Execute code blocks with one click",
                      color: "from-blue-500 to-cyan-500"
                    },
                    {
                      icon: <ImageIcon className="w-8 h-8" />,
                      title: "Image Zoom",
                      desc: "Click any image to zoom and explore",
                      color: "from-purple-500 to-pink-500"
                    },
                    {
                      icon: <Zap className="w-8 h-8" />,
                      title: "Live Search",
                      desc: "Find anything with Ctrl+F instantly",
                      color: "from-green-500 to-emerald-500"
                    }
                  ].map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="relative group"
                    >
                      <div className="glass hover-glow rounded-xl p-6 h-full">
                        <div className={`inline-flex p-3 bg-gradient-to-br ${feature.color} rounded-lg mb-4`}>
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-400 text-sm">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-5xl mx-auto p-8"
            >
              {/* Export Controls */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-24 z-20 mb-8 glass-strong rounded-xl p-4 border border-gray-700/50"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <span className="font-medium">
                      {files.length} file(s) loaded
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">Export:</span>
                    <ExportButtons onExport={handleExport} />

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Add More Files</span>
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Rendered Content */}
              <div id="markdown-container" className="glass rounded-2xl p-8 border border-gray-700/50">
                <EnhancedMarkdownRenderer content={markdownContent} />
              </div>

              {/* Footer */}
              <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 text-center space-y-3 pb-8"
              >
                <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                <p className="text-gray-400">
                  Made with ❤️ by{' '}
                  <a
                    href="https://www.linkedin.com/in/sagar-kumar-iit-kgp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-medium transition"
                  >
                    Sagar Kumar
                  </a>
                </p>
                <p className="text-sm text-gray-500">
                  Powered by MD Converter Pro
                </p>
              </motion.footer>
            </motion.div>
          )}
        </main>
      </div>

      {/* Error Handlers */}
      {error && <ErrorReport error={error} onClose={() => setError(null)} />}
      {markdownErrors.length > 0 && (
        <MarkdownErrorHandler
          errors={markdownErrors}
          onClose={() => setMarkdownErrors([])}
        />
      )}

      {/* Hidden file input for adding more files */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}
