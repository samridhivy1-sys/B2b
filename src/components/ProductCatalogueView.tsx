import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  Layers, 
  Calculator, 
  Sparkles, 
  Building2,
  Columns3
} from 'lucide-react';
import { SteelProduct, SteelCategory } from '../types';
import { calculateTmtRebarWeight } from '../utils/steelCalculator';

interface ProductCatalogueViewProps {
  products: SteelProduct[];
  onOpenPostModalWithProduct: (product: SteelProduct) => void;
  languageHindi: boolean;
}

export const ProductCatalogueView: React.FC<ProductCatalogueViewProps> = ({
  products,
  onOpenPostModalWithProduct,
  languageHindi
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [calcDia, setCalcDia] = useState<number>(12);
  const [calcLen, setCalcLen] = useState<number>(12);

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.hindiName && p.hindiName.includes(searchQuery));
    return matchesCat && matchesSearch;
  });

  const calculatedRebarWeight = calculateTmtRebarWeight(calcDia, calcLen);

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              {languageHindi ? 'स्टील उत्पाद एवं विनिर्देश कैटलॉग' : 'Product Catalogue & Engineering Specifications'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {languageHindi ? 'मानक स्टील उत्पाद एवं ग्रेड' : 'Standard Steel Products & Grades'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Browse standard structural shapes, rebar diameters, sheets, and request instant quotation matches.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              BIS IS 1786 / IS 2062 Mill Standards
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name, brand (Tata, Jindal, SAIL) or size..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="tmt-rebars">TMT Rebars (Saria)</option>
              <option value="structural-steel">Structural Steel (ISMB/ISMC)</option>
              <option value="hollow-sections-pipes">MS Pipes & Tubes</option>
              <option value="plates-sheets">Plates & Sheets</option>
              <option value="custom-fabrication">Custom Fabrication</option>
            </select>
          </div>
        </div>

        {/* Rebar Weight Calculator Quick Tool */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <Calculator className="w-4 h-4" />
              <span>IS 1786 Standard TMT Rebar Weight Calculator</span>
            </div>
            <h3 className="text-base font-bold text-slate-100">
              Calculate exact bar weight ($d^2/162$) for billing verification
            </h3>
            <p className="text-xs text-slate-400">
              Helps rural buyers verify weighbridge slips against standard engineering formulas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Diameter (mm)</label>
              <select
                value={calcDia}
                onChange={(e) => setCalcDia(Number(e.target.value))}
                className="bg-slate-900 border border-slate-600 rounded px-2.5 py-1 text-white font-bold"
              >
                <option value={8}>8 mm (2.5 Soot)</option>
                <option value={10}>10 mm (3 Soot)</option>
                <option value={12}>12 mm (4 Soot)</option>
                <option value={16}>16 mm (5 Soot)</option>
                <option value={20}>20 mm</option>
                <option value={25}>25 mm</option>
                <option value={32}>32 mm</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Length (Meters)</label>
              <input
                type="number"
                value={calcLen}
                onChange={(e) => setCalcLen(Number(e.target.value))}
                className="w-20 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white font-bold"
              />
            </div>

            <div className="pl-2 border-l border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Calculated Weight</span>
              <span className="text-lg font-black text-amber-300">{calculatedRebarWeight} kg</span>
              <span className="text-[9px] text-slate-400 block">per bar</span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-slate-800 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 text-white text-[10px] font-bold border border-slate-700">
                      {product.brand}
                    </span>
                    {product.bisStandard && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-900/90 text-blue-200 text-[10px] font-bold border border-blue-700">
                        {product.bisStandard}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-tight">
                      {product.name}
                    </h3>
                    {product.hindiName && (
                      <span className="text-xs text-amber-800 font-semibold block mt-0.5">
                        {product.hindiName}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Available Grades:</span>
                      <strong className="text-slate-900">{product.grades.join(', ')}</strong>
                    </div>
                    {product.indicativePricePerUnit && (
                      <div className="flex justify-between items-baseline">
                        <span className="text-slate-500">Indicative Rate:</span>
                        <span className="text-sm font-black text-blue-600">
                          ₹{product.indicativePricePerUnit.toLocaleString('en-IN')} / {product.unit}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Min Order Qty:</span>
                      <span>{product.minOrderQuantity} {product.moqUnit}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Standard Sizes</span>
                    <div className="flex flex-wrap gap-1">
                      {product.standardSizes.map((sz, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono">
                          {sz}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200">
                <button
                  onClick={() => onOpenPostModalWithProduct(product)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Request Quotes for this Steel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
