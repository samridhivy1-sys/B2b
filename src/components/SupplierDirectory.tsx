import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  MessageSquare, 
  Truck, 
  Building2, 
  CheckCircle2, 
  Wrench, 
  Star, 
  FileText,
  Search,
  Filter,
  Layers
} from 'lucide-react';
import { SellerProfile, SteelCategory } from '../types';

interface SupplierDirectoryProps {
  sellers: SellerProfile[];
  onSelectSupplierForRfq: (seller: SellerProfile) => void;
  languageHindi: boolean;
}

export const SupplierDirectory: React.FC<SupplierDirectoryProps> = ({
  sellers,
  onSelectSupplierForRfq,
  languageHindi
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyGstVerified, setOnlyGstVerified] = useState(false);
  const [onlyCustomFabricators, setOnlyCustomFabricators] = useState(false);
  const [selectedSellerDetail, setSelectedSellerDetail] = useState<SellerProfile | null>(null);

  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch = 
      seller.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.brandsCarried.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'all' || 
      seller.categoriesSupplied.includes(selectedCategory as SteelCategory);

    const matchesGst = !onlyGstVerified || seller.isGstVerified;
    const matchesFab = !onlyCustomFabricators || seller.customFabricationAvailable;

    return matchesSearch && matchesCategory && matchesGst && matchesFab;
  });

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {languageHindi ? 'सत्यापित स्टील थोक विक्रेता एवं स्टॉकधारी' : 'Verified Wholesalers & Authorized Stockists'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {languageHindi ? 'विश्वसनीय सप्लायर डायरेक्टरी' : 'Find Verified Steel Suppliers'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Connect with audited primary distributors, mini mills, and custom steel fabricators.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search supplier name, city, district or brand (e.g. Tata, Bokaro, Raipur)..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
              >
                <option value="all">All Categories Supplied</option>
                <option value="tmt-rebars">TMT Rebars (Saria)</option>
                <option value="structural-steel">Structural Steel (Beams/Channels)</option>
                <option value="hollow-sections-pipes">MS Pipes & Tubes</option>
                <option value="plates-sheets">Plates & Sheets</option>
                <option value="custom-fabrication">Custom Fabrication</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyGstVerified}
                onChange={(e) => setOnlyGstVerified(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>100% GST Verified Sellers</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyCustomFabricators}
                onChange={(e) => setOnlyCustomFabricators(e.target.checked)}
                className="rounded text-amber-600"
              />
              <span>Has Custom CNC / Fabrication Workshop</span>
            </label>
          </div>
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSellers.map((seller) => (
            <div
              key={seller.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Header Banner */}
                <div className="p-4 bg-slate-900 text-white flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={seller.avatarUrl}
                      alt={seller.ownerName}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-slate-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-white">{seller.businessName}</h3>
                        {seller.isGstVerified && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-700/60">
                            GST ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-1">{seller.tagline}</p>
                      <div className="text-[11px] text-amber-300 font-semibold mt-0.5">
                        Prop: {seller.ownerName} ({seller.yearsInBusiness}+ years in business)
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{seller.rating}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">({seller.reviewCount} deals)</div>
                  </div>
                </div>

                {/* Seller Details Body */}
                <div className="p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <strong>{seller.city}, {seller.state}</strong>
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      GST: {seller.gstNumber}
                    </span>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {seller.badges.map((b, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-semibold">
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Brands & Capacity */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Carried Brands</span>
                      <strong className="text-[11px]">{seller.brandsCarried.join(', ')}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Warehouse Stock</span>
                      <strong className="text-[11px]">{seller.warehouseCapacityTonnes} MT Capacity</strong>
                    </div>
                  </div>

                  {/* Serviceable Areas */}
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">
                      Serviceable Districts (Within {seller.maxDeliveryRadiusKm} km)
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {seller.serviceableDistricts.map((dst, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                          {dst}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
                <a
                  href={`tel:${seller.phone}`}
                  className="py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                  <span>Call Yard</span>
                </a>

                <button
                  onClick={() => onSelectSupplierForRfq(seller)}
                  className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Request Direct Quote</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
