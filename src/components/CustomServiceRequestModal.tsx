import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  X,
  Check,
  Scissors,
  Upload,
  Ruler,
  Truck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';

export const CustomServiceRequestModal: React.FC = () => {
  const {
    isCustomRequestOpen,
    setIsCustomRequestOpen,
    tailors,
    selectedTailorId,
    measurementProfiles,
    createOrderRequest,
    setSelectedOrderId,
    setCurrentView,
  } = useApp();

  const [step, setStep] = useState(1);

  // Form State
  const [serviceType, setServiceType] = useState<'New Clothing' | 'Alteration' | 'Repair' | 'Custom Design'>('New Clothing');
  const [garmentType, setGarmentType] = useState('Blouse');
  const [requirements, setRequirements] = useState(
    'Need a boat-neck blouse with elbow-length sleeves and padding. Golden border piping along neckline.'
  );
  const [referenceImageUrl, setReferenceImageUrl] = useState(
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'
  );
  const [measurementMode, setMeasurementMode] = useState<'saved' | 'new'>('saved');
  const [selectedProfileId, setSelectedProfileId] = useState(
    measurementProfiles[0]?.id || ''
  );
  const [customMeasurements, setCustomMeasurements] = useState({
    bust: 34,
    waist: 28,
    hip: 36,
    shoulder: 14,
    sleeveLength: 17,
    blouseLength: 14,
  });
  const [deliveryOption, setDeliveryOption] = useState<
    'Pickup from tailor' | 'Home delivery' | 'Customer pickup'
  >('Home delivery');
  const [deliveryAddress, setDeliveryAddress] = useState(
    'Flat 3B, Sri Maruthi Apartments, Santhanathapuram, Pudukkottai - 622001'
  );

  if (!isCustomRequestOpen) return null;

  const targetTailor = tailors.find((t) => t.id === selectedTailorId);
  if (!targetTailor) return null;

  const serviceOptions: Array<'New Clothing' | 'Alteration' | 'Repair' | 'Custom Design'> = [
    'New Clothing',
    'Alteration',
    'Repair',
    'Custom Design',
  ];

  const garmentOptions = [
    'Blouse',
    'Saree',
    'Shirt',
    'Pant',
    'Kurti',
    'Salwar',
    'Lehenga',
    'Dress',
    'Suit',
  ];

  const samplePrompts = [
    'Boat-neck blouse with elbow sleeves and subtle zari piping.',
    'Slim-fit cotton shirt with Italian collar and pocket.',
    'Churidar salwar suit with deep front neck and lining.',
    'Saree fall stitching with handmade silk thread tassels.',
    'Formal trousers with flat front and 38-inch length.',
  ];

  const sampleReferences = [
    {
      title: 'Boat Neck Designer',
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Traditional Aari Work',
      url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Crisp Bespoke Cut',
      url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const handleNext = () => {
    if (step < 7) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    const selectedProfile = measurementProfiles.find((p) => p.id === selectedProfileId);

    const newOrderId = await createOrderRequest({
      tailorId: targetTailor.id,
      serviceType,
      garmentType,
      requirements,
      referenceImages: referenceImageUrl ? [referenceImageUrl] : [],
      measurementProfileName:
        measurementMode === 'saved'
          ? selectedProfile?.profileName || 'Saved Profile'
          : 'Custom Entered Measurements',
      measurements:
        measurementMode === 'saved'
          ? selectedProfile?.measurements || customMeasurements
          : customMeasurements,
      deliveryOption,
      deliveryAddress: deliveryOption === 'Home delivery' ? deliveryAddress : undefined,
      totalAmount: targetTailor.startingPrice + 200,
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setIsCustomRequestOpen(false);
    setSelectedOrderId(newOrderId);
    setCurrentView('track-order');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Step {step} of 7
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500">{targetTailor.shopName}</span>
            </div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mt-0.5">
              Custom Tailoring Request
            </h2>
          </div>

          <button
            onClick={() => setIsCustomRequestOpen(false)}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 h-1.5">
          <div
            className="bg-amber-800 h-full transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Step 1 — Select Service
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  What type of tailoring work are you looking for today?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {serviceOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setServiceType(opt)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      serviceType === opt
                        ? 'border-amber-800 bg-amber-50/70 shadow-xs ring-2 ring-amber-800/20'
                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-stone-900">{opt}</span>
                      {serviceType === opt && <Check className="w-4 h-4 text-amber-800" />}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      {opt === 'New Clothing' && 'Full bespoke stitching with fresh fabric.'}
                      {opt === 'Alteration' && 'Resizing, sleeve adjustments, tucks & hem.'}
                      {opt === 'Repair' && 'Zipper replacement, tears, hook fixes.'}
                      {opt === 'Custom Design' && 'Designer cuts, bridal embroidery & sketches.'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Select Garment */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Step 2 — Select Garment
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Which piece of clothing would you like stitched or altered?
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {garmentOptions.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGarmentType(g)}
                    className={`p-3 rounded-xl border text-center font-medium text-xs transition-all ${
                      garmentType === g
                        ? 'border-amber-800 bg-amber-50/80 text-amber-900 font-bold shadow-xs'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Requirements */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Step 3 — Requirements
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Describe your specifications, necklines, sleeves, linings, and fit preferences.
                </p>
              </div>

              <textarea
                rows={4}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="“Need a boat-neck blouse with elbow-length sleeves and padding…”"
                className="w-full text-xs sm:text-sm p-3.5 border border-stone-300 rounded-2xl focus:outline-none focus:border-amber-800 leading-relaxed text-stone-800"
              />

              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-stone-500 block">
                  Quick Prompt Suggestions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {samplePrompts.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setRequirements(p)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-left transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Upload Reference */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Step 4 — Upload Reference
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Upload or select design inspiration, neckline styles, or fabric photos.
                </p>
              </div>

              <div className="border-2 border-dashed border-stone-200 rounded-2xl p-5 text-center bg-stone-50/50 hover:bg-stone-50 transition-colors">
                <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-stone-700">
                  Drag & Drop design sketch or garment photo
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">Supports JPG, PNG, PDF up to 10MB</p>
                <input
                  type="text"
                  placeholder="Or paste an image URL..."
                  value={referenceImageUrl}
                  onChange={(e) => setReferenceImageUrl(e.target.value)}
                  className="mt-3 w-full text-xs p-2 border border-stone-200 rounded-xl bg-white focus:outline-none focus:border-amber-800"
                />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-stone-500 block">
                  Or pick a curated style reference:
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {sampleReferences.map((ref, idx) => (
                    <div
                      key={idx}
                      onClick={() => setReferenceImageUrl(ref.url)}
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                        referenceImageUrl === ref.url
                          ? 'border-amber-800 shadow-md ring-2 ring-amber-800/20'
                          : 'border-transparent hover:opacity-80'
                      }`}
                    >
                      <img
                        src={ref.url}
                        alt={ref.title}
                        className="w-full h-20 object-cover"
                      />
                      <p className="text-[10px] p-1 text-center bg-stone-900 text-white truncate">
                        {ref.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Measurements */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Step 5 — Measurements
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Use your saved profile or enter new numbers for this garment.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setMeasurementMode('saved')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    measurementMode === 'saved'
                      ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  Use Saved Measurements
                </button>
                <button
                  onClick={() => setMeasurementMode('new')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    measurementMode === 'new'
                      ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  Enter New Measurements
                </button>
              </div>

              {measurementMode === 'saved' ? (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-stone-700 block">
                    Select Measurement Profile:
                  </span>
                  {measurementProfiles.map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedProfileId === p.id
                          ? 'border-amber-800 bg-amber-50/70 ring-1 ring-amber-800'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="profile"
                          checked={selectedProfileId === p.id}
                          onChange={() => setSelectedProfileId(p.id)}
                          className="accent-amber-800"
                        />
                        <div>
                          <div className="text-xs font-bold text-stone-900">{p.profileName}</div>
                          <div className="text-[11px] text-stone-500">
                            Bust: {p.measurements.bust}" • Waist: {p.measurements.waist}" • Shoulder:{' '}
                            {p.measurements.shoulder}"
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-stone-400">{p.updatedAt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(customMeasurements).map(([key, val]) => (
                    <div key={key} className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')} (in)
                      </label>
                      <input
                        type="number"
                        value={val}
                        onChange={(e) =>
                          setCustomMeasurements({
                            ...customMeasurements,
                            [key]: Number(e.target.value),
                          })
                        }
                        className="w-full text-xs p-2 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-800"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Delivery */}
          {step === 6 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Step 6 — Delivery Mode
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  How would you prefer to collect your tailored garment?
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    key: 'Home delivery',
                    title: 'Doorstep Home Delivery',
                    desc: 'Delivered directly to your home once stitching & pressing are complete.',
                  },
                  {
                    key: 'Pickup from tailor',
                    title: 'Pickup from Boutique Workshop',
                    desc: `Visit ${targetTailor.shopName} for an in-person trial fitting.`,
                  },
                  {
                    key: 'Customer pickup',
                    title: 'Scheduled Trial Pickup',
                    desc: 'Reserve a fitting room trial slot when collecting.',
                  },
                ].map((opt) => (
                  <label
                    key={opt.key}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      deliveryOption === opt.key
                        ? 'border-amber-800 bg-amber-50/70 ring-1 ring-amber-800'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryOption === opt.key}
                      onChange={() => setDeliveryOption(opt.key as any)}
                      className="mt-1 accent-amber-800"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{opt.title}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {deliveryOption === 'Home delivery' && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-stone-700">
                    Delivery Address:
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-800"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 7: Review Request */}
          {step === 7 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Step 7 — Review Request
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Confirm your details before sending the request to {targetTailor.shopName}.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs">
                <div className="flex justify-between border-b border-stone-200/60 pb-2">
                  <span className="text-stone-500">Tailor</span>
                  <span className="font-bold text-stone-900">{targetTailor.shopName}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/60 pb-2">
                  <span className="text-stone-500">Service & Garment</span>
                  <span className="font-bold text-stone-900">
                    {serviceType} • {garmentType}
                  </span>
                </div>
                <div className="border-b border-stone-200/60 pb-2">
                  <span className="text-stone-500 block mb-1">Requirements</span>
                  <p className="text-stone-800 italic">“{requirements}”</p>
                </div>
                <div className="flex justify-between border-b border-stone-200/60 pb-2">
                  <span className="text-stone-500">Measurements</span>
                  <span className="font-semibold text-stone-800">
                    {measurementMode === 'saved' ? 'Saved Profile' : 'New Custom Entry'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-stone-200/60 pb-2">
                  <span className="text-stone-500">Delivery Method</span>
                  <span className="font-semibold text-stone-800">{deliveryOption}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-bold">
                  <span className="text-stone-900">Estimated Base Price</span>
                  <span className="text-amber-800">₹{targetTailor.startingPrice + 200}</span>
                </div>
              </div>

              <p className="text-[11px] text-stone-500 text-center">
                The tailor will review your measurements and send an itemized quotation before cutting starts.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/80 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-200 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Request</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
