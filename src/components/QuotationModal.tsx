import React from 'react';
import { useApp } from '../context/AppContext';
import { X, FileText, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const QuotationModal: React.FC = () => {
  const {
    isQuotationModalOpen,
    setIsQuotationModalOpen,
    orders,
    selectedOrderId,
    setCurrentView,
  } = useApp();

  if (!isQuotationModalOpen) return null;

  const order =
    orders.find((o) => o.id === selectedOrderId) ||
    orders.find((o) => o.id === 'LTC-10482') ||
    orders[0];

  const quotation = order?.quotation || {
    items: [
      { description: 'Boat-Neck Blouse Base Stitching', price: 450 },
      { description: 'Aari Zari Embroidery & Border Piping', price: 150 },
      { description: 'Doorstep Pickup & Delivery', price: 50 },
    ],
    totalAmount: 650,
    validUntil: 'Valid for 5 days',
  };

  const handleAccept = () => {
    setIsQuotationModalOpen(false);
    setCurrentView('payment');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                Official Estimate
              </span>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Itemized Quotation
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsQuotationModalOpen(false)}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between text-xs text-stone-600 pb-2 border-b border-stone-100">
            <span>Order #{order?.id}</span>
            <span>Boutique: <strong>{order?.tailorShop}</strong></span>
          </div>

          <div className="space-y-2.5">
            <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
              Work Breakdown
            </span>
            <div className="divide-y divide-stone-100 text-xs">
              {quotation.items.map((it, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <span className="text-stone-700">{it.description}</span>
                  <span className="font-bold text-stone-900">₹{it.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl flex items-center justify-between border border-stone-200">
            <div>
              <span className="text-xs font-bold text-stone-900 block">Total Quotation</span>
              <span className="text-[10px] text-stone-500">{quotation.validUntil}</span>
            </div>
            <span className="font-serif text-2xl font-bold text-amber-900">
              ₹{quotation.totalAmount}
            </span>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-[11px] text-stone-700 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0" />
            <span>Price guaranteed. No hidden fees or extra alteration charges.</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={() => setIsQuotationModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              Close
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Accept & Proceed to Pay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
