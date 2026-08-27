import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  FileText, 
  Check, 
  X, 
  Settings, 
  BarChart3,
  Building2,
  Users,
  AlertCircle
} from 'lucide-react';
import { SellerProfile, RequirementItem, Quotation } from '../types';
import { CATEGORIES_DATA } from '../data/mockData';

interface AdminDashboardProps {
  sellers: SellerProfile[];
  requirements: RequirementItem[];
  quotes: Quotation[];
  onToggleVerifySeller: (sellerId: string) => void;
  languageHindi: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  sellers,
  requirements,
  quotes,
  onToggleVerifySeller,
  languageHindi
}) => {
  const [activeTab, setActiveTab] = useState<'sellers' | 'analytics' | 'categories'>('sellers');

  const totalDemandTonnes = requirements.reduce((sum, r) => sum + (r.unit === 'Tonnes' ? r.quantity : 0), 0);
  const totalVerifiedSellers = sellers.filter(s => s.isGstVerified).length;
  const avgQuotesPerRfq = (quotes.length / Math.max(1, requirements.length)).toFixed(1);

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8 border border-slate-800 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-purple-900 text-purple-300 text-[10px] font-bold">
                  PLATFORM GOVERNANCE
                </span>
                <span className="text-xs text-slate-400">PRD Section 27</span>
              </div>
              <h1 className="text-2xl font-black mt-1">Platform Administration & Quality Control</h1>
              <p className="text-xs text-slate-300">
                Audit wholesaler GST credentials, monitor regional demand trends, and configure category parameters.
              </p>
            </div>

            {/* KPI quick metrics */}
            <div className="flex gap-3">
              <div className="bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700 text-center">
                <div className="text-[10px] uppercase text-slate-400">Total Demand</div>
                <div className="text-lg font-black text-amber-400">{totalDemandTonnes} MT</div>
              </div>
              <div className="bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700 text-center">
                <div className="text-[10px] uppercase text-slate-400">Verified Sellers</div>
                <div className="text-lg font-black text-emerald-400">{totalVerifiedSellers}/{sellers.length}</div>
              </div>
              <div className="bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700 text-center">
                <div className="text-[10px] uppercase text-slate-400">Avg Quotes/RFQ</div>
                <div className="text-lg font-black text-blue-400">{avgQuotesPerRfq}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 text-xs font-bold text-slate-600 gap-2 mb-6 shadow-xs">
          <button
            onClick={() => setActiveTab('sellers')}
            className={`py-3.5 px-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'sellers' ? 'border-purple-600 text-purple-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Seller Audits & GST Approvals</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3.5 px-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'analytics' ? 'border-purple-600 text-purple-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Regional Demand & Steel Price Index</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3.5 px-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'categories' ? 'border-purple-600 text-purple-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Custom Category Attributes</span>
          </button>
        </div>

        {/* Tab 1: Sellers */}
        {activeTab === 'sellers' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-sm text-slate-900">Registered Steel Wholesalers & Fabrication Yards</h2>
              <span className="text-xs text-slate-500">Click toggle to verify/unverify</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {sellers.map((seller) => (
                <div key={seller.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 text-sm">{seller.businessName}</strong>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
                        GST: {seller.gstNumber}
                      </span>
                    </div>
                    <div className="text-slate-500">
                      Owner: {seller.ownerName} | 📍 {seller.city}, {seller.state} | Capacity: {seller.warehouseCapacityTonnes} MT
                    </div>
                    <div className="text-slate-600 text-[11px]">
                      Brands: {seller.brandsCarried.join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      seller.isGstVerified
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {seller.isGstVerified ? 'GST Verified ✓' : 'Audit Pending'}
                    </span>

                    <button
                      onClick={() => onToggleVerifySeller(seller.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                        seller.isGstVerified
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {seller.isGstVerified ? 'Revoke Badge' : 'Approve & Verify'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Analytics & Price Trends */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Regional Steel Demand by Category</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>TMT Rebars (Fe 500D / 550D)</span>
                    <span className="text-blue-600">62% (48 MT)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-[62%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Structural Beams & Channels (ISMB/ISMC)</span>
                    <span className="text-indigo-600">22% (18 MT)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full w-[22%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>MS Pipes & Hollow Sections (SHS/RHS)</span>
                    <span className="text-cyan-600">11% (9 MT)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-600 h-full w-[11%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Custom CNC Base Plates & Drawings</span>
                    <span className="text-amber-600">5% (4 MT)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-600 h-full w-[5%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-slate-900">Live Weekly Wholesale Price Index (₹ / MT)</h3>
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span>Tata Tiscon 550D Rebars (12mm):</span>
                  <strong className="text-amber-300">₹53,500 / Ton</strong>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span>Jindal Panther Fe 550D:</span>
                  <strong className="text-amber-300">₹52,200 / Ton</strong>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span>SAIL ISMC 150 Channel:</span>
                  <strong className="text-amber-300">₹56,800 / Ton</strong>
                </div>
                <div className="flex justify-between">
                  <span>APL Apollo 50x50 Hollow Tube:</span>
                  <strong className="text-amber-300">₹58,500 / Ton</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Category Attributes Config */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Customizable Steel Category Attributes (PRD Section 13 & 20)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {CATEGORIES_DATA.map((cat) => (
                <div key={cat.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="font-bold text-slate-900">{cat.name} ({cat.hindiName})</div>
                  <div className="text-slate-600 text-[11px]">{cat.tagline}</div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {cat.popularSpecs.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
