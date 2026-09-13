import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Scissors,
  MapPin,
  Search,
  Star,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Ruler,
  Truck,
  MessageSquare,
  Award,
  Users,
  BadgeCheck,
  ChevronRight,
  Store,
  Calendar,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setSelectedCity, setRole, selectedCity, pincode } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGarmentCategory, setSelectedGarmentCategory] = useState('All');

  const popularQuickSearches = [
    'Bridal Blouses',
    "Men's Linen Suits",
    'Saree Fall & Pico',
    'Anarkali Kurti',
    'Express Alterations',
    'Kids Festive Wear',
  ];

  const services = [
    {
      title: 'Designer Blouse Stitching',
      category: "Women's Ethnic",
      startingPrice: '₹350',
      time: '3–4 days',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
      badge: 'Most Popular',
      features: ['Prince-cut & padded options', 'Boat neck, deep back & pot neck', 'Aari & Zardozi embroidery'],
      description: 'Handcrafted designer blouses tailored to exact shoulder, armhole, and chest curves.',
    },
    {
      title: 'Saree Finishing, Pico & Kuchu',
      category: 'Finishing & Drape',
      startingPrice: '₹200',
      time: '1–2 days',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
      badge: 'Quick 24h',
      features: ['Pure cotton fall hem stitching', 'Machine zigzag pico finish', 'Hand-knotted silk kuchu tassels'],
      description: 'Preserve and finish your heirloom Kanjeevarams and chiffon sarees with neat edge finishes.',
    },
    {
      title: "Men's Bespoke Shirts & Suits",
      category: "Men's Sartorial",
      startingPrice: '₹450',
      time: '3–5 days',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80',
      badge: 'Master Crafted',
      features: ['Custom collar & cuff styles', 'Italian canvas jacket structure', 'Perfect waist & inseam rise'],
      description: 'Razor-sharp formal shirts, trousers, two-piece suits, and safari sets tailored for confidence.',
    },
    {
      title: "Women's Salwar & Kurti Sets",
      category: 'Daily & Occasion',
      startingPrice: '₹400',
      time: '3–4 days',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80',
      badge: 'Daily & Office',
      features: ['Straight cut, A-line & Anarkalis', 'Palazzo, cigar & cigarette pants', 'Matching cotton lining included'],
      description: 'Comfortable, breathable ethnic sets designed with ideal side-slit drops and neckline piping.',
    },
    {
      title: 'Kids Festive & Birthday Wear',
      category: 'Festive & Kids',
      startingPrice: '₹350',
      time: '2–3 days',
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&auto=format&fit=crop&q=80',
      badge: 'Extra Margin',
      features: ['Pattu Pavadai & silk lehengas', 'Boys dhoti & kurta sets', '2-inch seam allowance for growth'],
      description: 'Skin-friendly, itch-free festive garments made with soft lining and extra margins for growing kids.',
    },
    {
      title: 'Bridal Lehengas & Couture',
      category: 'Haute Couture',
      startingPrice: '₹1,500',
      time: '7–10 days',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80',
      badge: 'Luxury Atelier',
      features: ['Heavy cancan flare insertion', 'Custom couple color coordination', 'Multiple in-person trial sessions'],
      description: 'Breathtaking bridal ensembles sculpted to your dream silhouette with heavy artisanal craftsmanship.',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Discover & Compare',
      desc: 'Browse vetted master tailors in your neighborhood filtered by distance, garment specialty, and transparent price cards.',
      icon: <Search className="w-5 h-5 text-amber-800" />,
      detail: 'Filter by turnaround time & ratings',
    },
    {
      num: '02',
      title: 'Digitize Measurements',
      desc: 'Select your saved measurement profile or request doorstep measurement pickup by a certified local tailor.',
      icon: <Ruler className="w-5 h-5 text-amber-800" />,
      detail: 'Reusable for all future orders',
    },
    {
      num: '03',
      title: 'Live Workshop Tracking',
      desc: 'Watch your garment progress in real time through Fabric Received, Cutting, Stitching, and Trial Ready milestones.',
      icon: <Clock className="w-5 h-5 text-amber-800" />,
      detail: 'Direct in-app chat with tailor',
    },
    {
      num: '04',
      title: 'Doorstep Trial & Guaranteed Fit',
      desc: 'Receive your garment via doorstep delivery or collect at the workshop. Free alteration adjustments within 7 days.',
      icon: <CheckCircle2 className="w-5 h-5 text-amber-800" />,
      detail: '100% Fit Satisfaction Guarantee',
    },
  ];

  const valueProps = [
    {
      title: 'MSME & Vetted Master Craftsmen',
      desc: 'Every boutique on our platform undergoes rigorous workshop inspection, stitching sample audits, and background verification.',
      icon: <ShieldCheck className="w-6 h-6 text-amber-800" />,
    },
    {
      title: 'Digital Measurement Vault',
      desc: 'Measure once and store your complete body profile securely. Re-order everyday, bridal, or festive wear with one click.',
      icon: <Ruler className="w-6 h-6 text-amber-800" />,
    },
    {
      title: 'Upfront Itemized Quotations',
      desc: 'Receive transparent quotations detailing stitching fees, lining fabric, and embroidery before needle touches fabric.',
      icon: <Award className="w-6 h-6 text-amber-800" />,
    },
    {
      title: 'Milestone Progress Tracker',
      desc: 'No more follow-up phone calls. Receive automated live updates when cutting starts, stitching finishes, and trial is ready.',
      icon: <Clock className="w-6 h-6 text-amber-800" />,
    },
    {
      title: 'Secure Escrow Payments',
      desc: 'Pay safely via UPI, Google Pay, PhonePe, Cards, or Net Banking. Funds are released to the tailor upon your fitting approval.',
      icon: <TrendingUp className="w-6 h-6 text-amber-800" />,
    },
    {
      title: 'Doorstep Pickup & Delivery',
      desc: 'Enjoy hassle-free door collection of fabric and doorstep trial delivery across Pudukkottai, Madurai, Trichy, and Chennai.',
      icon: <Truck className="w-6 h-6 text-amber-800" />,
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Kavitha Sundaram',
      city: 'Pudukkottai',
      rating: 5,
      comment:
        '“I found a local tailor, shared my requirements, and tracked the fitting from one place. Saving my measurements made reordering effortless.”',
      role: 'Verified Customer',
      garment: 'Bridal Blouse Stitching',
      date: 'Order delivered 3 days ago',
    },
    {
      name: 'R. Vignesh Kumar',
      city: 'Chennai',
      rating: 5,
      comment:
        '“Finding a master who still understands bespoke canvas suiting in T. Nagar used to be difficult. Classic Men’s Tailors gave me a suit that fits better than luxury off-the-rack brands at one-third the cost.”',
      role: 'Verified Customer',
      garment: 'Bespoke Suit & Shirts',
      date: 'Order delivered last week',
    },
    {
      name: 'Sowmya Raman',
      city: 'Trichy',
      rating: 5,
      comment:
        '“The order tracking gave me total peace of mind. Getting SMS and in-app alerts when my saree moved to pico and then ready for pickup was just like Swiggy for tailoring!”',
      role: 'Verified Customer',
      garment: 'Saree Fall & Pico',
      date: 'Order delivered yesterday',
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('find-tailors');
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 atelier-gradient-hero border-b border-stone-200/70">
        {/* Decorative ambient gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[520px] bg-gradient-to-tr from-amber-200/35 via-rose-100/25 to-stone-100/10 blur-3xl pointer-events-none -z-10" />
        <div className="absolute -top-32 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-7">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-amber-300/80 shadow-xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                </span>
                <span className="text-amber-900 text-xs font-bold tracking-wide">
                  500+ Verified Master Tailors • 100% Fit Guarantee
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-950 tracking-tight leading-[1.12]">
                  Bespoke Tailoring,{' '}
                  <span className="text-gold-gradient italic font-normal">Perfected For You.</span>
                </h1>

                <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                  Connect directly with verified local ateliers and master tailors for bridal blouses,
                  bespoke men’s suits, saree finishing, and precision alterations. Save your measurements
                  digitally and track every stitch in real time.
                </p>
              </div>

              {/* Comprehensive Search & Booking Console */}
              <div className="bg-white p-3 sm:p-4 rounded-3xl shadow-xl shadow-stone-300/40 border border-stone-200/90 max-w-2xl">
                <form onSubmit={handleSearchSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    {/* Search query input */}
                    <div className="sm:col-span-7 flex items-center gap-2.5 px-3.5 py-2.5 bg-stone-50/80 rounded-2xl border border-stone-200">
                      <Search className="w-4 h-4 text-stone-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Search blouse, suit, lehenga, alteration..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none bg-transparent"
                      />
                    </div>

                    {/* Location Badge */}
                    <div className="sm:col-span-5 flex items-center justify-between px-3.5 py-2.5 bg-stone-50/80 rounded-2xl border border-stone-200 text-xs font-semibold text-stone-800">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-4 h-4 text-amber-800 shrink-0" />
                        <span className="truncate">{selectedCity}</span>
                        <span className="text-stone-400 font-normal text-[11px]">({pincode})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentView('find-tailors')}
                        className="text-amber-800 text-[11px] font-bold hover:underline shrink-0"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Doorstep Pickup
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-800 font-semibold">
                        <Clock className="w-3.5 h-3.5" /> Express 24h
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-stone-700 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Escrow Safe
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 hover:from-amber-900 hover:to-black text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-950/20 transition-all hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Scissors className="w-4 h-4 text-amber-200" />
                      <span>Discover Tailors Near Me</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Popular Search Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Trending:
                </span>
                {popularQuickSearches.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      setCurrentView('find-tailors');
                    }}
                    className="px-3 py-1 rounded-full bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-900 text-xs font-medium border border-stone-200/80 transition-all shadow-2xs"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentView('smart-match')}
                  className="px-4 py-2.5 rounded-xl bg-amber-100/70 hover:bg-amber-100 text-amber-950 font-bold text-xs border border-amber-300/80 transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Use 30-Sec Smart Matcher</span>
                </button>

                <button
                  onClick={() => {
                    setRole('tailor');
                    setCurrentView('tailor-register');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 font-semibold text-xs border border-stone-300 transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <Store className="w-4 h-4 text-stone-500" />
                  <span>Register Workshop as Tailor</span>
                </button>
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Card */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-stone-900 group">
                  <img
                    src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80"
                    alt="Master artisan tailor cutting bespoke fabric"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/25 to-transparent" />

                  {/* Atelier Details Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-amber-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
                        Premier Atelier
                      </span>
                      <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-semibold text-stone-100 flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3 text-amber-300" /> MSME Certified
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold tracking-tight">
                      Sample Tailor Studio
                    </h3>

                    <p className="text-xs text-stone-300 flex items-center gap-3">
                      <span>South Main Street, Pudukkottai</span>
                      <span>•</span>
                      <span className="text-amber-300 font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.8 (126 reviews)
                      </span>
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-white/20 text-xs">
                      <span className="text-stone-300">Specializes in Bridal Aari & Silk Blouses</span>
                      <span className="font-bold text-amber-300">From ₹350</span>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 1: Live Order Milestone */}
                <div className="absolute -top-6 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-stone-200/90 flex items-center gap-3.5 animate-in slide-in-from-left duration-500 max-w-xs">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        Example order progress
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                    <p className="text-xs font-bold text-stone-900 mt-0.5">
                      Boat-Neck Blouse • In Hand-Stitching
                    </p>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                      Ready for Doorstep Trial Tomorrow
                    </p>
                  </div>
                </div>

                {/* Floating Badge 2: Fit Guarantee */}
                <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-stone-200/90 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-amber-800" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">100% Fit Guarantee</p>
                    <p className="text-[11px] text-stone-500 font-medium">
                      Free adjustments within 7 days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metric Stats Banner */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 bg-white rounded-3xl shadow-sm border border-stone-200">
            <div className="text-center p-3 sm:p-4 border-r border-stone-100 last:border-r-0">
              <div className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950">500+</div>
              <div className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">Verified Master Tailors</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Vetted workshop craftsmanship</div>
            </div>
            <div className="text-center p-3 sm:p-4 border-r border-stone-100 last:border-r-0">
              <div className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950">15,000+</div>
              <div className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">Garments Handcrafted</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Blouses, suits, lehengas & pico</div>
            </div>
            <div className="text-center p-3 sm:p-4 border-r border-stone-100 last:border-r-0">
              <div className="font-serif text-3xl sm:text-4xl font-extrabold text-amber-800 flex items-center justify-center gap-1.5">
                <Star className="w-6 h-6 fill-amber-500 text-amber-500 inline" />
                <span>4.9 / 5</span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">Average Atelier Rating</div>
              <div className="text-[11px] text-stone-400 mt-0.5">From 8,400+ genuine reviews</div>
            </div>
            <div className="text-center p-3 sm:p-4">
              <div className="font-serif text-3xl sm:text-4xl font-extrabold text-emerald-800">100%</div>
              <div className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">Perfect Fit Guarantee</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Free alterations or instant refund</div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Services Catalog */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1.5">
              Curated Craftsmanship Categories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
              Bespoke Stitching & Expert Alterations
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-2xl">
              From wedding aari embroidery to tailored business suits, connect with master tailors
              dedicated to perfection in your exact garment type.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('find-tailors')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shrink-0 self-start md:self-auto shadow-xs"
          >
            <span>Explore All 30+ Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv, idx) => (
            <div
              key={idx}
              className="atelier-card rounded-3xl overflow-hidden group flex flex-col justify-between"
            >
              {/* Image & Badges */}
              <div className="relative h-52 overflow-hidden bg-stone-100">
                <img
                  src={srv.image}
                  alt={srv.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />

                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <span className="bg-stone-950/85 backdrop-blur-md text-stone-200 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-white/10">
                    {srv.category}
                  </span>
                  <span className="badge-gold px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    {srv.badge}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-stone-950 px-3.5 py-1 rounded-xl text-xs font-extrabold shadow-sm border border-stone-200">
                  Starts at {srv.startingPrice}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif font-bold text-xl text-stone-950 group-hover:text-amber-800 transition-colors">
                      {srv.title}
                    </h3>
                    <span className="text-xs text-stone-500 font-medium flex items-center gap-1 shrink-0">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {srv.time}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">{srv.description}</p>

                  {/* Bullet features */}
                  <ul className="mt-4 space-y-1.5 border-t border-stone-100 pt-3">
                    {srv.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-2 text-xs text-stone-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setCurrentView('find-tailors')}
                    className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View Specialist Tailors</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setCurrentView('smart-match')}
                    className="text-[11px] px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-800 hover:text-amber-950 font-bold transition-colors"
                  >
                    Smart Match
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-[#F6F1EB] py-20 scroll-mt-24 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
              The Bespoke Experience
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
              How Local Tailor Connect Works
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              Four simple, transparent milestones from design consultation to your doorstep fitting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-sm relative flex flex-col justify-between group hover:shadow-md hover:border-amber-700/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/70 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                      {step.icon}
                    </div>
                    <span className="font-serif text-3xl font-extrabold text-stone-300 group-hover:text-amber-800 transition-colors">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-stone-950 mb-2.5">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-1.5 text-[11px] font-semibold text-amber-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>{step.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Match Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white p-8 sm:p-14 overflow-hidden shadow-2xl border border-amber-900/30">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=700&auto=format&fit=crop&q=80"
              alt="Artisan fabric measuring tape"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI-Assisted Tailor Matching Algorithm</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Not sure which tailor suits your occasion?
            </h3>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              Tell our Smart Matcher your required garment, desired budget, and event deadline.
              We calculate workshop capacity and customer rating metrics to pair you with the top 3
              matching ateliers in seconds.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setCurrentView('smart-match')}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-900/50 transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Launch Smart Matcher</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('find-tailors')}
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
              >
                Browse Tailors Directly
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
            The Local Tailor Standards
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
            Why India Trusts Local Tailor Connect
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            We bridge the gap between generational master artisans and modern digital convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {valueProps.map((item, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl bg-white border border-stone-200/90 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="w-13 h-13 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-950">{item.title}</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="bg-stone-50/90 py-20 border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
              Verified Transformations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
              Loved by 10,000+ Discerning Clients
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              Read real stories from customers across Tamil Nadu who stopped settling for off-the-rack sizes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-7 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-stone-400">{t.date}</span>
                  </div>

                  <span className="inline-block text-[11px] font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80">
                    {t.garment}
                  </span>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif italic">
                    {t.comment}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{t.name}</h4>
                    <p className="text-[11px] text-stone-500">{t.city}, Tamil Nadu</p>
                  </div>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    {t.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Workshop Onboarding Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-amber-50 border border-amber-200/80 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/60 text-amber-900 text-xs font-bold">
              <Store className="w-3.5 h-3.5 text-amber-800" />
              <span>Tailor Partner Network</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">
              Are you an independent tailor or boutique studio?
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              Grow your client base with steady high-value orders, automated customer communication,
              reusable digital measurement records, and guaranteed on-time bank payouts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setRole('tailor');
                setCurrentView('tailor-register');
              }}
              className="px-6 py-3.5 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 text-center"
            >
              Apply to Become a Tailor Partner
            </button>
            <button
              onClick={() => {
                setRole('tailor');
                setCurrentView('tailor-login');
              }}
              className="px-5 py-3.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs sm:text-sm border border-stone-300 transition-all text-center"
            >
              Tailor Portal Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
