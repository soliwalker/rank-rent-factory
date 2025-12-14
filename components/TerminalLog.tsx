
import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

interface TerminalLogProps {
  logs: LogEntry[];
}

export const TerminalLog: React.FC<TerminalLogProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const getIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-rose-500" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-emerald-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-rose-400';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-950 border border-slate-800 rounded-lg shadow-2xl overflow-hidden font-mono text-sm">
      <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 border-b border-slate-800">
        <Terminal className="w-4 h-4 text-emerald-500" />
        <span className="text-slate-400 font-bold">Factory Process Log</span>
      </div>
      <div className="p-4 h-64 overflow-y-auto space-y-3 bg-black/50 backdrop-blur-sm">
        {logs.length === 0 && (
          <div className="text-slate-600 italic">Waiting for input stream...</div>
        )}
        {logs.map((log, index) => (
          <div key={index} className="flex items-start gap-3 animate-fade-in">
            <span className="text-slate-600 text-xs whitespace-nowrap mt-0.5">
              [{log.timestamp}]
            </span>
            <div className="flex items-start gap-2">
              <span className="mt-0.5">{getIcon(log.type)}</span>
              <span className={`${getColor(log.type)} leading-relaxed`}>
                {log.message}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {/* Animated Loading Bar */}
      <div className="h-1 bg-slate-900 w-full overflow-hidden">
        <div className="h-full bg-emerald-500/50 w-1/3 animate-[shimmer_2s_infinite_linear] translate-x-[-100%]"></div>
      </div>
    </div>
  );
};
