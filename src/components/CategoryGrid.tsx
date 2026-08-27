import React from 'react';
import { 
  Building2, 
  Layers, 
  Boxes, 
  Wrench, 
  Grid, 
  ArrowRight, 
  CheckCircle2, 
  Columns3
} from 'lucide-react';
import { CATEGORIES_DATA, CategoryMetadata } from '../data/mockData';
import { SteelCategory } from '../types';

interface CategoryGridProps {
  onSelectCategory: (categoryId: SteelCategory) => void;
  openPostModalWithCategory: (categoryId: SteelCategory) => void;
  languageHindi: boolean;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  onSelectCategory,
  openPostModalWithCategory,
  languageHindi
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Columns3':
        return <Columns3 className="w-5 h-5" />;
      case 'Building2':
        return <Building2 className="w-5 h-5" />;
      case 'Boxes':
        return <Boxes className="w-5 h-5" />;
      case 'Layers':
        return <Layers className="w-5 h-5" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5" />;
      case 'Grid':
      default:
        return <Grid className="w-5 h-5" />;
    }
  };

  return (
    <section className="py-10 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              {languageHindi ? 'उत्पाद श्रेणियां' : 'Core Steel Categories'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {languageHindi ? 'अपनी आवश्यकता के अनुसार श्रेणी चुनें' : 'Browse Materials & Request Quotes'}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              {languageHindi 
                ? 'सभी प्रमुख ग्रेड (Fe 500D, Fe 550D, IS 2062, IS 4923) और मानक साइज़ में उपलब्ध।'
                : 'Direct access to wholesale rebar, heavy joists, purlins, hollow pipes, plates and custom components.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>BIS Certified & Mill Test Assured</span>
          </div>
        </div>

        {/* Categories Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES_DATA.map((cat: CategoryMetadata) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition duration-200 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Category Header Image Banner */}
                <div className="relative h-40 overflow-hidden bg-slate-800">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-600 text-white shadow-md">
                        {getCategoryIcon(cat.iconName)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white leading-tight">
                          {cat.name}
                        </h3>
                        {cat.hindiName && (
                          <span className="text-xs text-amber-300 font-medium">
                            {cat.hindiName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {cat.tagline}
                  </p>

                  {/* Popular Sizes / Specs Chips */}
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Standard Specs & Sizes:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.popularSpecs.slice(0, 4).map((spec, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Brands */}
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Key Brands:
                    </div>
                    <div className="text-xs text-slate-700 font-medium">
                      {cat.keyBrands.join(', ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 grid grid-cols-2 gap-2 mt-2 border-t border-slate-100">
                <button
                  onClick={() => onSelectCategory(cat.id)}
                  className="py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer text-center"
                >
                  View Details
                </button>
                <button
                  onClick={() => openPostModalWithCategory(cat.id)}
                  className="py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                >
                  <span>Get Quotes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
