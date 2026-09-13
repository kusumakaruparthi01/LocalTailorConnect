import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Smartphone,
  Building2,
  Banknote,
  QrCode,
} from 'lucide-react';

export const PaymentPage: React.FC = () => {
  const {
    orders,
    selectedOrderId,
    setCurrentView,
    markOrderAsPaid,
    addToast,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const order = orders.find((o) => o.id === selectedOrderId);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      markOrderAsPaid(order.id);
      addToast(
        'warning',
        'Payment provider not configured',
        'No charge was made and this order was not marked as paid.'
      );
      setCurrentView('track-order');
    }, 1200);
  };

  if (!order) {
    return <div className="max-w-4xl mx-auto py-12 px-4 text-center text-sm text-stone-500">Select one of your orders before opening payment.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <button
        onClick={() => setCurrentView('track-order')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Order Tracking</span>
      </button>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Escrow Payment & Fitting Guarantee
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Order #{order.id} • Tailored by <strong>{order.tailorShop}</strong>
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-stone-400 block">Total Payable</span>
          <span className="font-serif text-3xl font-bold text-amber-900">₹{order.totalAmount}</span>
        </div>
      </div>

      {/* Escrow Protection Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs text-stone-700">
        <ShieldCheck className="w-5 h-5 text-amber-800 mt-0.5 shrink-0" />
        <div>
          <span className="font-bold text-amber-900 block">100% Escrow Protection:</span>
          <span>
            Your funds are held securely by Local Tailor Connect and only released to the tailor
            after you try on your garment and confirm the fitting.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Payment Method Selection & Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <h3 className="font-serif font-bold text-base text-stone-900">Select Payment Method</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'upi', label: 'UPI / QR', icon: <Smartphone className="w-4 h-4" /> },
              { id: 'card', label: 'Card', icon: <CreditCard className="w-4 h-4" /> },
              { id: 'netbanking', label: 'Net Banking', icon: <Building2 className="w-4 h-4" /> },
              { id: 'cod', label: 'Pay on Trial', icon: <Banknote className="w-4 h-4" /> },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMethod(m.id as any)}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === m.id
                    ? 'border-amber-800 bg-amber-50 text-amber-900 ring-1 ring-amber-800 shadow-xs'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handlePay} className="space-y-4 pt-2">
            {/* UPI Option */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Enter UPI ID / VPA</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. mobile@upi or username@okhdfcbank"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
                    required
                  />
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <QrCode className="w-8 h-8 text-stone-600" />
                    <div>
                      <div className="text-xs font-bold text-stone-900">Scan & Pay with Any App</div>
                      <div className="text-[11px] text-stone-500">GPay, PhonePe, Paytm, BHIM</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-800">Verified QR</span>
                </div>
              </div>
            )}

            {/* Card Option */}
            {paymentMethod === 'card' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-xl"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking */}
            {paymentMethod === 'netbanking' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-700">Select Bank</label>
                <select className="w-full text-xs p-2.5 border border-stone-300 rounded-xl bg-white">
                  <option>State Bank of India (SBI)</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Canara Bank</option>
                </select>
              </div>
            )}

            {/* Cash on Delivery / Fitting */}
            {paymentMethod === 'cod' && (
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-xs text-stone-700 leading-relaxed">
                You can inspect the garment, try the fit in your home or at the shop, and pay via cash
                or UPI directly upon collection.
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-amber-800 hover:bg-amber-900 disabled:bg-stone-300 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {isProcessing ? (
                <span>Securing Escrow Payment...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    Pay ₹{order.totalAmount} • Authorize Escrow
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Itemized Bill Summary */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-5">
          <h3 className="font-serif font-bold text-base text-stone-900">Order Bill Summary</h3>

          <div className="space-y-3 text-xs text-stone-700">
            <div className="flex justify-between">
              <span>{order.garmentType} Base Stitching</span>
              <span className="font-semibold">₹450</span>
            </div>
            <div className="flex justify-between">
              <span>Embroidery / Design Detailing</span>
              <span className="font-semibold">₹150</span>
            </div>
            <div className="flex justify-between">
              <span>Doorstep Pickup & Delivery</span>
              <span className="font-semibold">₹50</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>7-Day Fit Alteration Protection</span>
              <span>FREE</span>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
              <span>Total Amount</span>
              <span className="text-amber-900 font-serif text-lg">₹{order.totalAmount}</span>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-[11px] text-stone-500 space-y-1">
            <p className="font-semibold text-stone-800">Boutique Cancellation Policy:</p>
            <p>100% full refund available if cancelled before fabric cutting begins.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
