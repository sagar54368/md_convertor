'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#60a5fa',
        primaryTextColor: '#fff',
        primaryBorderColor: '#3b82f6',
        lineColor: '#34d399',
        secondaryColor: '#a78bfa',
        tertiaryColor: '#1e293b',
        background: '#0f172a',
        mainBkg: '#1e293b',
        secondBkg: '#334155',
        textColor: '#e2e8f0',
        fontSize: '16px',
      },
      securityLevel: 'loose',
    });

    const renderDiagram = async () => {
      if (!containerRef.current) return;

      try {
        const { svg } = await mermaid.render(
          `mermaid-${Math.random().toString(36).substr(2, 9)}`,
          chart
        );
        containerRef.current.innerHTML = svg;
        setError(null);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError('Failed to render diagram');
      }
    };

    renderDiagram();
  }, [chart]);

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 my-4">
        <p className="text-red-400 text-sm">{error}</p>
        <pre className="text-gray-400 text-xs mt-2 overflow-x-auto">{chart}</pre>
      </div>
    );
  }

  return (
    <div className="mermaid-container bg-gray-900/50 rounded-lg p-6 my-6 overflow-x-auto">
      <div ref={containerRef} className="flex justify-center" />
    </div>
  );
}
