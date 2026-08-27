import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Building2 
} from 'lucide-react';
import { CRISIS_ALERTS_DATA } from '../data/mockData';
import { SellerProfile } from '../types';

interface CrisisDisruptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellers: SellerProfile[];
  onSelectAlternativeSeller: (seller: SellerProfile) => void;
  languageHindi: boolean;
}

export const CrisisDisruptionModal: React.FC<CrisisDisruptionModalProps> = ({
  isOpen,
  onClose,
  sellers,
  onSelectAlternativeSeller,
  languageHindi
}) => {
  const [selectedHub, setSelectedHub] = useState<string>('Bokaro Steel City');

  if (!isOpen) return null;

  const alternativeSellers = sellers.filter(s => 
    s.city.toLowerCase().includes(selectedHub.toLowerCase()) || 
    s.serviceableDistricts.some(d => d.toLowerCase().includes(selectedHub.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-amber-300 overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-amber-950 text-amber-200 flex items-center justify-between border-b border-amber-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-600 text-slate-950 font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-100">
                {languageHindi ? 'आपूर्ति व्यवधान एवं वैकल्पिक सप्लायर खोज' : 'Crisis & Supply Disruption Resilience Center'}
              </h3>
              <p className="text-xs text-amber-300/80">
                PRD Section 18: Instant backup supplier matching when normal highway logistics or primary mills stall.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-amber-400 hover:text-white hover:bg-amber-900 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-800">
          {/* Active Live Alerts */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Active Regional Supply Chain Advisories</span>
            </div>

            {CRISIS_ALERTS_DATA.map((alert) => (
              <div
                key={alert.id}
                className="p-4 bg-amber-50 rounded-xl border border-amber-200/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{alert.region}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 font-bold text-[10px]">
                    {alert.type}
                  </span>
                </div>
                <p className="text-slate-700">{alert.description}</p>
                <div className="flex flex-wrap gap-2 text-[11px] pt-1 border-t border-amber-200">
                  <span className="font-semibold text-slate-600">Suggested Backup Hubs:</span>
                  {alert.suggestedAlternativeHubs.map((hub, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white font-bold text-blue-700 border border-blue-200">
                      {hub}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Alternative Hub Matcher */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Find Backup Wholesalers by Alternative Steel Hub
                </h4>
                <p className="text-slate-500 text-[11px]">
                  Reroute from unaffected secondary godowns and rail-head stockists.
                </p>
              </div>

              <select
                value={selectedHub}
                onChange={(e) => setSelectedHub(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-800"
              >
                <option value="Bokaro Steel City">Bokaro Steel Hub (SAIL / Tiscon)</option>
                <option value="Ranchi">Ranchi Regional Stockists</option>
                <option value="Dhanbad">Dhanbad Industrial Yard</option>
                <option value="Raipur">Raipur Direct Mill Wholesalers</option>
              </select>
            </div>

            {/* Matching Sellers List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {alternativeSellers.map((seller) => (
                <div
                  key={seller.id}
                  className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-xs transition space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{seller.businessName}</span>
                      <span className="text-emerald-700 font-bold text-[10px]">Stock Ready ✓</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      📍 {seller.city} | Fleet: {seller.ownFleetAvailable ? 'Available' : 'Third-Party'}
                    </div>
                    <div className="text-slate-600 text-[11px] pt-1">
                      Capacity: <strong>{seller.warehouseCapacityTonnes} MT</strong> | {seller.brandsCarried.join(', ')}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectAlternativeSeller(seller);
                      onClose();
                    }}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <span>Request Emergency Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Close Disruption Center
          </button>
        </div>
      </div>
    </div>
  );
};
