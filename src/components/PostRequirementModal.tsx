import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Wrench, 
  MapPin, 
  Truck, 
  Calendar, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  Layers, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { 
  SteelCategory, 
  SteelGrade, 
  QuantityUnit, 
  DeliveryRoadAccess, 
  RequirementItem 
} from '../types';
import { CATEGORIES_DATA } from '../data/mockData';
import { lookupLocalTerm } from '../utils/steelCalculator';

interface PostRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRequirement: (reqData: Partial<RequirementItem>) => void;
  initialCategory?: SteelCategory;
  initialCustom?: boolean;
  prefillData?: Partial<RequirementItem>;
  languageHindi: boolean;
}

export const PostRequirementModal: React.FC<PostRequirementModalProps> = ({
  isOpen,
  onClose,
  onSubmitRequirement,
  initialCategory = 'tmt-rebars',
  initialCustom = false,
  prefillData,
  languageHindi
}) => {
  const [activeTab, setActiveTab] = useState<'standard' | 'custom' | 'local-helper'>(
    initialCustom ? 'custom' : 'standard'
  );

  // Form State
  const [category, setCategory] = useState<SteelCategory>(initialCategory);
  const [productName, setProductName] = useState('');
  const [brandPreference, setBrandPreference] = useState('Any Reputed Brand');
  const [grade, setGrade] = useState<string>('Fe 550D');
  const [dimensions, setDimensions] = useState('12 mm (4 Soot)');
  const [lengthMeters, setLengthMeters] = useState('12 meters (Standard length)');
  const [quantity, setQuantity] = useState<number>(5);
  const [unit, setUnit] = useState<QuantityUnit>('Tonnes');
  const [applicationUsage, setApplicationUsage] = useState('');
  const [urgency, setUrgency] = useState<RequirementItem['urgency']>('Immediate (1-2 days)');
  const [requiredDate, setRequiredDate] = useState('2026-09-05');
  const [notes, setNotes] = useState('');

  // Location & Access State
  const [city, setCity] = useState('Bokaro Steel City');
  const [district, setDistrict] = useState('Bokaro');
  const [state, setState] = useState('Jharkhand');
  const [pincode, setPincode] = useState('827001');
  const [landmark, setLandmark] = useState('Near Chas Main Highway');
  const [roadAccess, setRoadAccess] = useState<DeliveryRoadAccess>('6-Wheel Truck (9-12 Ton)');
  const [unloadingAvailable, setUnloadingAvailable] = useState(true);

  // Buyer Contact Info
  const [buyerName, setBuyerName] = useState('Aman Kumar (Civil Contractor)');
  const [buyerPhone, setBuyerPhone] = useState('+91 98765 43210');
  const [buyerType, setBuyerType] = useState<RequirementItem['buyerType']>('Contractor');

  // Custom Fabrication Fields
  const [customThickness, setCustomThickness] = useState<number>(16);
  const [customLength, setCustomLength] = useState<number>(400);
  const [customWidth, setCustomWidth] = useState<number>(400);
  const [holePunching, setHolePunching] = useState<boolean>(true);
  const [surfaceFinishing, setSurfaceFinishing] = useState<any>('Red Oxide Primer');

  // Local helper search
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    if (initialCustom) {
      setActiveTab('custom');
    }
    if (prefillData) {
      if (prefillData.productCategory) setCategory(prefillData.productCategory);
      if (prefillData.productName) setProductName(prefillData.productName);
      if (prefillData.grade) setGrade(prefillData.grade);
      if (prefillData.dimensionsOrDiameter) setDimensions(prefillData.dimensionsOrDiameter);
      if (prefillData.unit) setUnit(prefillData.unit);
      if (prefillData.notes) setNotes(prefillData.notes);
    }
  }, [initialCustom, prefillData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isCustom = activeTab === 'custom';
    const computedName = productName || (
      isCustom 
        ? `Custom ${customThickness}mm Base Plate / Fabricated Steel (${customLength}x${customWidth}mm)`
        : `${brandPreference !== 'Any Reputed Brand' ? brandPreference + ' ' : ''}${category.toUpperCase()} - ${dimensions}`
    );

    const submission: Partial<RequirementItem> = {
      productCategory: category,
      productName: computedName,
      isCustomRequirement: isCustom,
      brandPreference,
      grade,
      dimensionsOrDiameter: isCustom ? `${customThickness}mm Thk x ${customLength}x${customWidth}mm` : dimensions,
      lengthMeters: lengthMeters,
      quantity: Number(quantity),
      unit,
      applicationUsage: applicationUsage || (isCustom ? 'Fabrication Foundation' : 'RCC Construction'),
      deliveryLocation: {
        city,
        district,
        state,
        pincode,
        landmark,
        roadAccess,
        unloadingFacilityAvailable: unloadingAvailable
      },
      requiredByDate: requiredDate,
      urgency,
      notes,
      buyerName,
      buyerPhone,
      buyerType,
      customSpecs: isCustom ? {
        material: `IS 2062 Grade E250 / ${grade}`,
        thicknessMm: customThickness,
        lengthMm: customLength,
        widthMm: customWidth,
        holePunching,
        cuttingAngle: 'CNC Plasma Cut 90 Deg',
        surfaceFinishing
      } : undefined
    };

    onSubmitRequirement(submission);
    onClose();
  };

  const handleSelectLocalTerm = (term: any) => {
    setProductName(`${term.standardTerm}`);
    setDimensions(term.standardSpec);
    if (term.category) setCategory(term.category as SteelCategory);
    setActiveTab('standard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {languageHindi ? 'मांग दर्ज करें (Request Quotes / Post Requirement)' : 'Submit Steel Requirement & Get Supplier Quotes'}
              </h3>
              <p className="text-xs text-slate-300">
                {languageHindi 
                  ? 'अपनी सटीक जरूरत बताएं, 30 मिनट में सत्यापित सप्लायर्स से कोट प्राप्त करें'
                  : 'Broadcast to verified wholesalers & fabricators in your region'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-100 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('standard')}
            className={`flex-1 py-3 text-center flex items-center justify-center gap-2 cursor-pointer transition ${
              activeTab === 'standard'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Standard Catalogue Steel</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-3 text-center flex items-center justify-center gap-2 cursor-pointer transition ${
              activeTab === 'custom'
                ? 'bg-white text-amber-600 border-b-2 border-amber-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Custom Component / Drawing Work</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('local-helper')}
            className={`flex-1 py-3 text-center flex items-center justify-center gap-2 cursor-pointer transition ${
              activeTab === 'local-helper'
                ? 'bg-white text-purple-600 border-b-2 border-purple-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Local Term Helper (सूत / गेज)</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {activeTab === 'local-helper' ? (
            /* Local Terminology Helper Tab */
            <div className="space-y-4">
              <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Rural & Regional Steel Terminology Assistant:</strong> Type local terms like "3 soot", "4 soot", "chadar 10 gauge", "girdar", or "angle patti" to automatically convert to standard mill engineering specifications.
                </div>
              </div>

              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search colloquial name (e.g. 3 soot saria, girdar, chauka pipe)..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />

              <div className="space-y-2">
                {lookupLocalTerm(localSearch).map((term, idx) => (
                  <div 
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-slate-200 hover:border-purple-500 hover:shadow-xs transition flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900">
                        {term.localTerm} <span className="text-purple-600 font-normal">({term.hindiScript})</span>
                      </div>
                      <div className="text-xs text-slate-600">
                        Standard: <strong className="text-blue-600">{term.standardTerm}</strong> — {term.notes}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectLocalTerm(term)}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold cursor-pointer shrink-0"
                    >
                      Use Spec
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form id="requirement-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Product Specifications */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  1. Material & Technical Specifications
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Steel Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as SteelCategory)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      {CATEGORIES_DATA.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Brand Preference */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Brand Preference
                    </label>
                    <select
                      value={brandPreference}
                      onChange={(e) => setBrandPreference(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Any Reputed Brand">Any Reputed Primary Brand</option>
                      <option value="Tata Tiscon">Tata Tiscon (Primary)</option>
                      <option value="Jindal Panther">Jindal Panther (JSPL)</option>
                      <option value="SAIL">SAIL (Steel Authority of India)</option>
                      <option value="JSW Neosteel">JSW Neosteel</option>
                      <option value="APL Apollo">APL Apollo (Pipes/Tubes)</option>
                      <option value="Kamdhenu">Kamdhenu Steel</option>
                      <option value="Shyam Steel">Shyam Steel</option>
                      <option value="Local Secondary Mill">Secondary Re-roller (Budget)</option>
                    </select>
                  </div>

                  {/* Grade */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Grade / Standard
                    </label>
                    <input
                      type="text"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="e.g. Fe 550D, Fe 500, IS 2062 E250"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Dimensions or Diameter */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Diameter / Dimensions *
                    </label>
                    <input
                      type="text"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      placeholder="e.g. 12 mm, 16 mm, ISMC 150, 50x50x2.5mm"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Quantity & Unit */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Required Quantity *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0.1"
                        step="any"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-2/3 px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                        required
                      />
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value as QuantityUnit)}
                        className="w-1/3 px-2 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                      >
                        <option value="Tonnes">Tonnes (MT)</option>
                        <option value="Kg">Kg</option>
                        <option value="Pieces">Pieces</option>
                        <option value="Bundles">Bundles</option>
                        <option value="Meters">Meters</option>
                      </select>
                    </div>
                  </div>

                  {/* Length / Cutting specification */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Length / Custom Cutting
                    </label>
                    <select
                      value={lengthMeters}
                      onChange={(e) => setLengthMeters(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="12 meters (Standard length)">12 Meters (Standard Factory Length)</option>
                      <option value="6 meters (Half length)">6 Meters (Half Length for easier transport)</option>
                      <option value="Custom Cut to Size">Custom Cut to Size (as per drawing)</option>
                      <option value="Coil Form">Coil / Bundle Form</option>
                    </select>
                  </div>
                </div>

                {/* Custom Component specific box */}
                {activeTab === 'custom' && (
                  <div className="mt-4 p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                      <Wrench className="w-4 h-4 text-amber-600" />
                      <span>Custom Component Parameters & CNC Fabrication:</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Plate Thickness (mm)
                        </label>
                        <input
                          type="number"
                          value={customThickness}
                          onChange={(e) => setCustomThickness(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded border border-amber-300 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Length (mm)
                        </label>
                        <input
                          type="number"
                          value={customLength}
                          onChange={(e) => setCustomLength(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded border border-amber-300 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Width (mm)
                        </label>
                        <input
                          type="number"
                          value={customWidth}
                          onChange={(e) => setCustomWidth(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded border border-amber-300 text-xs bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={holePunching}
                          onChange={(e) => setHolePunching(e.target.checked)}
                          className="rounded text-amber-600"
                        />
                        <span>CNC Bolt Hole Punching / Drilling Required</span>
                      </label>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">Finish:</span>
                        <select
                          value={surfaceFinishing}
                          onChange={(e) => setSurfaceFinishing(e.target.value)}
                          className="px-2 py-1 rounded border border-amber-300 text-xs bg-white"
                        >
                          <option value="Self Colour / Bare">Self Colour (Bare Mild Steel)</option>
                          <option value="Red Oxide Primer">Red Oxide Primer Coated</option>
                          <option value="Hot Dip Galvanized">Hot Dip Galvanized</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Delivery & Road Access (Critical for Rural) */}
              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  2. Delivery Location & Road Accessibility
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Town / City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      District *
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {/* Road Access */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-slate-500" />
                      Road Access / Maximum Vehicle Allowed *
                    </label>
                    <select
                      value={roadAccess}
                      onChange={(e) => setRoadAccess(e.target.value as DeliveryRoadAccess)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Heavy Trailer (20-40 Ton)">Heavy Trailer (20-40 Ton - Wide Highway)</option>
                      <option value="10-Wheel Truck (15-20 Ton)">10-Wheel Truck (15-20 Ton - Standard Road)</option>
                      <option value="6-Wheel Truck (9-12 Ton)">6-Wheel Truck (9-12 Ton - Town/Mandi Road)</option>
                      <option value="Small Commercial / Pick-up (1-3 Ton)">Small Commercial / Pick-up (1-3 Ton)</option>
                      <option value="Narrow Village Road">Narrow Village / Kaccha Road</option>
                    </select>
                  </div>

                  {/* Delivery Urgency */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Delivery Urgency
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as RequirementItem['urgency'])}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Immediate (1-2 days)">Immediate (Dispatch within 1-2 days)</option>
                      <option value="Within 1 week">Within 1 week</option>
                      <option value="Within 2-3 weeks">Within 2-3 weeks (Project phase)</option>
                      <option value="Planning Phase">Planning / Rate Inquiry</option>
                    </select>
                  </div>
                </div>

                {/* Additional site notes */}
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Site Delivery Notes / Unloading Details
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Need weighbridge slip from yard, unloading crane available on site"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Section 3: Buyer Details */}
              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
                  3. Contact Information (For Direct Seller Quotes)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Name / Business Name *
                    </label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp / Mobile Number *
                    </label>
                    <input
                      type="text"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Buyer Category
                    </label>
                    <select
                      value={buyerType}
                      onChange={(e) => setBuyerType(e.target.value as RequirementItem['buyerType'])}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                    >
                      <option value="Contractor">Civil Contractor</option>
                      <option value="Fabricator">Fabrication Workshop</option>
                      <option value="Retailer">Steel / Hardware Retailer</option>
                      <option value="Individual Builder">Individual Home Builder</option>
                      <option value="Small Industry">Small Manufacturer</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Quotes will be matched with 4+ verified wholesalers</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="requirement-form"
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{languageHindi ? 'कोट मांगें (Broadcast RFQ)' : 'Broadcast Requirement & Get Quotes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
