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
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setSelectedCity, setRole, selectedCity, pincode } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const services = [
    {
      title: 'Blouse Stitching',
      category: "Women's Ethnic",
      startingPrice: '₹350',
      time: '3–4 days',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80',
      description: 'Boat neck, prince cut, backless, pot neck, designer aari embroidery & padding.',
    },
    {
      title: 'Saree Alteration & Pico',
      category: 'Finishing',
      startingPrice: '₹200',
      time: '1–2 days',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&auto=format&fit=crop&q=80',
      description: 'Cotton fall stitching, machine zigzag pico, handmade silk thread kuchu tassels.',
    },
    {
      title: "Men's Tailoring & Suits",
      category: "Men's Bespoke",
      startingPrice: '₹450',
      time: '3–5 days',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80',
      description: 'Crisp linen shirts, formal trousers, 2-piece suits, safari suits & festive kurtas.',
    },
    {
      title: "Women's Salwar & Kurti",
      category: "Daily & Occasion",
      startingPrice: '₹400',
      time: '3–4 days',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=80',
      description: 'Palazzo sets, straight-cut suits, anarkalis, and side-slit tunics with lining.',
    },
    {
      title: 'Kids Traditional Wear',
      category: 'Festive & Birthday',
      startingPrice: '₹350',
      time: '2–3 days',
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&auto=format&fit=crop&q=80',
      description: 'Pattu pavadai, lehengas, dhoti kurta sets with extra seam margin for growth.',
    },
    {
      title: 'Custom Bridal & Designer',
      category: 'Luxury Craft',
      startingPrice: '₹1,500',
      time: '7–10 days',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&auto=format&fit=crop&q=80',
      description: 'Maggam work, zardozi embroidery, reception gowns & matching couple sets.',
    },
  ];

  const steps = [
    {
      num: '1',
      title: 'Find a Tailor',
      desc: 'Discover vetted, high-rated tailors in your neighborhood by distance, price, and specialization.',
      icon: <Search className="w-5 h-5 text-amber-700" />,
    },
    {
      num: '2',
      title: 'Share Your Requirements',
      desc: 'Pick or enter your saved measurement profile, upload design inspiration or neckline reference photos.',
      icon: <Ruler className="w-5 h-5 text-amber-700" />,
    },
    {
      num: '3',
      title: 'Track Your Order',
      desc: 'Know exactly what stage your order is in — from Cutting, Stitching, and Trial Fit to Ready.',
      icon: <Clock className="w-5 h-5 text-amber-700" />,
    },
    {
      num: '4',
      title: 'Get the Perfect Fit',
      desc: 'Opt for doorstep pickup & delivery or collect from the shop with our 100% fit satisfaction guarantee.',
      icon: <CheckCircle2 className="w-5 h-5 text-amber-700" />,
    },
  ];

  const valueProps = [
    {
      title: 'Verified Local Masters',
      desc: 'Every tailor is thoroughly vetted for craftsmanship, workshop hygiene, and verified ratings.',
      icon: <ShieldCheck className="w-6 h-6 text-amber-700" />,
    },
    {
      title: 'Reusable Measurements',
      desc: 'Measure once, save securely, and seamlessly order across everyday, bridal, and festive wear.',
      icon: <Ruler className="w-6 h-6 text-amber-700" />,
    },
    {
      title: 'Transparent Pricing',
      desc: 'Clear itemized quotations before cutting starts. Zero hidden charges or surprise alteration fees.',
      icon: <Award className="w-6 h-6 text-amber-700" />,
    },
    {
      title: 'Real-Time Order Tracking',
      desc: 'Watch your garment progress through Cutting, Stitching, and Alteration milestones live.',
      icon: <Clock className="w-6 h-6 text-amber-700" />,
    },
    {
      title: 'Secure Payments & UPI',
      desc: 'Pay via UPI, GPay, PhonePe, Cards, or Cash on Delivery only after satisfactory fitting.',
      icon: <TrendingUp className="w-6 h-6 text-amber-700" />,
    },
    {
      title: 'Direct In-App Chat',
      desc: 'Easily clarify sleeve length, piping colors, or delivery dates with instant photo messages.',
      icon: <MessageSquare className="w-6 h-6 text-amber-700" />,
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Kavitha Sundaram',
      city: 'Pudukkottai',
      rating: 5,
      comment:
        '“I needed two bridal blouses stitched in 4 days for my sister’s wedding. Lakshmi Stitching Studio delivered both with flawless prince-cut fitting. Saving my measurements digitally made reordering effortless!”',
      role: 'Verified Customer',
      garment: 'Blouse Stitching',
    },
    {
      name: 'R. Vignesh Kumar',
      city: 'Chennai',
      rating: 5,
      comment:
        '“Finding a master who still understands bespoke canvas suiting in T. Nagar used to be difficult. Classic Men’s Tailors gave me a suit that fits better than luxury off-the-rack brands at one-third the cost.”',
      role: 'Verified Customer',
      garment: 'Bespoke Suit',
    },
    {
      name: 'Sowmya Raman',
      city: 'Trichy',
      rating: 5,
      comment:
        '“The order tracking gave me total peace of mind. Getting SMS and in-app alerts when my saree moved to pico and then ready for pickup was just like Swiggy for tailoring!”',
      role: 'Verified Customer',
      garment: 'Saree Fall & Pico',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-24">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-amber-100/50 via-rose-50/40 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                <span>Connecting India’s Master Tailors to Your Wardrobe</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.12]">
                Find the Right Tailor.{' '}
                <span className="text-amber-800 italic font-medium">Get the Perfect Fit.</span>
              </h1>

              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Discover trusted local tailors, share your measurements, request custom stitching or
                alterations, and track your order — all in one place.
              </p>

              {/* Location & Search Bar */}
              <div className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-xl shadow-stone-200/60 border border-stone-200 max-w-xl">
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-stone-200 flex-1">
                    <Search className="w-4 h-4 text-stone-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search blouse, suit, alteration, or tailor name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setCurrentView('find-tailors');
                      }}
                      className="w-full text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none bg-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-stone-50 rounded-xl shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    <span>{selectedCity}</span>
                    <span className="text-stone-400">({pincode})</span>
                  </div>

                  <button
                    onClick={() => setCurrentView('find-tailors')}
                    className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <span>Search Tailors</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setCurrentView('find-tailors')}
                  className="px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm shadow-md transition-all hover:shadow-lg active:scale-95 flex items-center gap-2"
                >
                  <Scissors className="w-4 h-4 text-amber-200" />
                  <span>Find a Tailor</span>
                </button>

                <button
                  onClick={() => {
                    setRole('tailor');
                    setCurrentView('tailor-register');
                  }}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm border border-stone-300 shadow-xs transition-all hover:border-stone-400 active:scale-95"
                >
                  Become a Tailor
                </button>

                <button
                  onClick={() => setCurrentView('smart-match')}
                  className="px-4 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs border border-amber-200 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Try Smart Matcher</span>
                </button>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Photo: Indian Master Tailor measuring fabric */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] group">
                  <img
                    src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80"
                    alt="Master tailor cutting handcrafted clothing"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="inline-block px-2.5 py-1 bg-amber-600/90 backdrop-blur-md rounded-full text-[11px] font-semibold tracking-wide uppercase mb-2">
                      Handcrafted Precision
                    </span>
                    <h3 className="font-serif text-xl font-bold">
                      Lakshmi Stitching Studio
                    </h3>
                    <p className="text-xs text-stone-200 mt-1 flex items-center gap-2">
                      <span>Pudukkottai</span>
                      <span>•</span>
                      <span className="text-amber-300 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-300 text-amber-300" /> 4.8 (126 reviews)
                      </span>
                    </p>
                  </div>
                </div>

                {/* Floating Badge: Active Order */}
                <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-stone-200/80 flex items-center gap-3 animate-in slide-in-from-left duration-500">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-stone-400 uppercase">
                      Live Order #LTC-10482
                    </p>
                    <p className="text-xs font-bold text-stone-800">
                      Boat-Neck Blouse • In Stitching
                    </p>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      Est. Completion: 18 Sep 2026
                    </span>
                  </div>
                </div>

                {/* Floating Badge: Perfect Fit Guarantee */}
                <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-stone-200/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">100% Fit Guarantee</p>
                    <p className="text-[10px] text-stone-500">Free adjustments within 7 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators Bar */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white rounded-2xl shadow-sm border border-stone-200/80">
            <div className="text-center p-3 border-r border-stone-100 last:border-r-0">
              <div className="font-serif text-3xl font-extrabold text-stone-900">500+</div>
              <div className="text-xs font-medium text-stone-500 mt-1">Verified Tailors</div>
            </div>
            <div className="text-center p-3 border-r border-stone-100 last:border-r-0">
              <div className="font-serif text-3xl font-extrabold text-stone-900">10,000+</div>
              <div className="text-xs font-medium text-stone-500 mt-1">Orders Completed</div>
            </div>
            <div className="text-center p-3 border-r border-stone-100 last:border-r-0">
              <div className="font-serif text-3xl font-extrabold text-amber-800 flex items-center justify-center gap-1">
                <Star className="w-6 h-6 fill-amber-500 text-amber-500 inline" />
                <span>4.8 / 5</span>
              </div>
              <div className="text-xs font-medium text-stone-500 mt-1">Average Rating</div>
            </div>
            <div className="text-center p-3">
              <div className="font-serif text-3xl font-extrabold text-stone-900">50+</div>
              <div className="text-xs font-medium text-stone-500 mt-1">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Expert Tailoring Categories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Popular Tailoring & Alteration Services
            </h2>
            <p className="text-sm text-stone-600 mt-2 max-w-xl">
              From bridal aari work and festival blouses to bespoke gentlemen’s trousers, connect
              with master tailors trained in your specific garment.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('find-tailors')}
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline"
          >
            <span>View All 30+ Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, idx) => (
            <div
              key={idx}
              className="atelier-card rounded-2xl overflow-hidden group flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={srv.image}
                  alt={srv.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md text-stone-200 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-white/10">
                  {srv.category}
                </div>
                <div className="absolute bottom-3 right-3 badge-gold px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                  From {srv.startingPrice}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-800 transition-colors">
                      {srv.title}
                    </h3>
                    <span className="text-[11px] text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      {srv.time}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">{srv.description}</p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentView('find-tailors')}
                    className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1"
                  >
                    <span>Browse Tailors</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setCurrentView('smart-match')}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 font-medium transition-colors"
                  >
                    Match Me
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-stone-100/70 py-16 scroll-mt-24 border-y border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Seamless Stitching Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              How Local Tailor Connect Works
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              From your initial measurement to final trial, experience stress-free tailoring with
              milestone-based clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <span className="font-serif text-2xl font-bold text-stone-300">
                      0{step.num}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Match Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 text-white p-8 sm:p-12 overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&auto=format&fit=crop&q=80"
              alt="Tailoring fabric"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Recommendation Engine</span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
              Can't decide which tailor is best for your garment?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Use our 30-second Smart Match wizard. Enter your required garment, budget, and
              deadline, and we’ll match you with the highest-rated specialist near your pincode.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentView('smart-match')}
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Find My Best Match</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1">
            The Local Tailor Difference
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Why Local Tailor Connect?
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            No more repeated boutique visits just to check if cutting has started. We bring modern
            digital trust to the timeless art of custom tailoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {valueProps.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-serif font-bold text-base text-stone-900 mb-2">{item.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-stone-50 py-16 border-t border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Customer Stories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Trusted by 10,000+ Happy Customers
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Read how people in your city got their dream wedding, office, and festive wear tailored.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <span className="inline-block text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                    {t.garment}
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed font-normal italic">
                    {t.comment}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{t.name}</h4>
                    <p className="text-[11px] text-stone-500">{t.city}, Tamil Nadu</p>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    {t.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
