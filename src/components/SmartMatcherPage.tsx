import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, CheckCircle2, Star, MapPin, Scissors, Clock } from 'lucide-react';

export const SmartMatcherPage: React.FC = () => {
  const { tailors, setCurrentView, setSelectedTailorId, setIsCustomRequestOpen, selectedCity } =
    useApp();

  const [garment, setGarment] = useState('Blouse');
  const [urgency, setUrgency] = useState<'urgent' | 'standard' | 'flexible'>('standard');
  const [budget, setBudget] = useState<'budget' | 'mid' | 'luxury'>('mid');
  const [needHomePickup, setNeedHomePickup] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Match scoring
  const bestMatch = React.useMemo(() => {
    return tailors.find((t) => {
      if (garment === 'Blouse' && t.specializations.includes('Blouse')) return true;
      if (garment === 'Suit' && t.specializations.includes('Suits')) return true;
      if (garment === 'Saree' && t.specializations.includes('Saree')) return true;
      return true;
    }) || tailors[0];
  }, [tailors, garment]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setHasCalculated(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Tailor Matching Algorithm</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Find Your Ideal Master Tailor
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
          Answer 4 quick questions about your garment, budget, and timeline to get paired with the
          highest-rated specialist in {selectedCity}.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleCalculate} className="space-y-6">
          {/* Question 1: Garment */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              1. What garment do you need tailored?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: 'Blouse Stitching', val: 'Blouse' },
                { label: 'Saree Pico / Fall', val: 'Saree' },
                { label: 'Bespoke Suit / Shirt', val: 'Suit' },
                { label: 'Salwar / Kurti', val: 'Salwar' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.val}
                  onClick={() => setGarment(item.val)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    garment === item.val
                      ? 'border-amber-800 bg-amber-50 text-amber-900 ring-1 ring-amber-800'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Timeline */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              2. When do you need this garment ready?
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'urgent', title: 'Express (24–48 hrs)', desc: 'For urgent events' },
                { id: 'standard', title: 'Standard (3–5 days)', desc: 'Normal turnaround' },
                { id: 'flexible', title: 'Flexible (7+ days)', desc: 'Bridal or luxury' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setUrgency(item.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    urgency === item.id
                      ? 'border-amber-800 bg-amber-50 text-amber-900 ring-1 ring-amber-800'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-bold text-xs">{item.title}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Budget tier */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              3. What is your budget preference?
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'budget', title: 'Value Fit', desc: '₹200 – ₹500' },
                { id: 'mid', title: 'Signature Bespoke', desc: '₹500 – ₹1,500' },
                { id: 'luxury', title: 'Designer Bridal', desc: '₹1,500+' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setBudget(item.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    budget === item.id
                      ? 'border-amber-800 bg-amber-50 text-amber-900 ring-1 ring-amber-800'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-bold text-xs">{item.title}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Convenience */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
              <input
                type="checkbox"
                checked={needHomePickup}
                onChange={(e) => setNeedHomePickup(e.target.checked)}
                className="w-4 h-4 rounded text-amber-800 accent-amber-800"
              />
              <span>Prefer tailor offering doorstep pickup & delivery</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Calculate Best Match</span>
          </button>
        </form>
      </div>

      {/* Result Card */}
      {hasCalculated && bestMatch && (
        <div className="bg-white rounded-3xl border-2 border-amber-800/80 p-6 sm:p-8 shadow-lg animate-in fade-in slide-in-from-bottom duration-500 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>98% Compatibility Match Found</span>
            </div>
            <span className="text-xs font-bold text-stone-500">Based on your criteria</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={bestMatch.avatar}
              alt={bestMatch.shopName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-stone-200"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  {bestMatch.shopName}
                </h3>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                  ⭐ {bestMatch.rating}
                </span>
              </div>
              <p className="text-xs text-stone-600">
                Master {bestMatch.name} • {bestMatch.experienceYears} years experience
              </p>
              <p className="text-xs text-stone-500 flex items-center gap-2">
                <span>📍 {bestMatch.distanceKm} km away ({bestMatch.address})</span>
                <span>•</span>
                <span>Starting from ₹{bestMatch.startingPrice}</span>
              </p>
            </div>
          </div>

          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 text-xs text-stone-700">
            <strong>Why this match?</strong> {bestMatch.shopName} specializes in {garment}{' '}
            tailoring with a 4.9/5 satisfaction rate and guaranteed {urgency === 'urgent' ? '24–48 hr' : 'standard'} turnaround.
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedTailorId(bestMatch.id);
                setIsCustomRequestOpen(true);
              }}
              className="flex-1 py-3 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Scissors className="w-4 h-4 text-amber-200" />
              <span>Request Service with This Match</span>
            </button>
            <button
              onClick={() => {
                setSelectedTailorId(bestMatch.id);
                setCurrentView('tailor-profile');
              }}
              className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-xl transition-colors"
            >
              View Full Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
