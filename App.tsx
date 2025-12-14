
import React, { useState } from 'react';
import { generateBusinessPlan } from './services/geminiService';
import { AppState, BusinessPlan, Language, LogEntry } from './types';
import { InputSection } from './components/InputSection';
import { Dashboard } from './components/Dashboard';
import { TerminalLog } from './components/TerminalLog';
import { HashRouter } from 'react-router-dom';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: 'input',
    logs: [],
    plan: null,
    error: null,
    language: 'en'
  });

  const addLog = (entry: LogEntry) => {
    setState(prev => ({
      ...prev,
      logs: [...prev.logs, entry]
    }));
  };

  const handleFormSubmit = async (location: string, niche: string, language: Language) => {
    setState(prev => ({ 
      ...prev, 
      step: 'processing', 
      logs: [],
      error: null,
      language
    }));

    try {
      const plan = await generateBusinessPlan(
        location, 
        niche, 
        language, 
        addLog // Pass logging callback
      );
      
      setState(prev => ({
        ...prev,
        step: 'results',
        plan,
        error: null
      }));

    } catch (err) {
      console.error(err);
      setState(prev => ({
        ...prev,
        step: 'input',
        error: 'Failed to generate plan. Please ensure your API Key is valid and try again.',
      }));
    }
  };

  const handleReset = () => {
    setState(prev => ({
      ...prev,
      step: 'input',
      logs: [],
      plan: null,
      error: null
    }));
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
        
        {/* Error Toast */}
        {state.error && (
           <div className="fixed top-5 right-5 bg-rose-500/10 border border-rose-500/50 text-rose-500 px-6 py-4 rounded-lg shadow-xl backdrop-blur-md z-50 animate-fade-in">
             <p className="font-bold">Error</p>
             <p className="text-sm">{state.error}</p>
             <button 
              onClick={() => setState(s => ({...s, error: null}))}
              className="absolute top-2 right-2 text-rose-500 hover:text-rose-400"
             >✕</button>
           </div>
        )}

        {state.step === 'input' && (
          <InputSection onSubmit={handleFormSubmit} isLoading={false} />
        )}

        {state.step === 'processing' && (
          <div className="flex flex-col items-center justify-center min-h-screen px-4">
             <div className="relative mb-8">
                <div className="w-24 h-24 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full animate-pulse"></div>
                </div>
             </div>
             <TerminalLog logs={state.logs} />
          </div>
        )}

        {state.step === 'results' && state.plan && (
          <Dashboard plan={state.plan} onReset={handleReset} />
        )}

      </div>
    </HashRouter>
  );
};

export default App;
