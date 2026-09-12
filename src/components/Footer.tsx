import React from 'react';
import { useApp } from '../context/AppContext';
import { Scissors, Heart, Phone, Mail, MapPin, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setRole } = useApp();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow-md">
                <Scissors className="w-5 h-5 text-amber-200" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                Local Tailor Connect
              </span>
            </div>
            <p className="text-stone-400 text-sm font-serif italic max-w-sm">
              “Your perfect fit, just around the corner.”
            </p>
            <p className="text-stone-400 text-xs leading-relaxed max-w-md">
              Bridging the gap between discerning customers and master local tailors across India.
              Experience made-to-measure ethnic wear, precise alterations, and transparent tracking.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#social"
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-amber-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#social"
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-amber-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#social"
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-amber-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#social"
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-amber-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('home')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('find-tailors')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Find Tailors
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('smart-match')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Smart Tailor Matching
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    setTimeout(() => {
                      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Popular Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    setTimeout(() => {
                      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* For Tailors */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">For Tailors</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setRole('tailor');
                    setCurrentView('tailor-register');
                  }}
                  className="text-amber-400 font-semibold hover:text-amber-300 transition-colors"
                >
                  Become a Partner Tailor
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setRole('tailor');
                    setCurrentView('tailor-login');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Tailor Portal Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setRole('tailor');
                    setCurrentView('tailor-dashboard');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Order Management Kanban
                </button>
              </li>
              <li>
                <span className="text-stone-500">Digital Measurement Cloud</span>
              </li>
              <li>
                <span className="text-stone-500">Fast Quotation Generator</span>
              </li>
            </ul>
          </div>

          {/* Contact & Cities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Active Cities</h4>
            <p className="text-xs text-stone-400">
              Pudukkottai • Trichy • Madurai • Chennai • Coimbatore • Salem • Thanjavur
            </p>
            <div className="pt-2 space-y-1.5 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>+91 (04322) 224455 / Helpdesk</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>support@localtailorconnect.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Tamil Nadu, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Local Tailor Connect. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#terms" className="hover:text-stone-400">
              Terms & Conditions
            </a>
            <a href="#privacy" className="hover:text-stone-400">
              Privacy Policy
            </a>
            <a href="#trust" className="hover:text-stone-400">
              Measurement Guarantee
            </a>
            <button
              onClick={() => {
                setRole('admin');
                setCurrentView('admin-dashboard');
              }}
              className="text-stone-600 hover:text-amber-400"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
