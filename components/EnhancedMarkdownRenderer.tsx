'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Play, ExternalLink, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MermaidDiagram from './MermaidDiagram';
import ImageLightbox from './ImageLightbox';
import toast from 'react-hot-toast';

interface EnhancedMarkdownRendererProps {
  content: string;
}

export default function EnhancedMarkdownRenderer({ content }: EnhancedMarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [executingCode, setExecutingCode] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCode(id);
    toast.success('Code copied to clipboard!', {
      icon: '📋',
      style: {
        background: '#1f2937',
        color: '#fff',
        border: '1px solid #374151',
      },
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleSection = (id: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Simulate code execution (for demo purposes)
  const executeCode = async (code: string, language: string, id: string) => {
    setExecutingCode(id);
    toast.loading('Executing code...', { id: 'exec' });

    setTimeout(() => {
      toast.success('Code executed successfully!', {
        id: 'exec',
        icon: '✅',
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #10b981',
        },
      });
      setExecutingCode(null);
    }, 1500);
  };

  return (
    <div className="markdown-content prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;

            // Mermaid diagram detection
            if (match && match[1] === 'mermaid') {
              return <MermaidDiagram chart={codeString} />;
            }

            return !inline && match ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group my-6"
              >
                {/* Code block header */}
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-sm font-mono text-gray-400 ml-2">
                      {match[1]}
                    </span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Execute button for supported languages */}
                    {['javascript', 'python', 'bash'].includes(match[1]) && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => executeCode(codeString, match[1], codeId)}
                        disabled={executingCode === codeId}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 text-sm transition-all disabled:opacity-50"
                      >
                        <Play className="w-3.5 h-3.5" />
                        {executingCode === codeId ? 'Running...' : 'Run'}
                      </motion.button>
                    )}
                    {/* Copy button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyToClipboard(codeString, codeId)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm transition-all"
                    >
                      {copiedCode === codeId ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
                {/* Code content */}
                <div className="relative overflow-hidden rounded-b-xl border border-gray-700 border-t-0">
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    className="!mt-0 !bg-gray-900/50 backdrop-blur-sm"
                    showLineNumbers
                    wrapLines
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      background: 'transparent',
                    }}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              </motion.div>
            ) : (
              <code
                className="bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded text-sm text-blue-300 font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ node, children, ...props }) => {
            const id = String(children).toLowerCase().replace(/[^\w]+/g, '-');
            const isCollapsed = collapsedSections.has(id);

            return (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative group"
              >
                <h1
                  id={id}
                  className="scroll-mt-24 flex items-center gap-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent cursor-pointer"
                  onClick={() => toggleSection(id)}
                  {...props}
                >
                  <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
                  {children}
                  <motion.div
                    animate={{ rotate: isCollapsed ? 0 : 180 }}
                    className="ml-auto"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500 opacity-0 group-hover:opacity-100 transition" />
                  </motion.div>
                </h1>
              </motion.div>
            );
          },
          h2: ({ node, children, ...props }) => {
            const id = String(children).toLowerCase().replace(/[^\w]+/g, '-');
            return (
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                id={id}
                className="scroll-mt-24 relative group pl-4 border-l-4 border-blue-500 bg-gradient-to-r from-blue-500/10 to-transparent py-2 -ml-4 pr-4 rounded-r-lg"
                {...props}
              >
                {children}
              </motion.h2>
            );
          },
          h3: ({ node, children, ...props }) => {
            const id = String(children).toLowerCase().replace(/[^\w]+/g, '-');
            return (
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                id={id}
                className="scroll-mt-24 text-green-400"
                {...props}
              >
                {children}
              </motion.h3>
            );
          },
          table: ({ node, children, ...props }) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="overflow-x-auto my-8 rounded-xl border border-gray-700 shadow-2xl"
            >
              <table className="min-w-full divide-y divide-gray-700 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm" {...props}>
                {children}
              </table>
            </motion.div>
          ),
          thead: ({ node, children, ...props }) => (
            <thead className="bg-gradient-to-r from-blue-500/20 to-purple-500/20" {...props}>
              {children}
            </thead>
          ),
          th: ({ node, children, ...props }) => (
            <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider" {...props}>
              {children}
            </th>
          ),
          td: ({ node, children, ...props }) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 border-t border-gray-800" {...props}>
              {children}
            </td>
          ),
          blockquote: ({ node, children, ...props }) => (
            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative border-l-4 border-blue-500 pl-6 py-4 my-6 italic text-gray-300 bg-gradient-to-r from-blue-500/10 to-transparent rounded-r-xl"
              {...props}
            >
              <div className="absolute -left-3 top-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">"</span>
              </div>
              {children}
            </motion.blockquote>
          ),
          a: ({ node, children, href, ...props }) => {
            // Check if it's an internal link (starts with #)
            const isInternal = href?.startsWith('#');

            if (isInternal) {
              return (
                <a
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const element = document.getElementById(targetId);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      // Add highlight animation
                      element.classList.add('highlight-flash');
                      setTimeout(() => element.classList.remove('highlight-flash'), 2000);
                    }
                  }}
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline decoration-2 underline-offset-4 transition-all hover:decoration-wavy"
                  {...props}
                >
                  {children}
                </a>
              );
            }

            return (
              <a
                href={href}
                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline decoration-2 underline-offset-4 transition-all hover:decoration-wavy group"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
                <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            );
          },
          img: ({ node, src, alt, ...props }) => (
            <ImageLightbox src={src} alt={alt} />
          ),
          ul: ({ node, children, ...props }) => (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="list-none space-y-2 my-4"
              {...props}
            >
              {children}
            </motion.ul>
          ),
          li: ({ node, children, ...props }) => (
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3 group"
              {...props}
            >
              <span className="text-blue-400 mt-1.5 group-hover:scale-125 transition-transform">▸</span>
              <span className="flex-1">{children}</span>
            </motion.li>
          ),
          ol: ({ node, children, ...props }) => (
            <motion.ol
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="list-decimal list-inside space-y-2 my-4 ml-4"
              {...props}
            >
              {children}
            </motion.ol>
          ),
          p: ({ node, children, ...props }) => (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="my-4 leading-relaxed text-gray-300"
              {...props}
            >
              {children}
            </motion.p>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
