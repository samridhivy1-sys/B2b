export type UserRole = 'buyer' | 'seller' | 'admin';

export type SteelCategory = 
  | 'tmt-rebars'
  | 'structural-steel'
  | 'hollow-sections-pipes'
  | 'plates-sheets'
  | 'binding-wire-mesh'
  | 'custom-fabrication'
  | 'stainless-steel';

export type SteelGrade = 
  | 'Fe 500'
  | 'Fe 500D'
  | 'Fe 550D'
  | 'Fe 600'
  | 'IS 2062 E250'
  | 'IS 2062 E350'
  | 'IS 4923 YSt 210'
  | 'IS 4923 YSt 310'
  | 'IS 3502'
  | 'ASTM A36'
  | 'SS 304'
  | 'SS 316'
  | 'Commercial Grade'
  | string;

export type QuantityUnit = 'Tonnes' | 'Kg' | 'Pieces' | 'Bundles' | 'Meters';

export type PricingType = 'fixed' | 'indicative' | 'quote-required';

export type DeliveryRoadAccess = 'Heavy Trailer (20-40 Ton)' | '10-Wheel Truck (15-20 Ton)' | '6-Wheel Truck (9-12 Ton)' | 'Small Commercial / Pick-up (1-3 Ton)' | 'Narrow Village Road';

export interface ProductAttribute {
  name: string;
  value: string;
  unit?: string;
}

export interface SteelProduct {
  id: string;
  name: string;
  hindiName?: string;
  category: SteelCategory;
  categoryLabel: string;
  brand: string;
  image: string;
  grades: SteelGrade[];
  standardSizes: string[];
  unit: QuantityUnit;
  indicativePricePerUnit?: number; // e.g. 52000 per Ton
  pricingType: PricingType;
  minOrderQuantity: number;
  moqUnit: QuantityUnit;
  description: string;
  applications: string[];
  weightPerMeterKg?: number;
  bisStandard?: string; // e.g. IS 1786:2008
  customFabricationAvailable: boolean;
}

export interface SellerProfile {
  id: string;
  businessName: string;
  tagline: string;
  ownerName: string;
  sellerType: 'Wholesaler' | 'Authorized Distributor' | 'Stockist & Retailer' | 'Custom Fabricator' | 'Mini Mill';
  city: string;
  state: string;
  pincode: string;
  district: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  gstNumber: string;
  isGstVerified: boolean;
  isBisCertified: boolean;
  isPhysicalYardVerified: boolean;
  yearsInBusiness: number;
  rating: number;
  reviewCount: number;
  serviceableDistricts: string[];
  maxDeliveryRadiusKm: number;
  ownFleetAvailable: boolean;
  customFabricationAvailable: boolean;
  categoriesSupplied: SteelCategory[];
  brandsCarried: string[];
  warehouseCapacityTonnes: number;
  creditTermsAvailable: boolean;
  avatarUrl: string;
  yardImageUrl: string;
  badges: string[];
}

export interface RequirementItem {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerType: 'Contractor' | 'Fabricator' | 'Retailer' | 'Individual Builder' | 'Small Industry';
  productCategory: SteelCategory;
  productName: string;
  isCustomRequirement: boolean;
  brandPreference?: string;
  grade?: SteelGrade | string;
  dimensionsOrDiameter?: string; // e.g. "12 mm", "150x75 ISMC", "10mm thick x 1m x 2m"
  lengthMeters?: number | string;
  quantity: number;
  unit: QuantityUnit;
  applicationUsage?: string;
  deliveryLocation: {
    city: string;
    district: string;
    state: string;
    pincode: string;
    landmark?: string;
    roadAccess: DeliveryRoadAccess;
    unloadingFacilityAvailable: boolean;
  };
  requiredByDate: string;
  urgency: 'Immediate (1-2 days)' | 'Within 1 week' | 'Within 2-3 weeks' | 'Planning Phase';
  notes?: string;
  imageUrl?: string;
  drawingUrl?: string;
  customSpecs?: {
    material: string;
    thicknessMm?: number;
    lengthMm?: number;
    widthMm?: number;
    holePunching?: boolean;
    cuttingAngle?: string;
    surfaceFinishing?: 'Self Colour / Bare' | 'Red Oxide Primer' | 'Hot Dip Galvanized' | 'Epoxy Coated';
  };
  status: 'Open' | 'Matched' | 'Quotes Received' | 'Accepted' | 'Closed';
  createdAt: string;
  matchedSellerIds: string[];
  quotesReceivedCount: number;
}

export interface Quotation {
  id: string;
  requirementId: string;
  sellerId: string;
  sellerName: string;
  sellerCity: string;
  sellerRating: number;
  isGstVerified: boolean;
  sellerPhone: string;
  sellerWhatsapp: string;
  productDetails: string;
  gradeOffered: string;
  brandOffered: string;
  offeredQuantity: number;
  unit: QuantityUnit;
  basePricePerUnit: number; // e.g. ₹51,500/Ton
  freightChargesTotal: number; // e.g. ₹2,500
  loadingUnloadingCharges: number; // e.g. ₹500
  gstPercentage: number; // usually 18%
  taxAmountTotal: number;
  grandTotalLandedCost: number;
  effectiveCostPerUnit: number;
  deliveryLeadTimeDays: number;
  estimatedDeliveryDate: string;
  quoteValidityHours: number;
  validUntil: string;
  paymentTerms: '100% Advance' | '50% Advance + 50% on Dispatch' | 'Cash on Delivery' | '15 Days Credit';
  testCertificateIncluded: boolean;
  additionalConditions?: string;
  status: 'Pending' | 'Shortlisted' | 'Accepted' | 'Rejected' | 'Expired';
  createdAt: string;
}

export interface InquiryMessage {
  id: string;
  requirementId: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'seller';
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface CrisisAlert {
  id: string;
  region: string;
  type: 'Logistics Disruption' | 'Mill Production Shortage' | 'Transport Strike' | 'Monsoon Road Access' | 'Price Volatility';
  description: string;
  affectedRoutes: string[];
  suggestedAlternativeHubs: string[];
  activeDate: string;
}
