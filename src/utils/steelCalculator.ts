export interface LocalTerminologyMapping {
  localTerm: string;
  hindiScript: string;
  standardTerm: string;
  standardSpec: string;
  category: string;
  notes: string;
}

export const LOCAL_TERMINOLOGY_DICTIONARY: LocalTerminologyMapping[] = [
  {
    localTerm: '3 Soot Saria',
    hindiScript: '3 सूत सरिया',
    standardTerm: '10 mm TMT Rebar',
    standardSpec: '10 mm Dia (Fe 500D/550D)',
    category: 'tmt-rebars',
    notes: 'Commonly used in residential slabs and lintels (1 Soot ≈ 3.175 mm or 1/8 inch).'
  },
  {
    localTerm: '4 Soot Saria',
    hindiScript: '4 सूत सरिया',
    standardTerm: '12 mm TMT Rebar',
    standardSpec: '12 mm Dia (Fe 500D/550D)',
    category: 'tmt-rebars',
    notes: 'Main load-bearing bar for residential RCC columns and beams.'
  },
  {
    localTerm: '5 Soot Saria',
    hindiScript: '5 सूत सरिया',
    standardTerm: '16 mm TMT Rebar',
    standardSpec: '16 mm Dia (Fe 500D/550D)',
    category: 'tmt-rebars',
    notes: 'Heavy foundation, commercial pillars, and retaining walls.'
  },
  {
    localTerm: '2.5 Soot Saria',
    hindiScript: '2.5 सूत सरिया',
    standardTerm: '8 mm TMT Rebar',
    standardSpec: '8 mm Dia (Fe 500D)',
    category: 'tmt-rebars',
    notes: 'Stirrups/Rings (Chhalla) and slab distribution steel.'
  },
  {
    localTerm: 'Girdar / Beam',
    hindiScript: 'गिरदर / गार्डर',
    standardTerm: 'ISMB / Joist (I-Beam)',
    standardSpec: 'ISMB 100 to ISMB 250',
    category: 'structural-steel',
    notes: 'Used in roof spanning, shed construction, crane gantries.'
  },
  {
    localTerm: 'Channel / C-Section',
    hindiScript: 'चैनल',
    standardTerm: 'ISMC (Medium Weight Channel)',
    standardSpec: 'ISMC 75, 100, 125, 150',
    category: 'structural-steel',
    notes: 'Purlins, truck bodies, gates, shed framing.'
  },
  {
    localTerm: 'Angle Patti / L-Angle',
    hindiScript: 'एंगल पत्ती',
    standardTerm: 'ISA (Equal/Unequal Angle)',
    standardSpec: '25x25x3 to 100x100x10 mm',
    category: 'structural-steel',
    notes: 'Roof trusses, tower fabrication, door frames.'
  },
  {
    localTerm: 'Chadar (10 Gauge)',
    hindiScript: 'चादर 10 गेज',
    standardTerm: 'HR Sheet (3.2 mm thick)',
    standardSpec: '3.2 mm Hot Rolled Sheet',
    category: 'plates-sheets',
    notes: 'Truck bodies, storage tanks, hopper fabrication.'
  },
  {
    localTerm: 'Chadar (14 Gauge)',
    hindiScript: 'चादर 14 गेज',
    standardTerm: 'HR / CR Sheet (2.0 mm thick)',
    standardSpec: '2.0 mm Sheet',
    category: 'plates-sheets',
    notes: 'Industrial doors, electrical panels, shutters.'
  },
  {
    localTerm: 'Chequered Plate / Patti',
    hindiScript: 'चेकर्ड प्लेट',
    standardTerm: 'Chequered Floor Plate',
    standardSpec: 'IS 3502 (3mm to 8mm)',
    category: 'plates-sheets',
    notes: 'Anti-skid flooring for staircases, trailers, walkways.'
  },
  {
    localTerm: 'Chauka Pipe / Box Pipe',
    hindiScript: 'चौका पाइप / बॉक्स पाइप',
    standardTerm: 'Square Hollow Section (SHS)',
    standardSpec: '25x25mm to 100x100mm ERW',
    category: 'hollow-sections-pipes',
    notes: 'Furniture, shed columns, gate grills, greenhouse frames.'
  },
  {
    localTerm: 'Gol Pipe / Pani/Structure Pipe',
    hindiScript: 'गोल पाइप',
    standardTerm: 'Round Hollow Section / MS Pipe',
    standardSpec: '1/2 inch to 6 inch NB (Class A, B, C)',
    category: 'hollow-sections-pipes',
    notes: 'Scaffolding, borewell casing, fluid transport, railings.'
  },
  {
    localTerm: 'Bandhan Taar / 18 Gauge',
    hindiScript: 'बंधन तार (18/20 गेज)',
    standardTerm: 'MS Binding Wire (Annealed)',
    standardSpec: '18 Gauge (1.2 mm) / 20 Gauge (0.9 mm)',
    category: 'binding-wire-mesh',
    notes: 'Tying rebar intersections before concrete pouring.'
  }
];

export function lookupLocalTerm(query: string): LocalTerminologyMapping[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  return LOCAL_TERMINOLOGY_DICTIONARY.filter(item => 
    item.localTerm.toLowerCase().includes(q) ||
    item.hindiScript.includes(q) ||
    item.standardTerm.toLowerCase().includes(q) ||
    item.standardSpec.toLowerCase().includes(q) ||
    item.notes.toLowerCase().includes(q)
  );
}

export function calculateTmtRebarWeight(diameterMm: number, lengthMeters: number = 12): number {
  // Standard IS 1786 formula: Weight (kg/m) = d² / 162.28
  const weightPerMeter = (diameterMm * diameterMm) / 162.28;
  return Number((weightPerMeter * lengthMeters).toFixed(3));
}

export function calculateLandedCost(params: {
  basePricePerTon: number;
  quantityTonnes: number;
  distanceKm: number;
  freightRatePerTonKm?: number; // default approx ₹3.5 per ton-km or minimum ₹800/ton for local
  loadingUnloadingPerTon?: number;
  gstRate?: number;
}) {
  const {
    basePricePerTon,
    quantityTonnes,
    distanceKm,
    freightRatePerTonKm = 4.2,
    loadingUnloadingPerTon = 350,
    gstRate = 0.18
  } = params;

  // Base raw material cost
  const rawMaterialTotal = basePricePerTon * quantityTonnes;

  // Minimum base freight for short rural distances is ₹600/ton
  const calculatedFreightPerTon = Math.max(600, distanceKm * freightRatePerTonKm);
  const totalFreight = calculatedFreightPerTon * quantityTonnes;

  const totalLoadingUnloading = loadingUnloadingPerTon * quantityTonnes;

  // Taxable subtotal
  const taxableSubtotal = rawMaterialTotal + totalFreight + totalLoadingUnloading;
  const gstAmount = taxableSubtotal * gstRate;
  const grandTotal = taxableSubtotal + gstAmount;
  const effectiveCostPerTon = grandTotal / quantityTonnes;

  return {
    rawMaterialTotal: Math.round(rawMaterialTotal),
    totalFreight: Math.round(totalFreight),
    totalLoadingUnloading: Math.round(totalLoadingUnloading),
    taxableSubtotal: Math.round(taxableSubtotal),
    gstAmount: Math.round(gstAmount),
    grandTotal: Math.round(grandTotal),
    effectiveCostPerTon: Math.round(effectiveCostPerTon)
  };
}
