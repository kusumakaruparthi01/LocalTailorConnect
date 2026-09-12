import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Scissors,
  Share2,
  Heart,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const TailorProfilePage: React.FC = () => {
  const {
    tailors,
    selectedTailorId,
    setCurrentView,
    setIsCustomRequestOpen,
    setIsAppointmentModalOpen,
    setIsReviewModalOpen,
    customer,
    toggleSavedTailor,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'services' | 'portfolio' | 'about' | 'reviews'>(
    'services'
  );

  const tailor = tailors.find((t) => t.id === selectedTailorId) || tailors[0];
  const isSaved = customer.savedTailorIds.includes(tailor.id);

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    addToast('success', 'Link Copied', `${tailor.shopName} profile link copied to clipboard.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back navigation */}
      <button
        onClick={() => setCurrentView('find-tailors')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Find Tailors</span>
      </button>

      {/* Header Profile Hero Card */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
        {/* Cover Photo */}
        <div className="relative h-60 sm:h-72 w-full">
          <img
            src={tailor.coverImage}
            alt={tailor.shopName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

          {/* Floating actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:text-stone-900 shadow-sm"
              title="Share profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSavedTailor(tailor.id)}
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:text-rose-600 shadow-sm"
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Profile Info Bar */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-16 sm:-mt-20 relative z-10">
            {/* Avatar & Title */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative">
                <img
                  src={tailor.avatar}
                  alt={tailor.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
                />
                {tailor.isVerified && (
                  <div
                    className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full shadow-xs"
                    title="Verified Boutique"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                    {tailor.shopName}
                  </h1>
                  {tailor.availableToday && (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Available Today
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-stone-600 italic font-serif">
                  {tailor.tagline}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
                  <span className="flex items-center gap-1 text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {tailor.rating} ({tailor.reviewCount} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {tailor.address}, {tailor.city} ({tailor.pincode})
                  </span>
                  <span className="font-semibold text-stone-700">
                    {tailor.experienceYears} years of experience
                  </span>
                </div>
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button
                onClick={() => setIsCustomRequestOpen(true)}
                className="flex-1 md:flex-none px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Scissors className="w-4 h-4 text-amber-200" />
                <span>Request Service</span>
              </button>
              <button
                onClick={() => setIsAppointmentModalOpen(true)}
                className="flex-1 md:flex-none px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl border border-stone-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-stone-600" />
                <span>Book Appointment</span>
              </button>
              <button
                onClick={() => {
                  setCurrentView('customer-dashboard');
                  setTimeout(() => {
                    document.getElementById('messages-tab')?.click();
                  }, 100);
                }}
                className="p-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50"
                title="Message tailor"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-8 border-b border-stone-200 mt-8 text-xs sm:text-sm font-semibold text-stone-600">
            <button
              onClick={() => setActiveTab('services')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'services'
                  ? 'border-amber-800 text-amber-800 font-bold'
                  : 'border-transparent hover:text-stone-900'
              }`}
            >
              Services & Pricing ({tailor.services.length})
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'portfolio'
                  ? 'border-amber-800 text-amber-800 font-bold'
                  : 'border-transparent hover:text-stone-900'
              }`}
            >
              Portfolio & Garments
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'about'
                  ? 'border-amber-800 text-amber-800 font-bold'
                  : 'border-transparent hover:text-stone-900'
              }`}
            >
              About & Workshop
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'reviews'
                  ? 'border-amber-800 text-amber-800 font-bold'
                  : 'border-transparent hover:text-stone-900'
              }`}
            >
              Reviews ({tailor.reviews.length || tailor.reviewCount})
            </button>
          </div>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Tab Area */}
        <div className="lg:col-span-8">
          {/* 1. Services & Pricing Table */}
          {activeTab === 'services' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div>
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  Services, Starting Prices & Turnaround Times
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Transparent base prices. You will receive an exact quotation after review before cutting begins.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-500 text-[11px] uppercase tracking-wider font-semibold">
                      <th className="pb-3">Service</th>
                      <th className="pb-3 text-right">Starting Price</th>
                      <th className="pb-3 text-center">Estimated Time</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {tailor.services.map((svc) => (
                      <tr key={svc.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="font-semibold text-stone-900">{svc.name}</div>
                          {svc.description && (
                            <div className="text-[11px] text-stone-500 mt-0.5">{svc.description}</div>
                          )}
                        </td>
                        <td className="py-4 text-right font-bold text-amber-800 text-sm">
                          ₹{svc.startingPrice}
                        </td>
                        <td className="py-4 text-center text-xs text-stone-600">
                          <span className="inline-flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded-md">
                            <Clock className="w-3 h-3 text-stone-400" />
                            {svc.estimatedTime}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => setIsCustomRequestOpen(true)}
                            className="px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold transition-colors"
                          >
                            Request
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. Portfolio Gallery */}
          {activeTab === 'portfolio' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div>
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  Completed Garments & Client Showcase
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Authentic work completed by master {tailor.name}.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tailor.portfolio.length > 0 ? (
                  tailor.portfolio.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl overflow-hidden border border-stone-200 group relative aspect-[4/3]"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-90" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-600 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        <h4 className="font-serif font-bold text-sm mt-1">{item.title}</h4>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-10 text-stone-500 text-xs">
                    Portfolio images currently being uploaded for this boutique.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. About Section */}
          {activeTab === 'about' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div>
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  About {tailor.shopName}
                </h3>
                <p className="text-xs text-stone-600 mt-3 leading-relaxed">{tailor.about}</p>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-3">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                  Workshop Standards & Equipment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Juki High-Speed Industrial Sewing Machines</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Vacuum Steam Ironing & Crisp Pressing</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Specialized 4-Thread Overlock (Interlock)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Hygienic Fabric Storage & Pre-Shrunk Lining</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-xl text-stone-900">
                    Customer Ratings & Reviews
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Based on verified completed stitching orders.
                  </p>
                </div>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold rounded-xl transition-colors"
                >
                  Write a Review
                </button>
              </div>

              {/* Breakdown Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-stone-600">Stitching Quality</span>
                    <span className="font-bold text-stone-900">4.9 / 5</span>
                  </div>
                  <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 rounded-full w-[98%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-stone-600">Fitting Accuracy</span>
                    <span className="font-bold text-stone-900">4.8 / 5</span>
                  </div>
                  <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 rounded-full w-[96%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-stone-600">On-Time Delivery</span>
                    <span className="font-bold text-stone-900">4.7 / 5</span>
                  </div>
                  <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 rounded-full w-[94%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-stone-600">Value for Money</span>
                    <span className="font-bold text-stone-900">4.8 / 5</span>
                  </div>
                  <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 rounded-full w-[96%]" />
                  </div>
                </div>
              </div>

              {/* Review list */}
              <div className="space-y-4 divide-y divide-stone-100">
                {tailor.reviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-stone-900">{rev.customerName}</span>
                        <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-medium">
                          {rev.garmentType}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed italic">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Sidebar: Working Hours, Location & Direct Booking Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-5 shadow-xs">
            <h3 className="font-serif font-bold text-base text-stone-900">
              Shop Details & Availability
            </h3>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-stone-900">Working Hours</span>
                  <span className="text-stone-500">{tailor.workingHours}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-stone-900">Address</span>
                  <span className="text-stone-500">
                    {tailor.address}, {tailor.city} - {tailor.pincode}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-stone-900">Contact Number</span>
                  <span className="text-stone-500">{tailor.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-stone-900">Email Address</span>
                  <span className="text-stone-500">{tailor.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 space-y-2">
              <button
                onClick={() => setIsCustomRequestOpen(true)}
                className="w-full py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Scissors className="w-4 h-4 text-amber-200" />
                <span>Start Custom Request</span>
              </button>
              <button
                onClick={() => setIsAppointmentModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs border border-stone-200 transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-stone-600" />
                <span>Book Fitting Appointment</span>
              </button>
            </div>
          </div>

          {/* Guarantee Card */}
          <div className="p-5 rounded-3xl bg-amber-50/60 border border-amber-200/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Perfect Fit Assurance</span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              All bookings via Local Tailor Connect come with free trial alteration adjustments
              within 7 days of collection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
