'use client';

import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import MermaidDiagram from './MermaidDiagram';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
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
              <div className="relative group">
                <button
                  onClick={() => copyToClipboard(codeString, codeId)}
                  className="absolute right-4 top-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg opacity-0 group-hover:opacity-100 transition z-10"
                  aria-label="Copy code"
                >
                  {copiedCode === codeId ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-300" />
                  )}
                </button>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-lg !mt-0"
                  showLineNumbers
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code
                className="bg-gray-800 px-2 py-1 rounded text-sm text-blue-300"
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ node, children, ...props }) => {
            const id = String(children).toLowerCase().replace(/[^\w]+/g, '-');
            return (
              <h1 id={id} className="scroll-mt-20" {...props}>
                {children}
              </h1>
            );
          },
          h2: ({ node, children, ...props }) => {
            const id = String(children).toLowerCase().replace(/[^\w]+/g, '-');
            return (
              <h2 id={id} className="scroll-mt-20" {...props}>
                {children}
              </h2>
            );
          },
          h3: ({ node, children, ...props }) => {
            const id = String(children).toLowerCase().replace(/[^\w]+/g, '-');
            return (
              <h3 id={id} className="scroll-mt-20" {...props}>
                {children}
              </h3>
            );
          },
          table: ({ node, children, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full divide-y divide-gray-700" {...props}>
                {children}
              </table>
            </div>
          ),
          blockquote: ({ node, children, ...props }) => (
            <blockquote
              className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-400 bg-gray-800/30 rounded-r-lg"
              {...props}
            >
              {children}
            </blockquote>
          ),
          a: ({ node, children, href, ...props }) => (
            <a
              href={href}
              className="text-blue-400 hover:text-blue-300 underline transition"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
          img: ({ node, src, alt, ...props }) => (
            <div className="my-6">
              <img
                src={src}
                alt={alt}
                className="rounded-lg max-w-full h-auto shadow-lg"
                {...props}
              />
              {alt && (
                <p className="text-center text-sm text-gray-500 mt-2">{alt}</p>
              )}
            </div>
          ),
          ul: ({ node, children, ...props }) => (
            <ul className="list-disc list-inside space-y-2 my-4" {...props}>
              {children}
            </ul>
          ),
          ol: ({ node, children, ...props }) => (
            <ol className="list-decimal list-inside space-y-2 my-4" {...props}>
              {children}
            </ol>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
