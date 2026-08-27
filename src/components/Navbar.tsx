import React from 'react';
import { 
  Building2, 
  Search, 
  FileText, 
  Store, 
  ShieldCheck, 
  Layers, 
  AlertTriangle, 
  Globe, 
  UserCheck, 
  Scale, 
  PhoneCall,
  Menu,
  X
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  openPostModal: (isCustom?: boolean) => void;
  openVisualDiscovery: () => void;
  activeQuotesCount: number;
  openCrisisModal: () => void;
  languageHindi: boolean;
  setLanguageHindi: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  openPostModal,
  openVisualDiscovery,
  activeQuotesCount,
  openCrisisModal,
  languageHindi,
  setLanguageHindi
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top Utility Ribbon */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs border-b border-slate-800/80 text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-amber-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {languageHindi ? 'लाइव स्टील मंडी भाव & आपूर्ति नेटवर्क' : 'Live Steel B2B Procurement & Quotation Network'}
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <button 
              onClick={openCrisisModal}
              className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer font-medium"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{languageHindi ? 'आपूर्ति व्यवधान / वैकल्पिक सप्लायर' : 'Supply Disruption & Alternative Route Finder'}</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button 
              onClick={() => setLanguageHindi(!languageHindi)}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              title="Toggle Hindi terminology"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{languageHindi ? 'Language: हिन्दी + English' : 'Language: English + हिन्दी'}</span>
            </button>

            {/* Persona Switcher */}
            <div className="flex items-center gap-1 bg-slate-800/90 rounded-md p-0.5 border border-slate-700">
              <span className="text-[10px] uppercase text-slate-400 px-1.5 font-semibold">Mode:</span>
              <button
                onClick={() => { setUserRole('buyer'); setCurrentTab('home'); }}
                className={`px-2 py-0.5 rounded text-xs font-medium transition cursor-pointer ${
                  userRole === 'buyer' 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Buyer
              </button>
              <button
                onClick={() => { setUserRole('seller'); setCurrentTab('seller-dashboard'); }}
                className={`px-2 py-0.5 rounded text-xs font-medium transition cursor-pointer ${
                  userRole === 'seller' 
                    ? 'bg-amber-600 text-white shadow-xs' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Seller (Wholesaler)
              </button>
              <button
                onClick={() => { setUserRole('admin'); setCurrentTab('admin-dashboard'); }}
                className={`px-2 py-0.5 rounded text-xs font-medium transition cursor-pointer ${
                  userRole === 'admin' 
                    ? 'bg-purple-600 text-white shadow-xs' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md border border-blue-400/30 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white">IspatSetu</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-300 border border-blue-700/50 font-bold">B2B STEEL</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {languageHindi ? 'इस्पात सेतु - थोक एवं खुदरा खरीद' : 'Material Quotations & Supplier Matching'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer ${
                currentTab === 'home' 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {languageHindi ? 'होम / खोज' : 'Discover'}
            </button>

            <button
              onClick={() => setCurrentTab('products')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer ${
                currentTab === 'products' 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {languageHindi ? 'कैटलॉग' : 'Products & Specs'}
            </button>

            <button
              onClick={() => setCurrentTab('suppliers')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer ${
                currentTab === 'suppliers' 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {languageHindi ? 'वेरीफाइड सप्लायर्स' : 'Verified Suppliers'}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('my-requirements')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer ${
                currentTab === 'my-requirements' 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-400" />
                {languageHindi ? 'मेरी मांग (RFQs)' : 'My RFQs'}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('quotes-compare')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer relative ${
                currentTab === 'quotes-compare' 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-amber-400" />
                {languageHindi ? 'कोट्स तुलना' : 'Compare Quotes'}
                {activeQuotesCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded-full text-xs font-bold animate-pulse">
                    {activeQuotesCount}
                  </span>
                )}
              </span>
            </button>

            {userRole === 'seller' && (
              <button
                onClick={() => setCurrentTab('seller-dashboard')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer ${
                  currentTab === 'seller-dashboard' 
                    ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-amber-400" />
                  {languageHindi ? 'विक्रेता पोर्टल' : 'Seller Dashboard'}
                </span>
              </button>
            )}

            {userRole === 'admin' && (
              <button
                onClick={() => setCurrentTab('admin-dashboard')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer ${
                  currentTab === 'admin-dashboard' 
                    ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-purple-400" />
                  Admin
                </span>
              </button>
            )}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={openVisualDiscovery}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>{languageHindi ? 'चित्र द्वारा खोज' : 'Visual Finder'}</span>
            </button>

            <button
              onClick={() => openPostModal(false)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-900/30 transition transform active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{languageHindi ? 'मांग दर्ज करें (कोट प्राप्त करें)' : 'Post Requirement (Get Quotes)'}</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800 text-xs">
            <button
              onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
              className="p-2 rounded bg-slate-900 text-left text-slate-200 font-medium"
            >
              Discover
            </button>
            <button
              onClick={() => { setCurrentTab('products'); setMobileMenuOpen(false); }}
              className="p-2 rounded bg-slate-900 text-left text-slate-200 font-medium"
            >
              Products & Specs
            </button>
            <button
              onClick={() => { setCurrentTab('suppliers'); setMobileMenuOpen(false); }}
              className="p-2 rounded bg-slate-900 text-left text-slate-200 font-medium"
            >
              Verified Suppliers
            </button>
            <button
              onClick={() => { setCurrentTab('my-requirements'); setMobileMenuOpen(false); }}
              className="p-2 rounded bg-slate-900 text-left text-slate-200 font-medium"
            >
              My Requirements
            </button>
            <button
              onClick={() => { setCurrentTab('quotes-compare'); setMobileMenuOpen(false); }}
              className="p-2 rounded bg-slate-900 text-left text-slate-200 font-medium flex items-center justify-between"
            >
              <span>Compare Quotes</span>
              {activeQuotesCount > 0 && (
                <span className="px-1.5 py-0.5 bg-amber-500 text-black rounded text-[10px] font-bold">
                  {activeQuotesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => { setCurrentTab('seller-dashboard'); setUserRole('seller'); setMobileMenuOpen(false); }}
              className="p-2 rounded bg-slate-900 text-left text-amber-300 font-medium"
            >
              Seller Dashboard
            </button>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => { openPostModal(true); setMobileMenuOpen(false); }}
              className="flex-1 py-2 bg-slate-800 rounded text-center text-xs font-semibold text-cyan-300 border border-slate-700"
            >
              Custom Drawing / Component
            </button>
            <button
              onClick={() => { openCrisisModal(); setMobileMenuOpen(false); }}
              className="flex-1 py-2 bg-amber-950/60 rounded text-center text-xs font-semibold text-amber-300 border border-amber-800/60"
            >
              Crisis Disruption
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
