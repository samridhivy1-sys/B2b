import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Upload, 
  Check, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Calculator, 
  Info
} from 'lucide-react';
import { SteelCategory } from '../types';
import { calculateTmtRebarWeight } from '../utils/steelCalculator';

interface VisualDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProductForRfq: (prefillData: any) => void;
  languageHindi: boolean;
}

interface ShapeItem {
  id: string;
  name: string;
  hindiName: string;
  category: SteelCategory;
  categoryLabel: string;
  svgPath: string;
  commonUses: string;
  standardSizes: string[];
  defaultGrade: string;
  unit: string;
}

const STEEL_SHAPES: ShapeItem[] = [
  {
    id: 'shape-tmt-round',
    name: 'Ribbed Round Bar / TMT Saria',
    hindiName: 'गोल धारीदार सरिया (सूत)',
    category: 'tmt-rebars',
    categoryLabel: 'TMT Rebars',
    svgPath: 'M 30,50 a 20,20 0 1,0 40,0 a 20,20 0 1,0 -40,0',
    commonUses: 'House pillars, foundation mesh, RCC slabs & beams',
    standardSizes: ['8 mm (2.5 Soot)', '10 mm (3 Soot)', '12 mm (4 Soot)', '16 mm (5 Soot)', '20 mm', '25 mm', '32 mm'],
    defaultGrade: 'Fe 550D / Fe 500D',
    unit: 'Tonnes'
  },
  {
    id: 'shape-c-channel',
    name: 'C-Channel (ISMC Section)',
    hindiName: 'सी-चैनल (सी सेक्शन)',
    category: 'structural-steel',
    categoryLabel: 'Structural Steel',
    svgPath: 'M 25,20 L 75,20 L 75,32 L 40,32 L 40,68 L 75,68 L 75,80 L 25,80 Z',
    commonUses: 'Purlins for shed roofs, truck bodies, boundary gate frames',
    standardSizes: ['ISMC 75 (75x40mm)', 'ISMC 100 (100x50mm)', 'ISMC 125', 'ISMC 150 (150x75mm)', 'ISMC 200'],
    defaultGrade: 'IS 2062 E250',
    unit: 'Tonnes'
  },
  {
    id: 'shape-i-beam',
    name: 'I-Beam / Joist (Girdar / ISMB)',
    hindiName: 'आई-बीम / गार्डर (ISMB)',
    category: 'structural-steel',
    categoryLabel: 'Structural Steel',
    svgPath: 'M 20,20 L 80,20 L 80,30 L 56,30 L 56,70 L 80,70 L 80,80 L 20,80 L 20,70 L 44,70 L 44,30 L 20,30 Z',
    commonUses: 'Heavy roof support, industrial shed columns, bridge girders',
    standardSizes: ['ISMB 100', 'ISMB 150', 'ISMB 200', 'ISMB 250', 'ISMB 300', 'ISMB 400'],
    defaultGrade: 'IS 2062 E250',
    unit: 'Tonnes'
  },
  {
    id: 'shape-l-angle',
    name: 'L-Angle / Angle Patti (ISA)',
    hindiName: 'एल-एंगल (पत्ती एंगल)',
    category: 'structural-steel',
    categoryLabel: 'Structural Steel',
    svgPath: 'M 25,20 L 40,20 L 40,65 L 75,65 L 75,80 L 25,80 Z',
    commonUses: 'Roof trusses, tower fabrication, window & door frame corner braces',
    standardSizes: ['25x25x3 mm', '35x35x5 mm', '50x50x6 mm', '65x65x6 mm', '75x75x8 mm', '100x100x10 mm'],
    defaultGrade: 'IS 2062 E250',
    unit: 'Tonnes'
  },
  {
    id: 'shape-square-pipe',
    name: 'Square Hollow Tube (Chauka Pipe)',
    hindiName: 'चौका पाइप (Square Box Pipe)',
    category: 'hollow-sections-pipes',
    categoryLabel: 'MS Pipes & Hollow Sections',
    svgPath: 'M 20,20 L 80,20 L 80,80 L 20,80 Z M 32,32 L 68,32 L 68,68 L 32,68 Z',
    commonUses: 'Grills, railings, rooftop solar structures, sheds, furniture',
    standardSizes: ['20x20 mm', '25x25 mm', '40x40 mm', '50x50 mm', '72x72 mm', '100x100 mm'],
    defaultGrade: 'IS 4923 YSt 210',
    unit: 'Tonnes'
  },
  {
    id: 'shape-flat-plate',
    name: 'Steel Sheet / Flat Plate (Chadar)',
    hindiName: 'स्टील चादर / फ्लैट प्लेट',
    category: 'plates-sheets',
    categoryLabel: 'Plates & Sheets',
    svgPath: 'M 15,35 L 85,35 L 85,65 L 15,65 Z',
    commonUses: 'Storage tanks, truck beds, machinery base plates, shutter gates',
    standardSizes: ['2.0 mm (14 Gauge)', '3.2 mm (10 Gauge)', '5.0 mm', '8.0 mm', '12 mm', '20 mm Heavy Plate'],
    defaultGrade: 'IS 2062 E250 / Commercial',
    unit: 'Tonnes'
  }
];

