import React, { useState } from 'react';
import { 
  Search, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Wrench, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { lookupLocalTerm } from '../utils/steelCalculator';

interface HeroSearchProps {
  onSearch: (query: string) => void;
  openPostModal: (isCustom?: boolean, prefillData?: any) => void;
  openVisualDiscovery: () => void;
  languageHindi: boolean;
}

const POPULAR_SEARCH_PROMPTS = [
  { label: '12 mm TMT (4 Soot)', query: '12 mm TMT' },
  { label: 'Tata Tiscon 550D', query: 'Tata Tiscon' },
  { label: 'ISMC 150 Channel', query: 'ISMC 150' },
  { label: 'Square Pipe 50x50', query: 'Square Pipe 50x50' },
  { label: '3 Soot Saria (10mm)', query: '3 Soot' },
  { label: '4mm Chequered Plate', query: 'Chequered Plate' },
  { label: 'Base Plate (Custom CNC)', query: 'Base Plate' },
  { label: 'Binding Wire 18 Gauge', query: 'Binding Wire' }
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onSearch,
  openPostModal,
  openVisualDiscovery,
  languageHindi
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const localMatches = searchTerm.length > 1 ? lookupLocalTerm(searchTerm) : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setShowSuggestions(false);
    }
  };

  const handleSelectPrompt = (query: string) => {
    setSearchTerm(query);
    onSearch(query);
    setShowSuggestions(false);
  };

  return (
    <div className="relative bg-slate-900 text-white overflow-hidden border-b border-slate-800">
      {/* Subtle Blueprint Grid Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px), radial-gradient(#64748b 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-12 sm:pt-14 sm:pb-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{languageHindi ? 'सरल एवं पारदर्शी इस्पात खरीद मंच' : 'B2B Steel Procurement & Lead Generation Platform'}</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-100 leading-tight">
            {languageHindi ? (
              <>
                अपनी जरूरत बताएं, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">सही सप्लायर और भाव</span> तुरंत पाएं
              </>
            ) : (
              <>
                “I need this steel material. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">Who can supply it, at what landed price?</span>”
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal max-w-2xl mx-auto">
            {languageHindi 
              ? 'टी.एम.टी सरिया, चैनल, गार्डर, पाइप, चादर या कस्टम फैब्रिकेशन ड्राइंग — सीधे प्राथमिक थोक विक्रेताओं से लाइव कोट प्राप्त करें।'
              : 'Discover standard specifications or custom fabricated components. Get verified supplier quotes delivered to your town or village site.'}
          </p>

          {/* Primary Search Container with Local Terminology Assistant */}
          <div className="pt-2 relative max-w-2xl mx-auto text-left">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center bg-slate-950/90 rounded-xl border-2 border-slate-700 focus-within:border-blue-500 shadow-2xl p-1.5 transition-all">
                <div className="pl-3 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={
                    languageHindi 
                      ? 'सामग्री का नाम, साइज या स्थानीय नाम लिखें (जैसे: 12mm TMT, 3 सूत सरिया, 150 चैनल...)' 
                      : 'Search material, size, brand or local term (e.g. 12mm TMT, 3 Soot, ISMC 150, Sheet...)'
                  }
                  className="w-full bg-transparent px-3 py-2.5 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="p-1.5 text-slate-400 hover:text-white text-xs mr-1"
                  >
                    Clear
                  </button>
                )}

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center gap-1.5 shadow-md transition cursor-pointer shrink-0"
                >
                  <span>{languageHindi ? 'खोजें' : 'Search'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Colloquial Local Translation Dropdown / Suggestions */}
            {showSuggestions && searchTerm.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-30 p-3 space-y-2 max-h-80 overflow-y-auto">
                {localMatches.length > 0 && (
                  <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-800/60 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{languageHindi ? 'स्थानीय शब्दावली पहचान (Rural Terminology Guide)' : 'Local Terminology Match Found'}</span>
                    </div>
                    {localMatches.map((item, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          setSearchTerm(item.standardTerm);
                          onSearch(item.standardTerm);
                          setShowSuggestions(false);
                        }}
                        className="p-2 rounded bg-slate-900/80 hover:bg-slate-800 cursor-pointer flex items-start justify-between gap-2 border border-slate-800 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-white">
                            <span className="text-amber-400">{item.localTerm}</span> ({item.hindiScript}) ➔ <span className="text-cyan-300">{item.standardTerm}</span>
                          </div>
                          <div className="text-slate-400 text-[11px]">{item.notes}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 text-[10px] font-mono shrink-0">
                          {item.standardSpec}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-1">
                  Matching Standard Products
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSearch(searchTerm);
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 text-xs flex items-center justify-between"
                >
                  <span>Search steel catalogue for <strong className="text-white">"{searchTerm}"</strong></span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Popular Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              {languageHindi ? 'लोकप्रिय खोज:' : 'Trending:'}
            </span>
            {POPULAR_SEARCH_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPrompt(prompt.query)}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs transition cursor-pointer"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Secondary Discovery Cards (Visual & Custom Drawing) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 max-w-2xl mx-auto">
            <div 
              onClick={openVisualDiscovery}
              className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 cursor-pointer flex items-center gap-3 text-left transition group"
            >
              <div className="p-2.5 rounded-lg bg-cyan-950/80 border border-cyan-700/50 text-cyan-400 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100 group-hover:text-cyan-300">
                  {languageHindi ? 'चित्र या आकार से पहचानें' : 'Visual Steel Shape Identifier'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {languageHindi ? 'तकनीकी नाम नहीं पता? आकार चुनकर मांग बनाएं' : "Don't know the exact technical name? Pick shape"}
                </div>
              </div>
            </div>

            <div 
              onClick={() => openPostModal(true)}
              className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 cursor-pointer flex items-center gap-3 text-left transition group"
            >
              <div className="p-2.5 rounded-lg bg-amber-950/80 border border-amber-700/50 text-amber-400 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100 group-hover:text-amber-300">
                  {languageHindi ? 'कस्टम कंपोनेंट / ड्राइंग भेजें' : "Can't Find? Custom Drawing RFQ"}
                </div>
                <div className="text-[11px] text-slate-400">
                  {languageHindi ? 'बेस प्लेट, वेल्डेड ट्रस, पंचिंग कार्य का कोट पाएं' : 'Base plates, custom cuts & fabricators matching'}
                </div>
              </div>
            </div>
          </div>

          {/* Trust Value Points */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 text-left border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% GST & Yard Verified Sellers</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Rural & Village Site Road Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Direct Mill Test Certificates</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Landed Cost (Price + Freight + GST)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
