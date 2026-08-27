import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  Truck, 
  Clock, 
  PhoneCall, 
  MessageSquare, 
  Check, 
  Download, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  FileCheck2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Quotation, RequirementItem, SellerProfile } from '../types';

interface QuotesComparisonViewProps {
  requirements: RequirementItem[];
  quotes: Quotation[];
  sellers: SellerProfile[];
  onAcceptQuote: (quoteId: string) => void;
  onOpenChat: (requirementId: string, sellerId: string) => void;
  languageHindi: boolean;
}

export const QuotesComparisonView: React.FC<QuotesComparisonViewProps> = ({
  requirements,
  quotes,
  sellers,
  onAcceptQuote,
  onOpenChat,
  languageHindi
}) => {
  const [selectedReqId, setSelectedReqId] = useState<string>(
    requirements[0]?.id || ''
  );
  const [showProformaModal, setShowProformaModal] = useState<Quotation | null>(null);

  const currentReq = requirements.find(r => r.id === selectedReqId) || requirements[0];
  const matchingQuotes = quotes.filter(q => q.requirementId === currentReq?.id);

  // Find lowest landed price
  const lowestPrice = matchingQuotes.length > 0
    ? Math.min(...matchingQuotes.map(q => q.effectiveCostPerUnit))
    : 0;

  // Find fastest delivery
  const fastestDays = matchingQuotes.length > 0
    ? Math.min(...matchingQuotes.map(q => q.deliveryLeadTimeDays))
    : 0;

  const handleWhatsAppClick = (quote: Quotation) => {
    const text = encodeURIComponent(
      `Namaste ${quote.sellerName}, I received your quotation of ₹${quote.grandTotalLandedCost.toLocaleString('en-IN')} on IspatSetu for ${currentReq?.productName} (Qty: ${currentReq?.quantity} ${currentReq?.unit}). I would like to confirm delivery terms.`
    );
    window.open(`https://wa.me/${quote.sellerWhatsapp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-amber-500" />
              {languageHindi ? 'कोट तुलना एवं लैंडेड कॉस्ट विश्लेषक' : 'Multi-Supplier Quote Comparison & Landed Cost Matrix'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {languageHindi ? 'सप्लायर कोट्स की विस्तृत तुलना' : 'Compare Quotations & Landed Costs'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Transparent side-by-side breakdown: Raw Steel Rate + Freight + GST (18%) + Unloading = True Landed Cost.
            </p>
          </div>

          {/* RFQ Selector Dropdown */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-300 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Active RFQ:</span>
            <select
              value={selectedReqId}
              onChange={(e) => setSelectedReqId(e.target.value)}
              className="text-xs font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
            >
              {requirements.map((req) => (
                <option key={req.id} value={req.id}>
                  {req.productName} ({req.quantity} {req.unit} - {req.deliveryLocation.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Requirement Summary Card */}
        {currentReq && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-xs">
                  RFQ #{currentReq.id}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Posted: {new Date(currentReq.createdAt).toLocaleDateString()}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  currentReq.status === 'Quotes Received' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {currentReq.status} ({matchingQuotes.length} Quotes)
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900">
                {currentReq.productName}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span>Quantity: <strong className="text-slate-900">{currentReq.quantity} {currentReq.unit}</strong></span>
                <span>•</span>
                <span>Grade: <strong className="text-slate-900">{currentReq.grade || 'Standard'}</strong></span>
                <span>•</span>
                <span>Delivery To: <strong className="text-slate-900">{currentReq.deliveryLocation.city} ({currentReq.deliveryLocation.pincode})</strong></span>
                <span>•</span>
                <span>Access: <strong className="text-slate-900">{currentReq.deliveryLocation.roadAccess}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Urgency:</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold">
                {currentReq.urgency}
              </span>
            </div>
          </div>
        )}

        {/* Quotes Matrix Comparison Table */}
        {matchingQuotes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Awaiting Quotations from Matched Sellers
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              This requirement has been broadcast to verified stockists in {currentReq?.deliveryLocation.district}. Suppliers typically submit quotes within 30-45 minutes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingQuotes.map((quote) => {
              const isBestPrice = quote.effectiveCostPerUnit === lowestPrice;
              const isFastest = quote.deliveryLeadTimeDays === fastestDays;
              const isAccepted = quote.status === 'Accepted';

              return (
                <div
                  key={quote.id}
                  className={`bg-white rounded-2xl border transition duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
                    isAccepted
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : isBestPrice
                      ? 'border-blue-500 shadow-md ring-1 ring-blue-500/20'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Top Badge Ribbons */}
                  <div className="bg-slate-900 px-4 py-2.5 text-white flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold">{quote.sellerName}</span>
                    </div>
                    {isBestPrice && (
                      <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold uppercase tracking-wider">
                        Lowest Landed Cost
                      </span>
                    )}
                    {isFastest && !isBestPrice && (
                      <span className="px-2 py-0.5 bg-amber-500 text-slate-950 rounded text-[10px] font-bold uppercase tracking-wider">
                        Fastest Delivery
                      </span>
                    )}
                  </div>

                  {/* Supplier Trust Header */}
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">
                        📍 {quote.sellerCity}
                      </span>
                      <span className="text-amber-600 font-bold flex items-center gap-1">
                        ★ {quote.sellerRating} / 5.0
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                        GST: 100% Verified
                      </span>
                      {quote.testCertificateIncluded && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                          Mill Test Cert Included
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing Breakdown Section */}
                  <div className="p-5 space-y-4 flex-1">
                    {/* Grand Landed Total Box */}
                    <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-1">
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                        Total Landed Cost (All inclusive)
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-black text-amber-300">
                          ₹{quote.grandTotalLandedCost.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-300 font-medium">
                          (₹{Math.round(quote.effectiveCostPerUnit).toLocaleString('en-IN')}/{quote.unit})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Includes: Steel + Freight to site + 18% GST + Unloading
                      </div>
                    </div>

                    {/* Granular Cost Breakdown List */}
                    <div className="space-y-2 text-xs border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                      <div className="flex justify-between text-slate-600">
                        <span>Base Material Rate:</span>
                        <strong className="text-slate-900">
                          ₹{quote.basePricePerUnit.toLocaleString('en-IN')} / {quote.unit}
                        </strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Material Subtotal:</span>
                        <span className="font-semibold text-slate-800">
                          ₹{(quote.basePricePerUnit * quote.offeredQuantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Freight & Transportation:</span>
                        <span className="font-semibold text-slate-800">
                          ₹{quote.freightChargesTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Loading / Unloading:</span>
                        <span className="font-semibold text-slate-800">
                          ₹{quote.loadingUnloadingCharges.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 border-t border-slate-200 pt-1">
                        <span>GST (18%):</span>
                        <span className="font-semibold text-slate-800">
                          ₹{quote.taxAmountTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Delivery & Commercial Terms */}
                    <div className="space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Delivery Lead Time: <strong>{quote.deliveryLeadTimeDays} Day(s)</strong> (By {quote.estimatedDeliveryDate})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Price Validity: <strong>{quote.quoteValidityHours} Hours</strong></span>
                      </div>
                      <div className="text-[11px] text-slate-500 pt-1">
                        <strong>Payment:</strong> {quote.paymentTerms}
                      </div>
                      {quote.additionalConditions && (
                        <p className="text-[11px] text-slate-500 italic bg-amber-50 p-2 rounded border border-amber-200/60">
                          "{quote.additionalConditions}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Direct Communication */}
                  <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleWhatsAppClick(quote)}
                        className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>

                      <a
                        href={`tel:${quote.sellerPhone}`}
                        className="py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                        <span>Call Supplier</span>
                      </a>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setShowProformaModal(quote)}
                        className="py-2 px-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition text-center cursor-pointer flex items-center justify-center gap-1"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Proforma PO</span>
                      </button>

                      <button
                        onClick={() => onAcceptQuote(quote.id)}
                        disabled={isAccepted}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-sm ${
                          isAccepted
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                      >
                        {isAccepted ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Accepted</span>
                          </>
                        ) : (
                          <>
                            <span>Accept & Lock</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => onOpenChat(quote.requirementId, quote.sellerId)}
                      className="w-full py-1.5 text-center text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                    >
                      Request Clarification / In-App Message ➔
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Proforma Invoice / PO Preview Modal */}
        {showProformaModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900">B2B Proforma Purchase Order Slip</h3>
                </div>
                <button
                  onClick={() => setShowProformaModal(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Supplier:</span>
                  <strong className="text-slate-900">{showProformaModal.sellerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GSTIN:</span>
                  <span className="font-mono text-slate-800">20AAACM4928L1ZT (Verified)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Buyer:</span>
                  <strong className="text-slate-900">{currentReq?.buyerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Destination:</span>
                  <span className="text-slate-800">{currentReq?.deliveryLocation.city}, {currentReq?.deliveryLocation.district}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm">
                  <span>Grand Total Landed Cost:</span>
                  <span className="text-blue-600">₹{showProformaModal.grandTotalLandedCost.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    alert('Proforma Purchase Order PDF downloaded successfully!');
                    setShowProformaModal(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Formal PO (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
