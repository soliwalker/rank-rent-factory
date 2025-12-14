
import React, { useState } from 'react';
import { Loader2, Search, MapPin, Briefcase, Globe } from 'lucide-react';
import { Language } from '../types';

interface InputSectionProps {
  onSubmit: (location: string, niche: string, language: Language) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onSubmit, isLoading }) => {
  const [location, setLocation] = useState('');
  const [niche, setNiche] = useState('');
  const [language, setLanguage] = useState<Language>('en');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim() && niche.trim()) {
      onSubmit(location, niche, language);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl shadow-emerald-900/10 relative overflow-hidden">
        
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500"></div>
        
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Rank & Rent <span className="text-emerald-400">Factory</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Enter a market. We analyze the data, find the starving crowd, and build your blueprint.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> TARGET LOCATION
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Milano, IT"
                className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="niche" className="text-sm font-medium text-cyan-400 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> TARGET NICHE
              </label>
              <input
                id="niche"
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Idraulico"
                className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                required
              />
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Globe className="w-4 h-4" /> OUTPUT LANGUAGE
            </label>
            <div className="flex gap-2">
              {(['en', 'it', 'es', 'fr', 'de'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`flex-1 py-2 rounded border text-sm font-bold uppercase transition-all ${
                    language === lang 
                      ? 'bg-emerald-600 border-emerald-500 text-white' 
                      : 'bg-slate-950 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full group relative bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <div className="flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>INITIALIZING FACTORY...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>GENERATE PROFIT BLUEPRINT</span>
                </>
              )}
            </div>
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-600 font-mono">
          POWERED BY GEMINI 2.5 FLASH // GOD MODE ENABLED
        </div>
      </div>
    </div>
  );
};
