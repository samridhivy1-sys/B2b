import React from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  X, 
  Building2 
} from 'lucide-react';
import { RequirementItem, SellerProfile } from '../types';

interface SellerMatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: RequirementItem | null;
  matchedSellers: SellerProfile[];
  onGoToQuotes: (reqId: string) => void;
  languageHindi: boolean;
}

export const SellerMatchingModal: React.FC<SellerMatchingModalProps> = ({
  isOpen,
  onClose,
  requirement,
  matchedSellers,
  onGoToQuotes,
  languageHindi
}) => {
  if (!isOpen || !requirement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {languageHindi ? 'मांग सफलतापूर्वक दर्ज की गई!' : 'Requirement Broadcast to Verified Suppliers'}
              </h3>
              <p className="text-xs text-slate-500">
                RFQ #{requirement.id} • Matched with {matchedSellers.length} verified wholesalers in your delivery area
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matched Sellers Table (PRD Section 11) */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Matched Suppliers in {requirement.deliveryLocation.district} & Surrounding Hubs:
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
            {matchedSellers.map((seller, idx) => (
              <div key={seller.id} className="p-3.5 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span>{seller.businessName}</span>
                      {seller.isGstVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      📍 {seller.city} • Stock: {seller.warehouseCapacityTonnes} MT • ★ {seller.rating}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    High Match
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Fleet: {seller.ownFleetAvailable ? 'Available' : 'Third-Party'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Callouts */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200/80 text-xs text-blue-950 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong>What happens next?</strong> Suppliers review your delivery location ({requirement.deliveryLocation.city}) and vehicle access ({requirement.deliveryLocation.roadAccess}) to compute their lowest landed cost. You will be notified when quotes arrive.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Done
          </button>
          <button
            onClick={() => {
              onGoToQuotes(requirement.id);
              onClose();
            }}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>View Quote Comparison Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
