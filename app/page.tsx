'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, X, Menu, Sun, Moon, Linkedin } from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Sidebar from '@/components/Sidebar';
import ExportButtons from '@/components/ExportButtons';
import ErrorReport from '@/components/ErrorReport';
import MarkdownErrorHandler from '@/components/MarkdownErrorHandler';
import { exportToHTML, exportToPDF, exportToDOC } from '@/lib/export-utils';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [headings, setHeadings] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [markdownErrors, setMarkdownErrors] = useState<Array<{fileName: string, error: string}>>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const uploadedFiles = Array.from(e.target.files || []);
      const errors: Array<{fileName: string, error: string}> = [];
      const validContents: string[] = [];

      // Read and validate each file
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

    } catch (err) {
      setError(err as Error);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const extractHeadings = (md: string) => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches = [];
    let match;

    while ((match = headingRegex.exec(md)) !== null) {
      matches.push({
        level: match[1].length,
        text: match[2],
        id: match[2].toLowerCase().replace(/[^\w]+/g, '-')
      });
    }

    setHeadings(matches);
  };

  const handleExport = async (format: 'html' | 'pdf' | 'doc') => {
    const renderedContent = document.getElementById('markdown-preview')?.innerHTML || '';
    const fileName = files.length > 0 ? files[0].name.replace('.md', '') : 'document';

    if (format === 'html') {
      await exportToHTML(renderedContent, fileName);
    } else if (format === 'pdf') {
      await exportToPDF('markdown-preview', fileName);
    } else if (format === 'doc') {
      await exportToDOC(renderedContent, fileName);
    }
  };

  useEffect(() => {
    if (markdownContent) {
      extractHeadings(markdownContent);
    }
  }, [markdownContent]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Error Report Modal */}
      <ErrorReport error={error} onClose={() => setError(null)} />

      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-800 rounded-lg transition"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                MD → Interactive Web Converter
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">v2.1</span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-800 rounded-lg transition"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          files={files}
          onRemoveFile={removeFile}
          headings={headings}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
          <div className="max-w-7xl mx-auto p-8">
            {/* Upload Section */}
            {files.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
                <div className="w-full max-w-2xl">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-blue-500 transition-all bg-gray-800/30 backdrop-blur group"
                  >
                    <div className="flex flex-col items-center justify-center pt-7 pb-6">
                      <Upload className="w-16 h-16 mb-4 text-gray-400 group-hover:text-blue-400 transition" />
                      <p className="mb-2 text-lg font-semibold text-gray-300">
                        <span className="text-blue-400">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">
                        Markdown files (.md) - Single or multiple files
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".md,.markdown"
                      multiple
                      onChange={handleFileUpload}
                    />
                  </label>

                  <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                      <FileText className="w-8 h-8 text-blue-400 mb-2" />
                      <h3 className="font-semibold text-white">Input Processing</h3>
                      <p className="text-sm text-gray-400 mt-1">Batch upload supported</p>
                    </div>
                    <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                      <FileText className="w-8 h-8 text-green-400 mb-2" />
                      <h3 className="font-semibold text-white">Smart Parser</h3>
                      <p className="text-sm text-gray-400 mt-1">Mermaid & code blocks</p>
                    </div>
                    <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-4">
                      <FileText className="w-8 h-8 text-purple-400 mb-2" />
                      <h3 className="font-semibold text-white">Interactive Output</h3>
                      <p className="text-sm text-gray-400 mt-1">Live preview</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Toolbar */}
                <div className="flex justify-between items-center bg-gray-800/50 rounded-lg p-4 backdrop-blur">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-300">
                      {files.length} file(s) loaded
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ExportButtons markdownContent={markdownContent} onExport={handleExport} />
                    <label
                      htmlFor="add-more"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition text-sm font-medium"
                    >
                      + Add More Files
                      <input
                        id="add-more"
                        type="file"
                        className="hidden"
                        accept=".md,.markdown"
                        multiple
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Markdown Errors */}
                {markdownErrors.map((mdError, index) => (
                  <MarkdownErrorHandler
                    key={index}
                    error={mdError.error}
                    fileName={mdError.fileName}
                    onSkip={() => setMarkdownErrors(prev => prev.filter((_, i) => i !== index))}
                    onReupload={() => {
                      setMarkdownErrors(prev => prev.filter((_, i) => i !== index));
                      document.getElementById('add-more')?.click();
                    }}
                  />
                ))}

                {/* Markdown Preview */}
                <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-8 backdrop-blur">
                  <div id="markdown-preview">
                    <MarkdownRenderer content={markdownContent} />
                  </div>

                  {/* Footer */}
                  <div className="mt-12 pt-8 border-t border-gray-700 text-center">
                    <p className="text-gray-400">
                      Made with ❤️ by{' '}
                      <a
                        href="https://www.linkedin.com/in/sagar-kumar-iit-kgp/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 inline-flex items-center space-x-1 transition"
                      >
                        <span>Sagar Kumar</span>
                        <Linkedin className="w-4 h-4" />
                      </a>
                    </p>
                    <p className="text-gray-500 text-sm mt-2">Generated with MD Converter Pro</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
