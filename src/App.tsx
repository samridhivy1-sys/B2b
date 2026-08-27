import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductCatalogueView } from './components/ProductCatalogueView';
import { SupplierDirectory } from './components/SupplierDirectory';
import { BuyerDashboard } from './components/BuyerDashboard';
import { QuotesComparisonView } from './components/QuotesComparisonView';
import { SellerDashboard } from './components/SellerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PostRequirementModal } from './components/PostRequirementModal';
import { VisualDiscoveryModal } from './components/VisualDiscoveryModal';
import { SellerMatchingModal } from './components/SellerMatchingModal';
import { CrisisDisruptionModal } from './components/CrisisDisruptionModal';
import { InquiryChatModal } from './components/InquiryChatModal';

import { 
  INITIAL_PRODUCTS, 
  INITIAL_SELLERS, 
  INITIAL_REQUIREMENTS, 
  INITIAL_QUOTES, 
  INITIAL_MESSAGES 
} from './data/mockData';
import { 
  UserRole, 
  SteelCategory, 
  RequirementItem, 
  Quotation, 
  SteelProduct, 
  SellerProfile, 
  InquiryMessage 
} from './types';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Building2, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  PhoneCall, 
  MessageSquare,
  Scale
} from 'lucide-react';

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>('buyer');
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [languageHindi, setLanguageHindi] = useState<boolean>(false);

  // Core Data State
  const [products, setProducts] = useState<SteelProduct[]>(INITIAL_PRODUCTS);
  const [sellers, setSellers] = useState<SellerProfile[]>(INITIAL_SELLERS);
  const [requirements, setRequirements] = useState<RequirementItem[]>(INITIAL_REQUIREMENTS);
  const [quotes, setQuotes] = useState<Quotation[]>(INITIAL_QUOTES);
  const [messages, setMessages] = useState<InquiryMessage[]>(INITIAL_MESSAGES);

  // Active current wholesaler identity for seller mode
  const currentSeller = sellers[0];

  // Modals state
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [postModalCustom, setPostModalCustom] = useState(false);
  const [postModalCategory, setPostModalCategory] = useState<SteelCategory>('tmt-rebars');
  const [postModalPrefill, setPostModalPrefill] = useState<Partial<RequirementItem> | undefined>();

  const [visualDiscoveryOpen, setVisualDiscoveryOpen] = useState(false);
  const [crisisModalOpen, setCrisisModalOpen] = useState(false);

  const [sellerMatchingOpen, setSellerMatchingOpen] = useState(false);
  const [lastPostedReq, setLastPostedReq] = useState<RequirementItem | null>(null);
  const [lastMatchedSellers, setLastMatchedSellers] = useState<SellerProfile[]>([]);

  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatReqId, setChatReqId] = useState<string | undefined>();
  const [chatSellerId, setChatSellerId] = useState<string | undefined>();

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handler: Open post requirement modal with optional custom/category/prefill
  const handleOpenPostModal = (isCustom: boolean = false, prefillData?: Partial<RequirementItem>) => {
    setPostModalCustom(isCustom);
    setPostModalPrefill(prefillData);
    if (prefillData?.productCategory) {
      setPostModalCategory(prefillData.productCategory);
    }
    setPostModalOpen(true);
  };

  const handleOpenPostModalWithCategory = (catId: SteelCategory) => {
    setPostModalCategory(catId);
    setPostModalCustom(false);
    setPostModalPrefill(undefined);
    setPostModalOpen(true);
  };

  const handleOpenPostModalWithProduct = (product: SteelProduct) => {
    setPostModalCategory(product.category);
    setPostModalCustom(false);
    setPostModalPrefill({
      productName: product.name,
      productCategory: product.category,
      brandPreference: product.brand,
      grade: product.grades[0],
      dimensionsOrDiameter: product.standardSizes[0],
      unit: product.unit,
      notes: `Standard specifications as per catalogue: ${product.bisStandard || 'IS Grade'}`
    });
    setPostModalOpen(true);
  };

  // Handler: Submit Requirement
  const handleSubmitRequirement = (reqData: Partial<RequirementItem>) => {
    const newReqId = `req-${Date.now().toString().slice(-4)}`;
    
    // Find matching sellers
    const matched = sellers.filter(s => 
      s.categoriesSupplied.includes(reqData.productCategory!) || 
      (reqData.isCustomRequirement && s.customFabricationAvailable)
    );

    const newReq: RequirementItem = {
      id: newReqId,
      buyerId: 'buyer-demo-01',
      buyerName: reqData.buyerName || 'Aman Kumar',
      buyerPhone: reqData.buyerPhone || '+91 98765 43210',
      buyerType: reqData.buyerType || 'Contractor',
      productCategory: reqData.productCategory || 'tmt-rebars',
      productName: reqData.productName || 'Steel Requirement',
      isCustomRequirement: !!reqData.isCustomRequirement,
      brandPreference: reqData.brandPreference,
      grade: reqData.grade,
      dimensionsOrDiameter: reqData.dimensionsOrDiameter,
      lengthMeters: reqData.lengthMeters,
      quantity: reqData.quantity || 5,
      unit: reqData.unit || 'Tonnes',
      applicationUsage: reqData.applicationUsage,
      deliveryLocation: reqData.deliveryLocation || {
        city: 'Bokaro Steel City',
        district: 'Bokaro',
        state: 'Jharkhand',
        pincode: '827001',
        roadAccess: '6-Wheel Truck (9-12 Ton)',
        unloadingFacilityAvailable: true
      },
      requiredByDate: reqData.requiredByDate || '2026-09-10',
      urgency: reqData.urgency || 'Immediate (1-2 days)',
      notes: reqData.notes,
      customSpecs: reqData.customSpecs,
      status: 'Open',
      createdAt: new Date().toISOString(),
      matchedSellerIds: matched.map(m => m.id),
      quotesReceivedCount: 0
    };

    setRequirements([newReq, ...requirements]);
    setLastPostedReq(newReq);
    setLastMatchedSellers(matched);
    setSellerMatchingOpen(true);
    showToast(`Requirement RFQ #${newReq.id} broadcast to ${matched.length} verified sellers!`);
  };

  // Handler: Submit Quotation by seller
  const handleSubmitQuote = (quoteData: Partial<Quotation>) => {
    const newQuoteId = `quote-${Date.now().toString().slice(-4)}`;
    const newQuote: Quotation = {
      id: newQuoteId,
      requirementId: quoteData.requirementId!,
      sellerId: quoteData.sellerId!,
      sellerName: quoteData.sellerName!,
      sellerCity: quoteData.sellerCity!,
      sellerRating: quoteData.sellerRating || 4.8,
      isGstVerified: quoteData.isGstVerified ?? true,
      sellerPhone: quoteData.sellerPhone || '+91 94311 28940',
      sellerWhatsapp: quoteData.sellerWhatsapp || '+91 94311 28940',
      productDetails: quoteData.productDetails || 'Steel Material',
      gradeOffered: quoteData.gradeOffered || 'Fe 550D',
      brandOffered: quoteData.brandOffered || 'Tata Tiscon',
      offeredQuantity: quoteData.offeredQuantity || 1,
      unit: quoteData.unit || 'Tonnes',
      basePricePerUnit: quoteData.basePricePerUnit || 52000,
      freightChargesTotal: quoteData.freightChargesTotal || 2000,
      loadingUnloadingCharges: quoteData.loadingUnloadingCharges || 1000,
      gstPercentage: 18,
      taxAmountTotal: quoteData.taxAmountTotal || 10000,
      grandTotalLandedCost: quoteData.grandTotalLandedCost || 65000,
      effectiveCostPerUnit: quoteData.effectiveCostPerUnit || 65000,
      deliveryLeadTimeDays: quoteData.deliveryLeadTimeDays || 2,
      estimatedDeliveryDate: quoteData.estimatedDeliveryDate || '2026-08-30',
      quoteValidityHours: quoteData.quoteValidityHours || 48,
      validUntil: quoteData.validUntil || new Date(Date.now() + 172800000).toISOString(),
      paymentTerms: quoteData.paymentTerms || '50% Advance + 50% on Dispatch',
      testCertificateIncluded: quoteData.testCertificateIncluded ?? true,
      additionalConditions: quoteData.additionalConditions,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setQuotes([newQuote, ...quotes]);
    
    // Update requirement status
    setRequirements(requirements.map(r => {
      if (r.id === newQuote.requirementId) {
        return {
          ...r,
          status: 'Quotes Received',
          quotesReceivedCount: r.quotesReceivedCount + 1
        };
      }
      return r;
    }));

    showToast(`Quotation of ₹${newQuote.grandTotalLandedCost.toLocaleString('en-IN')} sent to buyer!`);
  };

  // Handler: Accept Quote
  const handleAcceptQuote = (quoteId: string) => {
    setQuotes(quotes.map(q => ({
      ...q,
      status: q.id === quoteId ? 'Accepted' : q.status
    })));
    showToast('Quote accepted! Proforma Purchase Order generated.');
  };

  // Handler: Add Product to Catalogue
  const handleAddProduct = (prodData: Partial<SteelProduct>) => {
    const newProd: SteelProduct = {
      id: `prod-${Date.now().toString().slice(-4)}`,
      name: prodData.name || 'New Steel Product',
      category: prodData.category || 'tmt-rebars',
      categoryLabel: prodData.categoryLabel || 'Steel',
      brand: prodData.brand || 'Primary Mill',
      image: prodData.image || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80',
      grades: prodData.grades || ['Fe 550D'],
      standardSizes: prodData.standardSizes || ['Standard Size'],
      unit: prodData.unit || 'Tonnes',
      indicativePricePerUnit: prodData.indicativePricePerUnit,
      pricingType: prodData.pricingType || 'indicative',
      minOrderQuantity: prodData.minOrderQuantity || 1,
      moqUnit: prodData.moqUnit || 'Tonnes',
      description: prodData.description || 'Quality steel product.',
      applications: prodData.applications || ['Construction'],
      customFabricationAvailable: !!prodData.customFabricationAvailable
    };

    setProducts([newProd, ...products]);
    showToast(`Product "${newProd.name}" added to catalogue!`);
  };

  // Handler: Open Chat Modal
  const handleOpenChat = (reqId: string, sellerId?: string) => {
    setChatReqId(reqId);
    setChatSellerId(sellerId);
    setChatModalOpen(true);
  };

  // Handler: Send Message
  const handleSendMessage = (text: string) => {
    const activeReq = requirements.find(r => r.id === chatReqId);
    const newMsg: InquiryMessage = {
      id: `msg-${Date.now()}`,
      requirementId: chatReqId || 'general',
      senderId: userRole === 'buyer' ? 'buyer-demo-01' : currentSeller.id,
      senderName: userRole === 'buyer' ? 'Aman Kumar (Buyer)' : currentSeller.businessName,
      senderRole: userRole === 'buyer' ? 'buyer' : 'seller',
      receiverId: userRole === 'buyer' ? (chatSellerId || currentSeller.id) : (activeReq?.buyerId || 'buyer-demo-01'),
      text,
      timestamp: new Date().toISOString(),
      isRead: true
    };

    setMessages([...messages, newMsg]);
  };

  // Handler: Admin toggle verify seller
  const handleToggleVerifySeller = (sellerId: string) => {
    setSellers(sellers.map(s => {
      if (s.id === sellerId) {
        const updated = !s.isGstVerified;
        showToast(`${s.businessName} is now ${updated ? 'GST Verified ✓' : 'Unverified'}`);
        return { ...s, isGstVerified: updated };
      }
      return s;
    }));
  };

  const activeChatRequirement = requirements.find(r => r.id === chatReqId);
  const activeChatSeller = sellers.find(s => s.id === chatSellerId) || sellers[0];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl border border-blue-500 shadow-2xl flex items-center gap-3 animate-slide-up text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header / Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={setUserRole}
        openPostModal={(isCustom) => handleOpenPostModal(isCustom)}
        openVisualDiscovery={() => setVisualDiscoveryOpen(true)}
        activeQuotesCount={quotes.length}
        openCrisisModal={() => setCrisisModalOpen(true)}
        languageHindi={languageHindi}
        setLanguageHindi={setLanguageHindi}
      />

      {/* Page Content View Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div className="space-y-0">
            {/* Primary Hero Search with Local Terminology Guide */}
            <HeroSearch
              onSearch={(query) => {
                setCurrentTab('products');
              }}
              openPostModal={handleOpenPostModal}
              openVisualDiscovery={() => setVisualDiscoveryOpen(true)}
              languageHindi={languageHindi}
            />

            {/* Core Categories Bento Grid */}
            <CategoryGrid
              onSelectCategory={(catId) => {
                setCurrentTab('products');
              }}
              openPostModalWithCategory={handleOpenPostModalWithCategory}
              languageHindi={languageHindi}
            />

            {/* How It Works B2B Procurement Journey (PRD Section 1 & 31) */}
            <section className="py-12 bg-slate-900 text-white border-b border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                    B2B Lead-Gen & Procurement Infrastructure
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                    How IspatSetu Works for Buyers & Wholesalers
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2">
                    Simple, transparent workflow designed specifically for steel materials rather than a standard retail cart.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <h3 className="font-bold text-sm text-slate-100">Specify Requirement</h3>
                    <p className="text-xs text-slate-400">
                      Enter product, brand preference, grade (Fe 550D, IS 2062), quantity, site delivery pincode & road accessibility.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <h3 className="font-bold text-sm text-slate-100">Verified Seller Matching</h3>
                    <p className="text-xs text-slate-400">
                      System matches your RFQ with 100% GST-verified stockists within your delivery radius and truck access limits.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <h3 className="font-bold text-sm text-slate-100">Landed Cost Comparison</h3>
                    <p className="text-xs text-slate-400">
                      Compare multi-supplier quotations side-by-side: Material rate + Freight + 18% GST + Unloading = True Landed Cost.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                      4
                    </div>
                    <h3 className="font-bold text-sm text-slate-100">Connect & Procure</h3>
                    <p className="text-xs text-slate-400">
                      Direct WhatsApp link, yard call, or generate formal Proforma Purchase Order with test certificate assurance.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Custom Fabrication & Drawing Work Callout (PRD Section 10) */}
            <section className="py-12 bg-slate-950 text-white border-b border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-slate-700 flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="space-y-3 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800 text-amber-300 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>PRD Feature: Can't Find The Exact Product?</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black">
                      Custom CNC Base Plates, Beams Cutting & Drawing RFQ
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Not every steel requirement is a standard 12m bar. Submit custom drawings, plate thicknesses, bolt hole drilling pitch, or welded trusses directly to certified fabrication yards.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                    <button
                      onClick={() => setVisualDiscoveryOpen(true)}
                      className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>Visual Shape Identifier</span>
                    </button>

                    <button
                      onClick={() => handleOpenPostModal(true)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition"
                    >
                      <span>Post Custom Drawing RFQ</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentTab === 'products' && (
          <ProductCatalogueView
            products={products}
            onOpenPostModalWithProduct={handleOpenPostModalWithProduct}
            languageHindi={languageHindi}
          />
        )}

        {currentTab === 'suppliers' && (
          <SupplierDirectory
            sellers={sellers}
            onSelectSupplierForRfq={(seller) => {
              handleOpenPostModal(false, {
                brandPreference: seller.brandsCarried[0],
                notes: `Direct inquiry for supplier ${seller.businessName}`
              });
            }}
            languageHindi={languageHindi}
          />
        )}

        {currentTab === 'my-requirements' && (
          <BuyerDashboard
            requirements={requirements}
            quotes={quotes}
            onOpenPostModal={() => handleOpenPostModal(false)}
            onViewQuotes={(reqId) => {
              setCurrentTab('quotes-compare');
            }}
            onOpenChat={(reqId, sellerId) => handleOpenChat(reqId, sellerId)}
            languageHindi={languageHindi}
          />
        )}

        {currentTab === 'quotes-compare' && (
          <QuotesComparisonView
            requirements={requirements}
            quotes={quotes}
            sellers={sellers}
            onAcceptQuote={handleAcceptQuote}
            onOpenChat={(reqId, sellerId) => handleOpenChat(reqId, sellerId)}
            languageHindi={languageHindi}
          />
        )}

        {currentTab === 'seller-dashboard' && (
          <SellerDashboard
            currentSeller={currentSeller}
            requirements={requirements}
            quotes={quotes}
            products={products}
            onSubmitQuote={handleSubmitQuote}
            onAddProduct={handleAddProduct}
            onOpenChat={(reqId, buyerId) => handleOpenChat(reqId, buyerId)}
            languageHindi={languageHindi}
          />
        )}

        {currentTab === 'admin-dashboard' && (
          <AdminDashboard
            sellers={sellers}
            requirements={requirements}
            quotes={quotes}
            onToggleVerifySeller={handleToggleVerifySeller}
            languageHindi={languageHindi}
          />
        )}
      </main>

      {/* Global Modals */}
      <PostRequirementModal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        onSubmitRequirement={handleSubmitRequirement}
        initialCategory={postModalCategory}
        initialCustom={postModalCustom}
        prefillData={postModalPrefill}
        languageHindi={languageHindi}
      />

      <VisualDiscoveryModal
        isOpen={visualDiscoveryOpen}
        onClose={() => setVisualDiscoveryOpen(false)}
        onSelectProductForRfq={(prefill) => {
          handleOpenPostModal(false, prefill);
        }}
        languageHindi={languageHindi}
      />

      <SellerMatchingModal
        isOpen={sellerMatchingOpen}
        onClose={() => setSellerMatchingOpen(false)}
        requirement={lastPostedReq}
        matchedSellers={lastMatchedSellers}
        onGoToQuotes={(reqId) => {
          setCurrentTab('quotes-compare');
        }}
        languageHindi={languageHindi}
      />

      <CrisisDisruptionModal
        isOpen={crisisModalOpen}
        onClose={() => setCrisisModalOpen(false)}
        sellers={sellers}
        onSelectAlternativeSeller={(seller) => {
          handleOpenPostModal(false, {
            brandPreference: seller.brandsCarried[0],
            notes: `Emergency alternative supply request routed from ${seller.city} stock yard.`
          });
        }}
        languageHindi={languageHindi}
      />

      <InquiryChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        requirement={activeChatRequirement}
        seller={activeChatSeller}
        messages={messages}
        onSendMessage={handleSendMessage}
        currentUserRole={userRole === 'seller' ? 'seller' : 'buyer'}
      />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-white text-sm">IspatSetu (इस्पात सेतु)</span>
            <span>— B2B Steel Procurement & Quotation Infrastructure</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-slate-500">BIS IS 1786 / IS 2062 Mill Standards</span>
            <span className="text-slate-500">100% GST Verified Wholesalers</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
