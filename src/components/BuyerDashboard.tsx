import React from 'react';
import { 
  FileText, 
  Plus, 
  Scale, 
  Clock, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  MessageSquare, 
  PhoneCall, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { RequirementItem, Quotation } from '../types';

interface BuyerDashboardProps {
  requirements: RequirementItem[];
  quotes: Quotation[];
  onOpenPostModal: () => void;
  onViewQuotes: (reqId: string) => void;
  onOpenChat: (reqId: string, sellerId?: string) => void;
  languageHindi: boolean;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  requirements,
  quotes,
  onOpenPostModal,
  onViewQuotes,
  onOpenChat,
  languageHindi
}) => {
  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              {languageHindi ? 'खरीदार पोर्टल' : 'Buyer Procurement Center'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {languageHindi ? 'मेरी मांग एवं सक्रिय कोट्स' : 'My Steel Requirements (RFQs)'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Track broadcast requirements, incoming supplier bids, and compare landed costs.
            </p>
          </div>

          <button
            onClick={onOpenPostModal}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{languageHindi ? 'नई मांग दर्ज करें' : 'Post New Requirement'}</span>
          </button>
        </div>

        {/* Requirements List */}
        {requirements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Requirements Posted Yet</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Post your steel specifications or upload a drawing to receive direct quotations from verified regional wholesalers.
            </p>
            <button
              onClick={onOpenPostModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
            >
              Post Your First RFQ
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {requirements.map((req) => {
              const reqQuotes = quotes.filter(q => q.requirementId === req.id);
              const lowestQuote = reqQuotes.length > 0
                ? reqQuotes.reduce((min, q) => q.effectiveCostPerUnit < min.effectiveCostPerUnit ? q : min, reqQuotes[0])
                : null;

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold font-mono">
                        RFQ #{req.id}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm">{req.productName}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        req.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : reqQuotes.length > 0
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {reqQuotes.length > 0 ? `${reqQuotes.length} Quotes Received` : 'Broadcast Open'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Quantity & Spec</span>
                      <strong className="text-slate-900 text-sm">{req.quantity} {req.unit}</strong>
                      <div className="text-slate-600">{req.dimensionsOrDiameter} | {req.grade || 'Standard Grade'}</div>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Delivery Destination</span>
                      <div className="font-bold text-slate-900">{req.deliveryLocation.city}, {req.deliveryLocation.district}</div>
                      <div className="text-slate-500">Access: {req.deliveryLocation.roadAccess}</div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Lowest Landed Quote</span>
                      {lowestQuote ? (
                        <div>
                          <span className="text-base font-black text-emerald-700">
                            ₹{lowestQuote.grandTotalLandedCost.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-slate-600 block">
                            by {lowestQuote.sellerName}
                          </span>
                        </div>
                      ) : (
                        <div className="text-amber-700 font-medium pt-1">
                          Awaiting supplier bids...
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Posted on {new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onOpenChat(req.id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>Messages</span>
                      </button>

                      {reqQuotes.length > 0 && (
                        <button
                          onClick={() => onViewQuotes(req.id)}
                          className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>Compare {reqQuotes.length} Quotes</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
