import React, { useState } from 'react';
import { 
  Store, 
  Plus, 
  CheckCircle2, 
  Send, 
  Truck, 
  ShieldCheck, 
  Layers, 
  FileText, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare,
  AlertTriangle,
  Building2,
  Settings,
  ChevronRight
} from 'lucide-react';
import { 
  RequirementItem, 
  Quotation, 
  SteelProduct, 
  SellerProfile, 
  SteelCategory, 
  PricingType 
} from '../types';
import { calculateLandedCost } from '../utils/steelCalculator';

interface SellerDashboardProps {
  currentSeller: SellerProfile;
  requirements: RequirementItem[];
  quotes: Quotation[];
  products: SteelProduct[];
  onSubmitQuote: (quoteData: Partial<Quotation>) => void;
  onAddProduct: (productData: Partial<SteelProduct>) => void;
  onOpenChat: (reqId: string, buyerId: string) => void;
  languageHindi: boolean;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  currentSeller,
  requirements,
  quotes,
  products,
  onSubmitQuote,
  onAddProduct,
  onOpenChat,
  languageHindi
}) => {
  const [activeTab, setActiveTab] = useState<'incoming-rfqs' | 'my-catalogue' | 'sent-quotes' | 'profile-settings'>('incoming-rfqs');
  const [selectedReqForQuote, setSelectedReqForQuote] = useState<RequirementItem | null>(null);

  // Quote Submission Modal Form
  const [basePrice, setBasePrice] = useState<number>(52500);
  const [freightCharges, setFreightCharges] = useState<number>(2400);
  const [unloadingCharges, setUnloadingCharges] = useState<number>(1200);
  const [leadTimeDays, setLeadTimeDays] = useState<number>(1);
  const [validityHours, setValidityHours] = useState<number>(48);
  const [paymentTerms, setPaymentTerms] = useState<any>('50% Advance + 50% on Dispatch');
  const [includeTestCert, setIncludeTestCert] = useState<boolean>(true);
  const [sellerRemarks, setSellerRemarks] = useState('Fresh mill stock available with computerized weighbridge slip.');

  // Add Product Form State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<SteelCategory>('tmt-rebars');
  const [newProdBrand, setNewProdBrand] = useState('Tata Tiscon');
  const [newProdPrice, setNewProdPrice] = useState<number>(53000);
  const [newProdPricingType, setNewProdPricingType] = useState<PricingType>('indicative');
  const [newProdMoq, setNewProdMoq] = useState<number>(1);

  // Filter incoming RFQs matching seller categories & districts
  const incomingRfqs = requirements.filter(req => 
    currentSeller.categoriesSupplied.includes(req.productCategory) || req.isCustomRequirement
  );

  const sentQuotesByThisSeller = quotes.filter(q => q.sellerId === currentSeller.id);

  // Calculate live landed totals for quote modal
  const quantity = selectedReqForQuote?.quantity || 1;
  const isTon = selectedReqForQuote?.unit === 'Tonnes';
  const subtotalMaterial = basePrice * quantity;
  const taxableTotal = subtotalMaterial + freightCharges + unloadingCharges;
  const gstAmount = Math.round(taxableTotal * 0.18);
  const grandTotal = Math.round(taxableTotal + gstAmount);
  const effectiveRate = Math.round(grandTotal / quantity);

  const handleOpenQuoteModal = (req: RequirementItem) => {
    setSelectedReqForQuote(req);
    // Set realistic base price default based on category
    if (req.productCategory === 'tmt-rebars') setBasePrice(52800);
    else if (req.productCategory === 'structural-steel') setBasePrice(56500);
    else if (req.productCategory === 'hollow-sections-pipes') setBasePrice(58000);
    else if (req.isCustomRequirement) setBasePrice(1650); // piece rate
    else setBasePrice(54000);
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqForQuote) return;

    const newQuote: Partial<Quotation> = {
      requirementId: selectedReqForQuote.id,
      sellerId: currentSeller.id,
      sellerName: currentSeller.businessName,
      sellerCity: `${currentSeller.city} (${currentSeller.district})`,
      sellerRating: currentSeller.rating,
      isGstVerified: currentSeller.isGstVerified,
      sellerPhone: currentSeller.phone,
      sellerWhatsapp: currentSeller.whatsapp,
      productDetails: `${selectedReqForQuote.productName} (${selectedReqForQuote.dimensionsOrDiameter})`,
      gradeOffered: selectedReqForQuote.grade || 'Fe 550D',
      brandOffered: selectedReqForQuote.brandPreference || 'Tata Tiscon',
      offeredQuantity: selectedReqForQuote.quantity,
      unit: selectedReqForQuote.unit,
      basePricePerUnit: Number(basePrice),
      freightChargesTotal: Number(freightCharges),
      loadingUnloadingCharges: Number(unloadingCharges),
      gstPercentage: 18,
      taxAmountTotal: gstAmount,
      grandTotalLandedCost: grandTotal,
      effectiveCostPerUnit: effectiveRate,
      deliveryLeadTimeDays: Number(leadTimeDays),
      estimatedDeliveryDate: new Date(Date.now() + leadTimeDays * 86400000).toISOString().split('T')[0],
      quoteValidityHours: Number(validityHours),
      validUntil: new Date(Date.now() + validityHours * 3600000).toISOString(),
      paymentTerms,
      testCertificateIncluded: includeTestCert,
      additionalConditions: sellerRemarks,
      status: 'Pending'
    };

    onSubmitQuote(newQuote);
    setSelectedReqForQuote(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct({
      name: newProdName,
      category: newProdCategory,
      categoryLabel: newProdCategory.toUpperCase(),
      brand: newProdBrand,
      indicativePricePerUnit: newProdPrice,
      pricingType: newProdPricingType,
      minOrderQuantity: newProdMoq,
      moqUnit: 'Tonnes',
      description: 'Maintained in prime stock at regional warehouse.',
      applications: ['General Construction', 'Structural Framing'],
      customFabricationAvailable: currentSeller.customFabricationAvailable,
      grades: ['Fe 550D', 'IS 2062 E250'],
      standardSizes: ['Standard Mill Lengths'],
      unit: 'Tonnes',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'
    });
    setShowAddProductModal(false);
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Wholesaler Header */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8 border border-slate-800 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-2xl shrink-0">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black">{currentSeller.businessName}</h1>
                  <span className="px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 text-[10px] font-bold border border-emerald-700/50">
                    GST VERIFIED
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">{currentSeller.tagline}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                  <span>📍 {currentSeller.city}, {currentSeller.state}</span>
                  <span>•</span>
                  <span>Fleet: <strong>Own Heavy & 6-Wheel Trucks</strong></span>
                  <span>•</span>
                  <span>Rating: <strong className="text-amber-300">★ {currentSeller.rating} ({currentSeller.reviewCount} deals)</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-slate-800/90 px-4 py-2.5 rounded-xl border border-slate-700 text-center">
                <div className="text-[10px] uppercase text-slate-400 font-bold">Incoming RFQs</div>
                <div className="text-xl font-black text-amber-400">{incomingRfqs.length}</div>
              </div>
              <div className="bg-slate-800/90 px-4 py-2.5 rounded-xl border border-slate-700 text-center">
                <div className="text-[10px] uppercase text-slate-400 font-bold">Quotes Sent</div>
                <div className="text-xl font-black text-blue-400">{sentQuotesByThisSeller.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 text-xs font-bold text-slate-600 gap-2 mb-6 shadow-xs">
          <button
            onClick={() => setActiveTab('incoming-rfqs')}
            className={`py-3.5 px-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'incoming-rfqs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Incoming Buyer Requirements ({incomingRfqs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sent-quotes')}
            className={`py-3.5 px-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'sent-quotes'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Submitted Quotes ({sentQuotesByThisSeller.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my-catalogue')}
            className={`py-3.5 px-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'my-catalogue'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Catalogue & Stock ({products.length})</span>
          </button>
        </div>

        {/* Tab 1: Incoming RFQs */}
        {activeTab === 'incoming-rfqs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Active B2B Steel Leads in Your Region
              </h2>
              <span className="text-xs text-slate-500">
                Auto-matched by delivery radius ({currentSeller.maxDeliveryRadiusKm} km)
              </span>
            </div>

            {incomingRfqs.map((req) => {
              const alreadyQuoted = sentQuotesByThisSeller.some(q => q.requirementId === req.id);

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
                      <span className="text-xs font-semibold text-slate-500">
                        Buyer: <strong className="text-slate-900">{req.buyerName}</strong> ({req.buyerType})
                      </span>
                      {req.isCustomRequirement && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Custom Drawing / Fabrication
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>Urgency: <strong className="text-amber-600">{req.urgency}</strong></span>
                      <span>•</span>
                      <span>Needed by: {req.requiredByDate}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="text-slate-400 font-semibold uppercase text-[10px]">Product & Specs</div>
                      <div className="font-bold text-slate-900 text-sm">{req.productName}</div>
                      <div className="text-slate-600">Grade: <strong>{req.grade || 'Standard'}</strong> | Size: {req.dimensionsOrDiameter}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-slate-400 font-semibold uppercase text-[10px]">Quantity & Use</div>
                      <div className="font-bold text-slate-900 text-sm">{req.quantity} {req.unit}</div>
                      <div className="text-slate-600">Application: {req.applicationUsage}</div>
                    </div>

                    <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div className="text-slate-400 font-semibold uppercase text-[10px] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        Delivery Destination & Road Access
                      </div>
                      <div className="font-bold text-slate-900">{req.deliveryLocation.city}, {req.deliveryLocation.district}</div>
                      <div className="text-slate-600">
                        Vehicle allowed: <strong className="text-amber-700">{req.deliveryLocation.roadAccess}</strong>
                      </div>
                    </div>
                  </div>

                  {req.notes && (
                    <div className="text-xs bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60 text-amber-900">
                      <strong>Buyer Note:</strong> {req.notes}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      {req.quotesReceivedCount} other suppliers have quoted
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onOpenChat(req.id, req.buyerId)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>Chat / Clarify</span>
                      </button>

                      {alreadyQuoted ? (
                        <button
                          disabled
                          className="px-4 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1 cursor-default"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Quote Submitted</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenQuoteModal(req)}
                          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Quotation (कोट भेजें)</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Sent Quotes */}
        {activeTab === 'sent-quotes' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">
              Your Active Quotations & Status
            </h2>

            {sentQuotesByThisSeller.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-900">{q.productDetails}</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-600">Qty: {q.offeredQuantity} {q.unit}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Base: ₹{q.basePricePerUnit.toLocaleString('en-IN')}/{q.unit} + Freight: ₹{q.freightChargesTotal} + GST (18%)
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="text-base font-black text-blue-600">
                    ₹{q.grandTotalLandedCost.toLocaleString('en-IN')}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    q.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {q.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Catalogue Management */}
        {activeTab === 'my-catalogue' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Wholesale Product Catalogue & Dynamic Rates
              </h2>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product to Catalogue</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {prod.categoryLabel}
                    </span>
                    <span className="text-xs font-bold text-blue-600">
                      {prod.brand}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">
                    {prod.name}
                  </h3>

                  <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pricing Mode:</span>
                      <strong className="capitalize text-slate-800">{prod.pricingType}</strong>
                    </div>
                    {prod.indicativePricePerUnit && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Indicative Rate:</span>
                        <strong className="text-slate-900">₹{prod.indicativePricePerUnit.toLocaleString('en-IN')}/{prod.unit}</strong>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Min Order Qty (MOQ):</span>
                      <span>{prod.minOrderQuantity} {prod.moqUnit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Submit Quote Form */}
        {selectedReqForQuote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-auto">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Submit Granular Quotation for RFQ #{selectedReqForQuote.id}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Buyer: {selectedReqForQuote.buyerName} | Qty: {selectedReqForQuote.quantity} {selectedReqForQuote.unit}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReqForQuote(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleQuoteSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Base Steel Rate (₹ / {selectedReqForQuote.unit}) *
                    </label>
                    <input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Freight / Transport (Total ₹) *
                    </label>
                    <input
                      type="number"
                      value={freightCharges}
                      onChange={(e) => setFreightCharges(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Loading / Unloading (Total ₹)
                    </label>
                    <input
                      type="number"
                      value={unloadingCharges}
                      onChange={(e) => setUnloadingCharges(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                {/* Auto Calculated Landed Cost Matrix Preview */}
                <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                    <span>Taxable Base: ₹{taxableTotal.toLocaleString('en-IN')}</span>
                    <span>GST (18%): ₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs uppercase text-amber-400">
                      Calculated Landed Cost to Site:
                    </span>
                    <span className="text-xl font-black text-white">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 text-right">
                    (Effective Landed Rate: ₹{effectiveRate.toLocaleString('en-IN')} per {selectedReqForQuote.unit})
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Delivery Lead Time (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={leadTimeDays}
                      onChange={(e) => setLeadTimeDays(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Quote Validity (Hours)
                    </label>
                    <select
                      value={validityHours}
                      onChange={(e) => setValidityHours(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value={24}>24 Hours (Fast volatile market)</option>
                      <option value={48}>48 Hours (Standard)</option>
                      <option value={72}>72 Hours</option>
                      <option value={168}>7 Days</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Payment Terms
                  </label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="50% Advance + 50% on Dispatch">50% Advance + 50% on Dispatch</option>
                    <option value="100% Advance">100% Advance</option>
                    <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                    <option value="15 Days Credit">15 Days Credit (Verified Buyers)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Special Conditions / Yard Note
                  </label>
                  <input
                    type="text"
                    value={sellerRemarks}
                    onChange={(e) => setSellerRemarks(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSelectedReqForQuote(null)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Quote to Buyer</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Product to Catalogue */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h3 className="font-bold text-slate-900">Add Product to Wholesaler Catalogue</h3>
                <button onClick={() => setShowAddProductModal(false)} className="text-slate-400">✕</button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Product Title</label>
                  <input
                    type="text"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. SAIL ISMB 200 Heavy Joist"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1">Category</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value as SteelCategory)}
                      className="w-full p-2 border rounded-lg bg-white"
                    >
                      <option value="tmt-rebars">TMT Rebars</option>
                      <option value="structural-steel">Structural Steel</option>
                      <option value="hollow-sections-pipes">MS Pipes & Tubes</option>
                      <option value="plates-sheets">Plates & Sheets</option>
                      <option value="custom-fabrication">Custom Components</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Brand</label>
                    <input
                      type="text"
                      value={newProdBrand}
                      onChange={(e) => setNewProdBrand(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1">Indicative Price (₹/Ton)</label>
                    <input
                      type="number"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      className="w-full p-2 border rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Pricing Mode</label>
                    <select
                      value={newProdPricingType}
                      onChange={(e) => setNewProdPricingType(e.target.value as PricingType)}
                      className="w-full p-2 border rounded-lg bg-white"
                    >
                      <option value="indicative">Indicative Price</option>
                      <option value="quote-required">Quote Required</option>
                      <option value="fixed">Fixed Price</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
