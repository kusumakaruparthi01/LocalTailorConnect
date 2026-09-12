import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Tailor } from '../types';
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
  Map as MapIcon,
  Grid,
  Heart,
  Eye,
} from 'lucide-react';

export const FindTailorsPage: React.FC = () => {
  const {
    tailors,
    setCurrentView,
    setSelectedTailorId,
    setIsCustomRequestOpen,
    setIsAppointmentModalOpen,
    selectedCity,
    pincode,
    customer,
    toggleSavedTailor,
  } = useApp();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('All');
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [minRating, setMinRating] = useState<number>(4.0);
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  const [onlyHomePickup, setOnlyHomePickup] = useState(false);
  const [onlyDelivery, setOnlyDelivery] = useState(false);
  const [minExperience, setMinExperience] = useState<number>(0);

  // View mode: Grid or Map
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [activeMapTailorId, setActiveMapTailorId] = useState<string>('tailor_01');

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

      // Distance filter
      if (t.distanceKm > maxDistance) return false;

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
    maxDistance,
    maxPrice,
    minRating,
    minExperience,
    onlyAvailableToday,
    onlyHomePickup,
    onlyDelivery,
    selectedService,
  ]);

  const activeMapTailor = tailors.find((t) => t.id === activeMapTailorId) || tailors[0];

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Discover Verified Local Masters</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Find the perfect tailor near you
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Showing verified tailors in and around <strong className="text-stone-900">{selectedCity}</strong> ({pincode}).
          </p>
        </div>

        {/* View Switcher: Grid / Map */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Grid Cards</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'map'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {/* Search & Service Filter Ribbon */}
      <div className="space-y-4">
        <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by service, tailor name, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-stone-400 hover:text-stone-700 px-2"
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
              className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedService === svc
                  ? 'bg-amber-800 text-white shadow-xs font-semibold'
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
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wide">
              <SlidersHorizontal className="w-4 h-4 text-amber-700" />
              <span>Filters</span>
            </div>
            <button
              onClick={() => {
                setMaxDistance(10);
                setMaxPrice(2000);
                setMinRating(4.0);
                setOnlyAvailableToday(false);
                setOnlyHomePickup(false);
                setOnlyDelivery(false);
                setSelectedService('All');
                setMinExperience(0);
              }}
              className="text-[11px] font-semibold text-amber-800 hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Distance Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
              <span>Maximum Distance</span>
              <span className="text-amber-800 font-bold">{maxDistance} km</span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-amber-800"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>1 km</span>
              <span>10 km</span>
              <span>25 km</span>
            </div>
          </div>

          {/* Starting Price Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
              <span>Starting Price Up To</span>
              <span className="text-amber-800 font-bold">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min={150}
              max={3000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-800"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>₹150</span>
              <span>₹1,500</span>
              <span>₹3,000+</span>
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-stone-800 block">Minimum Rating</span>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {[4.0, 4.5, 4.8].map((rt) => (
                <button
                  key={rt}
                  onClick={() => setMinRating(rt)}
                  className={`py-1.5 rounded-lg border text-center font-medium transition-all ${
                    minRating === rt
                      ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  ⭐ {rt}+
                </button>
              ))}
            </div>
          </div>

          {/* Tailor Experience */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-stone-800 block">Experience Level</span>
            <select
              value={minExperience}
              onChange={(e) => setMinExperience(Number(e.target.value))}
              className="w-full text-xs p-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:border-amber-700"
            >
              <option value={0}>Any Experience</option>
              <option value={5}>5+ Years in Tailoring</option>
              <option value={10}>10+ Years (Senior Master)</option>
              <option value={15}>15+ Years (Heritage Master)</option>
            </select>
          </div>

          {/* Quick Feature Toggles */}
          <div className="space-y-3 pt-2 border-t border-stone-100 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-stone-700 font-medium">Available Today</span>
              <input
                type="checkbox"
                checked={onlyAvailableToday}
                onChange={(e) => setOnlyAvailableToday(e.target.checked)}
                className="w-4 h-4 rounded text-amber-800 focus:ring-amber-700 accent-amber-800"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-stone-700 font-medium">Doorstep Home Pickup</span>
              <input
                type="checkbox"
                checked={onlyHomePickup}
                onChange={(e) => setOnlyHomePickup(e.target.checked)}
                className="w-4 h-4 rounded text-amber-800 focus:ring-amber-700 accent-amber-800"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-stone-700 font-medium">Home Delivery Available</span>
              <input
                type="checkbox"
                checked={onlyDelivery}
                onChange={(e) => setOnlyDelivery(e.target.checked)}
                className="w-4 h-4 rounded text-amber-800 focus:ring-amber-700 accent-amber-800"
              />
            </label>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>
              Showing <strong className="text-stone-900">{filteredTailors.length}</strong> tailors
              matching your preferences
            </span>
            <span className="text-[11px]">Sorted by Proximity & Ratings</span>
          </div>

          {/* Map View Mode */}
          {viewMode === 'map' && (
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
              <div className="relative h-80 sm:h-96 bg-stone-100 flex items-center justify-center overflow-hidden">
                {/* Simulated Visual Styled Map Canvas */}
                <div className="absolute inset-0 bg-[#EBF0E8] opacity-80" />
                {/* Street lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:40px_40px]" />

                {/* City Landmark Label */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-800 shadow-xs flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>{selectedCity} Tailoring Cluster</span>
                </div>

                {/* Simulated Pins for Tailors */}
                {filteredTailors.map((t, idx) => {
                  const isSelected = t.id === activeMapTailorId;
                  // Dynamic spread for visual presentation
                  const left = 15 + ((idx * 16) % 70);
                  const top = 20 + ((idx * 18) % 60);

                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveMapTailorId(t.id)}
                      style={{ left: `${left}%`, top: `${top}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 flex items-center gap-1.5 shadow-lg ${
                        isSelected
                          ? 'bg-amber-800 text-white ring-4 ring-amber-300/60 scale-110 z-30'
                          : 'bg-white text-stone-800 border border-stone-300 hover:scale-105 z-10'
                      }`}
                    >
                      <MapPin className={`w-4 h-4 ${isSelected ? 'text-amber-200' : 'text-amber-700'}`} />
                      <span className="text-[11px] font-bold pr-1 truncate max-w-[120px]">
                        {t.shopName.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Selected Tailor on Map */}
              {activeMapTailor && (
                <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={activeMapTailor.avatar}
                      alt={activeMapTailor.shopName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-base text-stone-900">
                          {activeMapTailor.shopName}
                        </h4>
                        <span className="text-xs text-amber-800 font-semibold bg-amber-100/60 px-2 py-0.5 rounded">
                          ⭐ {activeMapTailor.rating}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        📍 {activeMapTailor.distanceKm} km away • {activeMapTailor.address}
                      </p>
                      <p className="text-xs text-stone-700 font-medium mt-1">
                        Specializes in: {activeMapTailor.specializations.join(' • ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleViewProfile(activeMapTailor.id)}
                      className="px-4 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-xs font-semibold text-stone-800 transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleRequestService(activeMapTailor.id)}
                      className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-xs font-semibold text-white shadow-xs transition-colors"
                    >
                      Request Service
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tailor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTailors.map((tailor) => {
              const isSaved = customer.savedTailorIds.includes(tailor.id);

              return (
                <div
                  key={tailor.id}
                  className="bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Cover & Badges */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={tailor.coverImage}
                      alt={tailor.shopName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      {tailor.availableToday ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          Available Today
                        </span>
                      ) : (
                        <span className="bg-stone-800/80 backdrop-blur-md text-stone-200 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                          Book in advance
                        </span>
                      )}

                      <button
                        onClick={() => toggleSavedTailor(tailor.id)}
                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-stone-600 hover:text-rose-600 flex items-center justify-center transition-colors shadow-xs"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isSaved ? 'fill-rose-600 text-rose-600' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* Bottom overlay: Distance & Starting Price */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                      <div>
                        <span className="text-[11px] font-medium text-stone-300 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          {tailor.distanceKm} km away • {tailor.city}
                        </span>
                      </div>
                      <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-stone-900 text-xs font-bold shadow-xs">
                        Starting from ₹{tailor.startingPrice}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Name & Rating */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-800 transition-colors">
                            {tailor.shopName}
                          </h3>
                          <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                            <span>Master: {tailor.name}</span>
                            <span>•</span>
                            <span className="text-stone-600 font-medium">
                              {tailor.experienceYears} yrs exp
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/80 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span className="text-xs font-bold text-stone-900">{tailor.rating}</span>
                          <span className="text-[10px] text-stone-500">({tailor.reviewCount})</span>
                        </div>
                      </div>

                      {/* Specializations */}
                      <div className="mt-3 pt-3 border-t border-stone-100">
                        <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
                          Specializes in:
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {tailor.specializations.map((spec, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Perks */}
                      <div className="mt-3 flex items-center gap-4 text-[11px] text-stone-600">
                        {tailor.homePickup && (
                          <span className="flex items-center gap-1 text-emerald-700">
                            <Home className="w-3 h-3" /> Home Pickup
                          </span>
                        )}
                        {tailor.deliveryAvailable && (
                          <span className="flex items-center gap-1 text-emerald-700">
                            <Truck className="w-3 h-3" /> Delivery
                          </span>
                        )}
                        {tailor.isVerified && (
                          <span className="flex items-center gap-1 text-blue-700">
                            <ShieldCheck className="w-3 h-3" /> Verified Shop
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-stone-100 grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleViewProfile(tailor.id)}
                        className="py-2 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors text-center"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleRequestService(tailor.id)}
                        className="py-2 px-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold transition-colors shadow-xs text-center"
                      >
                        Request Service
                      </button>
                      <button
                        onClick={() => handleBookAppointment(tailor.id)}
                        className="py-2 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 text-xs font-semibold transition-colors text-center"
                      >
                        Appointment
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTailors.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
              <Search className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-stone-800">
                No tailors matched your search filters
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try expanding your distance slider or resetting service filters to discover more
                master tailors nearby.
              </p>
              <button
                onClick={() => {
                  setMaxDistance(25);
                  setSelectedService('All');
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-amber-800 text-white text-xs font-semibold rounded-xl"
              >
                Expand Search Radius
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
