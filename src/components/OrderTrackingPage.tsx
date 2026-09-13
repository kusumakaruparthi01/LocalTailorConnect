import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  FileText,
  CreditCard,
  Truck,
  Scissors,
  ArrowLeft,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const {
    orders,
    selectedOrderId,
    setCurrentView,
    setIsQuotationModalOpen,
    customer,
    reorderPreviousOrder,
    setIsReviewModalOpen,
  } = useApp();

  const order = orders.find((o) => o.id === selectedOrderId);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-stone-500 text-sm">No order found.</p>
        <button
          onClick={() => setCurrentView('customer-dashboard')}
          className="mt-4 px-4 py-2 bg-amber-800 text-white rounded-xl text-xs font-semibold"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  // All 7 milestone stages
  const milestoneStages = [
    { title: 'Request Submitted', desc: 'Customer requirements & measurements recorded' },
    { title: 'Measurement Confirmed', desc: 'Master tailor verified measurements' },
    { title: 'Cutting', desc: 'Fabric and lining drafted and cut' },
    { title: 'Stitching', desc: 'Garment assembly, sleeves & darts ongoing' },
    { title: 'Alteration', desc: 'Trial fitting adjustment and steam pressing' },
    { title: 'Ready for Pickup', desc: 'Garment inspected, packed & quality checked' },
    { title: 'Completed', desc: 'Handed over or delivered to customer' },
  ];

  const getStageStatus = (stageTitle: string) => {
    const stageMap: Record<string, number> = {
      'Request Received': 1,
      'Request Submitted': 1,
      'Measurement Confirmed': 2,
      'Quote Sent': 2,
      Cutting: 3,
      Stitching: 4,
      Alteration: 5,
      Ready: 6,
      'Ready for Pickup': 6,
      Completed: 7,
    };

    const currentOrderLevel = stageMap[order.status] || 1;
    const thisStageLevel = stageMap[stageTitle] || 1;

    if (currentOrderLevel > thisStageLevel) return 'completed';
    if (currentOrderLevel === thisStageLevel) return 'current';
    return 'pending';
  };

  const handleReorder = () => {
    reorderPreviousOrder(order);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back to Dashboard */}
      <button
        onClick={() => setCurrentView('customer-dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Dashboard</span>
      </button>

      {/* Main Order Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
                Order #{order.id}
              </span>
              <span className="text-xs text-stone-400">• Placed on {order.createdAt}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {order.garmentType} ({order.serviceType})
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Tailored by <strong className="text-stone-900">{order.tailorShop}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setCurrentView('customer-dashboard');
                setTimeout(() => {
                  document.getElementById('messages-tab')?.click();
                }, 100);
              }}
              className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-amber-700" />
              <span>Message Tailor</span>
            </button>

            {order.quotation && (
              <button
                onClick={() => setIsQuotationModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4 text-amber-700" />
                <span>View Quotation</span>
              </button>
            )}

            {order.paymentStatus !== 'Paid' ? (
              <button
                onClick={() => setCurrentView('payment')}
                className="px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" />
                <span>Make Payment</span>
              </button>
            ) : (
              <span className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Paid ₹{order.totalAmount}</span>
              </span>
            )}
          </div>
        </div>

        {/* Quick Highlights Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
            <span className="text-stone-500 block text-[11px]">Current Status</span>
            <span className="font-bold text-stone-900 text-sm mt-0.5 block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              {order.status}
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
            <span className="text-stone-500 block text-[11px]">Estimated Completion</span>
            <span className="font-bold text-stone-900 text-sm mt-0.5 block">
              {order.estimatedCompletion}
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
            <span className="text-stone-500 block text-[11px]">Order Total</span>
            <span className="font-serif font-bold text-amber-900 text-base mt-0.5 block">
              ₹{order.totalAmount}
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
            <span className="text-stone-500 block text-[11px]">Payment Status</span>
            <span
              className={`font-bold text-xs mt-1 inline-block px-2 py-0.5 rounded-md ${
                order.paymentStatus === 'Paid'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Tracker Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="font-serif font-bold text-xl text-stone-900">
            Live Milestone Order Tracker
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Real-time updates as master {order.tailorName} moves your garment through tailoring stages.
          </p>
        </div>

        {/* Visual Timeline Stepper */}
        <div className="relative pl-6 sm:pl-8 space-y-8 border-l-2 border-stone-200 ml-4 py-2">
          {milestoneStages.map((stage, idx) => {
            const status = getStageStatus(stage.title);

            // Find matching timeline event if recorded
            const recordedEvent = order.timeline.find(
              (t) =>
                t.status === stage.title ||
                (stage.title === 'Request Submitted' && t.status === 'Request Received') ||
                (stage.title === 'Ready for Pickup' && t.status === 'Ready')
            );

            return (
              <div key={idx} className="relative group">
                {/* Node icon */}
                <div
                  className={`absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                    status === 'completed'
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                      : status === 'current'
                      ? 'bg-amber-600 text-white ring-4 ring-amber-200 animate-pulse'
                      : 'bg-white border-2 border-stone-300 text-stone-400'
                  }`}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : status === 'current' ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Stage Info */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    status === 'current'
                      ? 'bg-amber-50/60 border-amber-200 ring-1 ring-amber-200 shadow-xs'
                      : status === 'completed'
                      ? 'bg-white border-stone-200'
                      : 'bg-stone-50/50 border-stone-100 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4
                      className={`font-serif font-bold text-sm ${
                        status === 'current'
                          ? 'text-amber-900'
                          : status === 'completed'
                          ? 'text-stone-900'
                          : 'text-stone-500'
                      }`}
                    >
                      {stage.title}
                    </h4>

                    {recordedEvent && recordedEvent.timestamp !== 'Pending' ? (
                      <span className="text-[11px] font-medium text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {recordedEvent.timestamp}
                      </span>
                    ) : (
                      status === 'current' && (
                        <span className="text-[11px] font-bold text-amber-700">In Progress Now</span>
                      )
                    )}
                  </div>

                  <p className="text-xs text-stone-600 mt-1">{stage.desc}</p>

                  {recordedEvent?.note && (
                    <div className="mt-2.5 pt-2 border-t border-stone-200/60 text-[11px] text-stone-700 italic flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Note: {recordedEvent.note}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Specifications, Reference Photos & Delivery Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Requirements & Measurements */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
            <Scissors className="w-4 h-4 text-amber-700" />
            <span>Garment Specifications & Profile</span>
          </h3>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 text-xs text-stone-700 space-y-2">
            <div>
              <span className="font-semibold text-stone-500 block">Design Requirements:</span>
              <p className="italic mt-0.5">{order.requirements}</p>
            </div>
            <div className="pt-2 border-t border-stone-200/60">
              <span className="font-semibold text-stone-500 block">Measurement Profile:</span>
              <p className="font-medium text-stone-900 mt-0.5">
                {order.measurementProfileName} (Bust: {order.measurements.bust || 34}", Waist:{' '}
                {order.measurements.waist || 28}", Sleeve: {order.measurements.sleeveLength || 17}")
              </p>
            </div>
          </div>

          {order.referenceImages.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-stone-700 block">
                Reference Design Photo:
              </span>
              <div className="rounded-2xl overflow-hidden border border-stone-200 max-h-48">
                <img
                  src={order.referenceImages[0]}
                  alt="Reference garment"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Tailor Contact & Delivery Details */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-700" />
            <span>Tailor & Delivery Contact</span>
          </h3>

          <div className="space-y-3 text-xs text-stone-700">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-stone-900">{order.tailorShop}</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Master: {order.tailorName}</p>
                <p className="text-[11px] text-stone-500">{order.tailorPhone}</p>
              </div>
              <a
                href={`tel:${order.tailorPhone}`}
                className="p-2 bg-white rounded-xl border border-stone-200 text-amber-800 hover:bg-stone-50"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
              <span className="font-semibold text-stone-500 block text-[11px]">
                Delivery Preference:
              </span>
              <div className="font-bold text-stone-900">{order.deliveryOption}</div>
              {order.deliveryAddress && (
                <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                  Address: {order.deliveryAddress}
                </p>
              )}
            </div>
          </div>

          <div className="pt-2">
            {order.status === 'Completed' ? (
              <div className="flex gap-2">
                <button
                  onClick={handleReorder}
                  className="flex-1 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reorder this Garment</span>
                </button>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold"
                >
                  Rate Tailor
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-2 text-[11px] text-stone-700">
                <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0" />
                <span>Protected by Local Tailor Connect 7-Day Fit Guarantee</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
