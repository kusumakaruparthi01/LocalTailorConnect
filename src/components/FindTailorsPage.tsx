import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  MapPin,
  Star,
  Clock,
  Filter,
  SlidersHorizontal,
  CheckCircle2,
  Phone,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Home,
  Heart,
  Eye,
  BadgeCheck,
  RotateCcw,
  Scissors,
} from 'lucide-react';

export const FindTailorsPage: React.FC = () => {
  const {
    tailors,
    setCurrentView,
    setSelectedTailorId,
    setIsCustomRequestOpen,
    setIsAppointmentModalOpen,
    selectedCity,
    customer,
    toggleSavedTailor,
  } = useApp();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  const [onlyHomePickup, setOnlyHomePickup] = useState(false);
  const [onlyDelivery, setOnlyDelivery] = useState(false);
  const [minExperience, setMinExperience] = useState<number>(0);

  const servicesList = [
    'All',
    'Blouse Stitching',
    'Saree Alteration',
    'Salwar',
    'Kurti',
    'Men Shirts',
    'Trousers',
    'Bespoke Suits',
    'Bridal Wear',
    'Express Alterations',
  ];

  const filteredTailors = useMemo(() => {
    return tailors.filter((t) => {
      // Search matches name, shop, city, or specializations
      const matchesSearch =
        t.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.specializations.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      // Price filter
      if (t.startingPrice > maxPrice) return false;

      // Rating filter
      if (t.rating < minRating) return false;

      // Experience
      if (t.experienceYears < minExperience) return false;

      // Toggles
      if (onlyAvailableToday && !t.availableToday) return false;
      if (onlyHomePickup && !t.homePickup) return false;
      if (onlyDelivery && !t.deliveryAvailable) return false;

      // Service category
      if (selectedService !== 'All') {
        const hasService =
          t.services.some((s) => s.name.toLowerCase().includes(selectedService.toLowerCase())) ||
          t.specializations.some((s) => s.toLowerCase().includes(selectedService.toLowerCase()));
        if (!hasService) return false;
      }

      return true;
    });
  }, [
    tailors,
    searchTerm,
    maxPrice,
    minRating,
    minExperience,
    onlyAvailableToday,
    onlyHomePickup,
    onlyDelivery,
    selectedService,
  ]);

  const normalizedSelectedCity = selectedCity.trim().toLowerCase();
  const sameCityTailors = filteredTailors.filter(
    (tailor) => tailor.city.trim().toLowerCase() === normalizedSelectedCity
  );
  const otherCityTailors = filteredTailors.filter(
    (tailor) => tailor.city.trim().toLowerCase() !== normalizedSelectedCity
  );
  const orderedTailors = [...sameCityTailors, ...otherCityTailors];

  const handleViewProfile = (tailorId: string) => {
    setSelectedTailorId(tailorId);
    setCurrentView('tailor-profile');
  };

  const handleRequestService = (tailorId: string) => {
    setSelectedTailorId(tailorId);
    setIsCustomRequestOpen(true);
  };

  const handleBookAppointment = (tailorId: string) => {
    setSelectedTailorId(tailorId);
    setIsAppointmentModalOpen(true);
  };

  const handleResetFilters = () => {
    setMaxPrice(3000);
    setMinRating(0);
    setOnlyAvailableToday(false);
    setOnlyHomePickup(false);
    setOnlyDelivery(false);
    setSelectedService('All');
    setMinExperience(0);
    setSearchTerm('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-amber-700" />
            <span>Local Atelier Directory</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
            Find Master Tailors in {selectedCity}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Tailors in <strong className="text-stone-900 font-bold">{selectedCity}</strong> are shown first,
            followed by studios serving other cities.
          </p>
        </div>
      </div>

      {/* Search & Service Filter Ribbon */}
      <div className="space-y-4">
        <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by garment (e.g. blouse, suit), master tailor name, or locality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none bg-transparent"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-stone-500 hover:text-stone-900 px-3 py-1 bg-stone-100 rounded-lg"
            >
              Clear
            </button>
          )}
        </div>

        {/* Horizontal Service Quick Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {servicesList.map((svc) => (
            <button
              key={svc}
              onClick={() => setSelectedService(svc)}
              className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedService === svc
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {svc}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area: Left Sidebar Filters + Right Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wide">
              <SlidersHorizontal className="w-4 h-4 text-amber-800" />
              <span>Filter Ateliers</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-bold text-amber-800 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Price Budget Filter */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-stone-900">
              <span>Starting Price Up To</span>
              <span className="text-amber-800 font-extrabold">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min={200}
              max={5000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-medium">
              <span>₹200</span>
              <span>₹2,500</span>
              <span>₹5,000</span>
            </div>
          </div>

          {/* Rating Filter Buttons */}
          <div className="space-y-2.5 pt-4 border-t border-stone-100">
            <span className="text-xs font-bold text-stone-900 block">Minimum Rating</span>
            <div className="grid grid-cols-3 gap-2">
              {[4.0, 4.5, 4.8].map((rt) => (
                <button
                  key={rt}
                  onClick={() => setMinRating(rt)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                    minRating === rt
                      ? 'bg-amber-800 text-white shadow-xs'
                      : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{rt}+</span>
                </button>
              ))}
            </div>
          </div>

          {/* Experience Filter */}
          <div className="space-y-2.5 pt-4 border-t border-stone-100">
            <span className="text-xs font-bold text-stone-900 block">Tailor Experience</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Any Exp', val: 0 },
                { label: '5+ Years', val: 5 },
                { label: '10+ Years', val: 10 },
                { label: '15+ Years', val: 15 },
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => setMinExperience(item.val)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
                    minExperience === item.val
                      ? 'bg-amber-800 text-white font-bold'
                      : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Convenience & Delivery Toggles */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <span className="text-xs font-bold text-stone-900 block">Service Amenities</span>

            <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer p-1">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Available Today</span>
              </span>
              <input
                type="checkbox"
                checked={onlyAvailableToday}
                onChange={(e) => setOnlyAvailableToday(e.target.checked)}
                className="w-4 h-4 accent-amber-800 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer p-1">
              <span className="flex items-center gap-2">
                <Home className="w-3.5 h-3.5 text-amber-700" />
                <span>Doorstep Measurement</span>
              </span>
              <input
                type="checkbox"
                checked={onlyHomePickup}
                onChange={(e) => setOnlyHomePickup(e.target.checked)}
                className="w-4 h-4 accent-amber-800 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer p-1">
              <span className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-amber-700" />
                <span>Courier Delivery</span>
              </span>
              <input
                type="checkbox"
                checked={onlyDelivery}
                onChange={(e) => setOnlyDelivery(e.target.checked)}
                className="w-4 h-4 accent-amber-800 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-600 bg-white px-5 py-3.5 rounded-2xl border border-stone-200">
            <span>
              <strong className="text-stone-950 font-bold">{sameCityTailors.length}</strong> in {selectedCity}
              {' '}and <strong className="text-stone-950 font-bold">{otherCityTailors.length}</strong> from other cities
            </span>
            <span className="text-[11px] text-stone-500 font-medium">Your city is shown first</span>
          </div>

          {/* Tailor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orderedTailors.map((tailor) => {
              const isSaved = customer.savedTailorIds.includes(tailor.id);
              const isSameCity = tailor.city.trim().toLowerCase() === normalizedSelectedCity;

              return (
                <div
                  key={tailor.id}
                  className="atelier-card rounded-3xl flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Cover & Badges */}
                  <div className="relative h-48 overflow-hidden bg-stone-100">
                    <img
                      src="/tailor-placeholder.svg"
                      alt={tailor.shopName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/10 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                      {tailor.availableToday ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-600/95 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          Available Today
                        </span>
                      ) : (
                        <span className="bg-stone-900/80 backdrop-blur-md text-stone-200 px-3 py-1 rounded-full text-[10px] font-semibold">
                          Advance Booking
                        </span>
                      )}

                      <button
                        onClick={() => toggleSavedTailor(tailor.id)}
                        className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md text-stone-600 hover:text-rose-600 flex items-center justify-center transition-colors shadow-xs"
                        title="Save Atelier"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isSaved ? 'fill-rose-600 text-rose-600' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* Bottom overlay: City group & Starting Price */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                      <div>
                        <span className="text-xs font-semibold text-stone-200 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          {isSameCity ? `In your city • ${tailor.city}` : `Serving from ${tailor.city}`}
                        </span>
                      </div>
                      <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-stone-950 text-xs font-extrabold shadow-sm border border-stone-200">
                        From ₹{tailor.startingPrice}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div>
                      {/* Name & Rating */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-serif font-bold text-xl text-stone-950 group-hover:text-amber-800 transition-colors">
                              {tailor.shopName}
                            </h3>
                            {tailor.isVerified && (
                              <span title="Verified Workshop">
                                <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0" />
                              </span>
                            )}
                            {!tailor.isVerified && tailor.verificationStatus === 'pending' && (
                              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-800 border border-amber-200">
                                Verification pending
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-1">
                            <span>Master: {tailor.name}</span>
                            <span>•</span>
                            <span className="text-stone-700 font-semibold">
                              {tailor.experienceYears} yrs exp
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/80 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span className="text-xs font-extrabold text-stone-950">{tailor.rating}</span>
                          <span className="text-[10px] text-stone-500 font-medium">({tailor.reviewCount})</span>
                        </div>
                      </div>

                      {/* Specializations */}
                      <div className="mt-3.5 pt-3.5 border-t border-stone-100">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                          Specializations:
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {tailor.specializations.map((spec, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 font-semibold"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Perks */}
                      <div className="mt-3.5 flex flex-wrap items-center gap-3 text-xs text-stone-600">
                        {tailor.homePickup && (
                          <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                            <Home className="w-3.5 h-3.5 text-emerald-600" /> Doorstep Pickup
                          </span>
                        )}
                        {tailor.deliveryAvailable && (
                          <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                            <Truck className="w-3.5 h-3.5 text-emerald-600" /> Express Courier
                          </span>
                        )}
                        {tailor.isVerified && (
                          <span className="flex items-center gap-1 text-blue-800 font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Fit Guarantee
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-stone-400 mt-3">
                        Pickup and delivery fees are calculated separately from stitching prices.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-stone-100 grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleViewProfile(tailor.id)}
                        className="py-2.5 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold transition-colors text-center"
                      >
                        View Studio
                      </button>
                      <button
                        onClick={() => handleRequestService(tailor.id)}
                        className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-900 hover:to-stone-900 text-white text-xs font-bold transition-all shadow-xs text-center"
                      >
                        Custom Quote
                      </button>
                      <button
                        onClick={() => handleBookAppointment(tailor.id)}
                        className="py-2.5 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200/90 text-xs font-bold transition-colors text-center"
                      >
                        Book Fitting
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTailors.length === 0 && (
            <div className="p-16 text-center bg-white rounded-3xl border border-stone-200 space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-amber-800" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-950">
                No ateliers match your exact filter criteria
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                Try expanding your search distance slider or resetting your service filters to discover
                more master tailors in {selectedCity}.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-2xl shadow-sm transition-all"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