export const VisualDiscoveryModal: React.FC<VisualDiscoveryModalProps> = ({
  isOpen,
  onClose,
  onSelectProductForRfq,
  languageHindi
}) => {
  const [selectedShape, setSelectedShape] = useState<ShapeItem>(STEEL_SHAPES[0]);
  const [selectedSize, setSelectedSize] = useState<string>(STEEL_SHAPES[0].standardSizes[2]);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);

  if (!isOpen) return null;

  const handleShapeClick = (shape: ShapeItem) => {
    setSelectedShape(shape);
    setSelectedSize(shape.standardSizes[0]);
  };

  const handleSimulatedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImagePreview(url);
      setAnalyzingImage(true);
      setTimeout(() => {
        setAnalyzingImage(false);
        // Auto match to a shape
        setSelectedShape(STEEL_SHAPES[1]); // e.g. matched C-channel
        setSelectedSize('ISMC 150 (150x75mm)');
      }, 1200);
    }
  };

  const handleProceedToRfq = () => {
    onSelectProductForRfq({
      productName: `${selectedShape.name} - ${selectedSize}`,
      productCategory: selectedShape.category,
      grade: selectedShape.defaultGrade,
      dimensionsOrDiameter: selectedSize,
      unit: selectedShape.unit,
      isCustomRequirement: false,
      notes: `Identified via Visual Shape Finder (${selectedShape.hindiName}). Application: ${selectedShape.commonUses}`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-600 text-white">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {languageHindi ? 'विजुअल स्टील पहचान (Visual Shape & Drawing Identifier)' : 'Visual Steel Shape & Product Identifier'}
              </h3>
              <p className="text-xs text-slate-300">
                {languageHindi 
                  ? 'सामग्री का आकार देखकर चुनें या अपनी ड्राइंग / साइट फोटो अपलोड करें'
                  : "Identify your material by cross-sectional geometry or upload a site drawing"}
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Visual Shape Picker Grid */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
              <span>Step 1: Select Cross-Section Shape (आकार चुनें)</span>
              <span className="text-blue-600 font-medium lowercase">Click any cross-section</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {STEEL_SHAPES.map((shape) => {
                const isSelected = selectedShape.id === shape.id;
                return (
                  <button
                    key={shape.id}
                    onClick={() => handleShapeClick(shape)}
                    className={`p-3 rounded-xl border text-center flex flex-col items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    {/* SVG Shape Preview */}
                    <div className="w-16 h-16 flex items-center justify-center bg-slate-900 rounded-lg p-2 mb-2 text-cyan-400 shadow-inner">
                      <svg viewBox="0 0 100 100" className="w-12 h-12 fill-current">
                        <path d={shape.svgPath} />
                      </svg>
                    </div>

                    <div className="text-xs font-bold text-slate-900 line-clamp-1">
                      {shape.name.split('/')[0]}
                    </div>
                    <div className="text-[10px] text-amber-700 font-medium">
                      {shape.hindiName.split('(')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Shape Specification & Dimension Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {/* Left: Shape Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 rounded bg-blue-600 text-white text-xs font-bold">
                  {selectedShape.categoryLabel}
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Grade: <strong className="text-slate-800">{selectedShape.defaultGrade}</strong>
                </span>
              </div>

              <h4 className="text-lg font-bold text-slate-900">
                {selectedShape.name}
              </h4>
              <div className="text-xs font-medium text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
                🇮🇳 {selectedShape.hindiName}
              </div>

              <p className="text-xs text-slate-600">
                <strong>Standard Uses:</strong> {selectedShape.commonUses}
              </p>

              {/* Standard Dimensions selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Dimension / Standard Size (मानक साइज़ चुनें):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedShape.standardSizes.map((sz, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold text-left border transition cursor-pointer flex items-center justify-between ${
                        selectedSize === sz
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span>{sz}</span>
                      {selectedSize === sz && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Upload Drawing or Photo Option */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-blue-600" />
                    Upload Component Photo or Hand Drawing
                  </span>
                  <span className="text-[10px] text-slate-400">Optional</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Have a sample piece or an architectural drawing? Upload here to auto-match suppliers with fabrication capability.
                </p>

                <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSimulatedImageUpload}
                    className="hidden"
                  />
                  {uploadedImagePreview ? (
                    <div className="space-y-1">
                      <img
                        src={uploadedImagePreview}
                        alt="Uploaded Steel Sample"
                        className="w-24 h-24 object-cover rounded-lg border border-slate-300 mx-auto"
                      />
                      <span className="text-[11px] text-emerald-600 font-bold block">
                        Drawing Uploaded Successfully
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-medium text-slate-700">
                        Click to upload photo / drawing
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Supports JPG, PNG, PDF (Max 15MB)
                      </span>
                    </>
                  )}
                </label>

                {analyzingImage && (
                  <div className="mt-2 text-xs text-blue-600 font-semibold flex items-center gap-1.5 animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Analyzing drawing geometry & dimensions...</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-blue-500" />
                  IS 1786 / IS 2062 Mill Standards
                </span>
                <span className="text-emerald-600 font-bold">14 Verified Suppliers nearby</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            Selected: <strong className="text-slate-900">{selectedShape.name} ({selectedSize})</strong>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleProceedToRfq}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <span>{languageHindi ? 'इस आकार के लिए कोट मांगें' : 'Create Requirement / Get Quotes'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
