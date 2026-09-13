import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';
import {
  Scissors,
  Clock,
  TrendingUp,
  Star,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Plus,
  Send,
  Eye,
  AlertCircle,
  IndianRupee,
  Settings,
  Ruler,
} from 'lucide-react';

const customerInitial = (name?: string) => name?.trim().charAt(0).toUpperCase() || 'C';
const formatChatTime = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
};

export const TailorDashboard: React.FC = () => {
  const {
    currentUser,
    tailorProfile,
    orders,
    updateOrderStatus,
    sendQuotation,
    addToast,
    messages,
    sendMessage,
    appointments,
    setCurrentView,
    setSelectedOrderId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'services' | 'appointments' | 'chat'>('orders');

  // Quotation form modal/state
  const [activeQuotingOrderId, setActiveQuotingOrderId] = useState<string | null>(null);
  const [quoteItems, setQuoteItems] = useState([
    { description: 'Blouse Base Stitching & Lining', price: 450 },
    { description: 'Aari Hand Embroidery & Piping', price: 200 },
  ]);
  const [estimatedDays, setEstimatedDays] = useState(4);

  // Chat state
  const [chatText, setChatText] = useState('');

  // Tailor's orders
  const tailorOrders = orders.filter((o) => o.tailorId === tailorProfile.id);
  const activeOrders = tailorOrders.filter((o) => o.status !== 'Completed');
  const [activeChatOrderId, setActiveChatOrderId] = useState('');
  const activeChatOrder = tailorOrders.find((order) => order.id === activeChatOrderId) || tailorOrders[0];
  const activeChatMessages = messages.filter((message) => message.orderId === activeChatOrder?.id);
  const monthlyEarnings = tailorOrders
    .filter((order) => order.paymentStatus === 'Paid')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const statusOptions: OrderStatus[] = [
    'Request Received',
    'Quote Sent',
    'Cutting',
    'Stitching',
    'Alteration',
    'Ready',
    'Completed',
  ];

  const handleSendQuote = (orderId: string) => {
    const total = quoteItems.reduce((acc, curr) => acc + curr.price, 0);
    sendQuotation(orderId, {
      items: quoteItems,
      totalAmount: total,
      validUntil: '3 days from issue',
    });
    setActiveQuotingOrderId(null);
  };

  const handleSendTailorChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() || !activeChatOrder) return;
    sendMessage({
      orderId: activeChatOrder.id,
      text: chatText.trim(),
    });
    setChatText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
            <Scissors className="w-3.5 h-3.5" />
            <span>Master Tailor Workshop Console</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            {tailorProfile.shopName}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Master {tailorProfile.name} • {tailorProfile.address}, {tailorProfile.city} •{' '}
            {tailorProfile.phone}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Workshop Online</span>
          </span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
            Active Orders
          </span>
          <div className="font-serif text-3xl font-bold text-stone-900 mt-1">
            {activeOrders.length}
          </div>
          <span className="text-[11px] text-amber-800 mt-1 block">In cutting & stitching</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
            This Month Earnings
          </span>
          <div className="font-serif text-3xl font-bold text-stone-900 mt-1">₹{monthlyEarnings}</div>
          <span className="text-[11px] text-emerald-700 mt-1 block font-medium">Recorded paid orders</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
            Shop Rating
          </span>
          <div className="font-serif text-3xl font-bold text-amber-800 mt-1 flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500 inline" />
            <span>{tailorProfile.rating}</span>
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Across {tailorProfile.reviewCount} customer reviews
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
            Appointments
          </span>
          <div className="font-serif text-3xl font-bold text-stone-900 mt-1">
            {appointments.length}
          </div>
          <span className="text-[11px] text-blue-700 mt-1 block">Fitting room booked</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-1 text-xs sm:text-sm font-semibold text-stone-600">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'orders'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'hover:bg-stone-100 text-stone-700'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Orders Management ({tailorOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'services'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'hover:bg-stone-100 text-stone-700'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Services & Rates</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'appointments'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'hover:bg-stone-100 text-stone-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Appointments</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'chat'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'hover:bg-stone-100 text-stone-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Client Messages</span>
        </button>
      </div>

      {/* TAB 1: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Active Orders & Workshop Milestones
            </h2>
            <span className="text-xs text-stone-500">
              Update stage to send automated notifications to customer
            </span>
          </div>

          <div className="space-y-4">
            {tailorOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full">
                        #{ord.id}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        Customer: <strong>{ord.customerName}</strong> ({ord.customerPhone})
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-stone-900">
                      {ord.garmentType} • {ord.serviceType}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs text-stone-400 block">Total Quotation</span>
                      <span className="font-serif font-bold text-base text-stone-900">
                        ₹{ord.totalAmount}
                      </span>
                    </div>

                    {/* Milestone Status Dropdown Selector */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block">
                        Update Status:
                      </label>
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          updateOrderStatus(
                            ord.id,
                            e.target.value as OrderStatus,
                            `Workshop status updated to ${e.target.value}`
                          )
                        }
                        className="text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => setActiveQuotingOrderId(ord.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold"
                    >
                      Itemized Quote
                    </button>

                    <button
                      onClick={() => {
                        setSelectedOrderId(ord.id);
                        setCurrentView('track-order');
                      }}
                      className="p-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100"
                      title="View tracking"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Garment Details & Measurements */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-700">
                  <div className="p-3 bg-stone-50 rounded-2xl">
                    <span className="font-bold text-stone-900 block mb-1">
                      Customer Requirements:
                    </span>
                    <p className="italic text-stone-600">{ord.requirements}</p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-2xl">
                    <span className="font-bold text-stone-900 block mb-1">
                      Measurements ({ord.measurementProfileName}):
                    </span>
                    <p className="text-stone-700">
                      Bust: <strong>{ord.measurements.bust}"</strong> • Waist:{' '}
                      <strong>{ord.measurements.waist}"</strong> • Shoulder:{' '}
                      <strong>{ord.measurements.shoulder}"</strong> • Sleeve:{' '}
                      <strong>{ord.measurements.sleeveLength}"</strong>
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-2xl">
                    <span className="font-bold text-stone-900 block mb-1">
                      Delivery & Timeline:
                    </span>
                    <p className="text-stone-600">
                      Mode: <strong>{ord.deliveryOption}</strong>
                    </p>
                    <p className="text-stone-500 text-[11px] mt-0.5">
                      Deadline: {ord.estimatedCompletion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Services & Rates */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Services & Starting Price Menu
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Customize the services visible to customers on your public profile.
              </p>
            </div>
            <button
              onClick={() => addToast('info', 'Add Service', 'New service added to your boutique.')}
              className="px-4 py-2 bg-amber-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {tailorProfile.services.map((s) => (
              <div key={s.id} className="py-4 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <h4 className="font-bold text-stone-900">{s.name}</h4>
                  <p className="text-xs text-stone-500">{s.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-serif font-bold text-amber-900 text-base">
                    ₹{s.startingPrice}
                  </span>
                  <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-md">
                    {s.estimatedTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Appointments */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="font-serif text-xl font-bold text-stone-900">
            Fitting Trial Room Bookings ({appointments.length})
          </h2>

          <div className="space-y-3">
            {appointments.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-2xl border border-stone-200 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-stone-900">{a.customerName}</h4>
                  <p className="text-stone-500 mt-0.5">
                    {a.appointmentType || a.type}{a.customerPhone ? ` • Phone: ${a.customerPhone}` : ''}
                  </p>
                  <p className="text-stone-700 font-medium mt-1">
                    📅 {a.date} at {a.timeSlot}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-lg border border-emerald-200">
                    Confirmed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Client Messages */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-stone-200 bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-sm font-bold">
                {customerInitial(activeChatOrder?.customerName)}
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  {activeChatOrder ? activeChatOrder.customerName : 'No customer conversations'}
                </h3>
                <span className="text-[11px] text-stone-500">
                  {activeChatOrder ? `${activeChatOrder.garmentType} · Order #${activeChatOrder.orderNumber || activeChatOrder.id}` : 'New conversations appear with customer orders.'}
                </span>
              </div>
            </div>
            {tailorOrders.length > 0 && (
              <select
                value={activeChatOrder?.id || ''}
                onChange={(event) => setActiveChatOrderId(event.target.value)}
                className="text-xs border border-stone-200 rounded-xl px-3 py-2.5 bg-white"
              >
                {tailorOrders.map((order) => (
                  <option key={order.id} value={order.id}>{order.customerName} · {order.garmentType}</option>
                ))}
              </select>
            )}
          </div>

          <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-stone-50/30">
            {activeChatOrder && activeChatMessages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <MessageSquare className="w-8 h-8 text-stone-300 mb-2" />
                <p className="text-sm font-semibold text-stone-600">No messages yet</p>
                <p className="text-xs text-stone-400 mt-1">Send a welcome message or wait for the customer.</p>
              </div>
            )}
            {!activeChatOrder && (
              <div className="h-full flex items-center justify-center text-xs text-stone-400">
                Customer conversations will appear here.
              </div>
            )}
            {activeChatMessages.map((m) => {
              const isTailor = m.senderId === currentUser?.id;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isTailor ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-sm text-xs leading-relaxed ${
                      isTailor
                        ? 'bg-amber-800 text-white rounded-br-xs'
                        : 'bg-white border border-stone-200 text-stone-800 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-0.5 px-1">
                    {isTailor ? 'You' : m.senderName} · {formatChatTime(m.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={handleSendTailorChat}
            className="p-3 border-t border-stone-200 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Send message to customer..."
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              disabled={!activeChatOrder}
              className="flex-1 text-xs p-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-800"
            />
            <button
              type="submit"
              disabled={!activeChatOrder || !chatText.trim()}
              className="p-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Itemized Quotation Modal */}
      {activeQuotingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-5">
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Send Itemized Quotation
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Breakdown of fabric, embroidery, and stitching costs for Order #{activeQuotingOrderId}
              </p>
            </div>

            <div className="space-y-3">
              {quoteItems.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...quoteItems];
                      updated[idx].description = e.target.value;
                      setQuoteItems(updated);
                    }}
                    className="flex-1 text-xs p-2 border border-stone-200 rounded-xl"
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => {
                      const updated = [...quoteItems];
                      updated[idx].price = Number(e.target.value);
                      setQuoteItems(updated);
                    }}
                    className="w-20 text-xs p-2 border border-stone-200 rounded-xl text-right font-bold"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between text-xs font-bold pt-2 border-t border-stone-100">
              <span>Total Price:</span>
              <span className="text-amber-800 text-sm">
                ₹{quoteItems.reduce((acc, c) => acc + c.price, 0)}
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveQuotingOrderId(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSendQuote(activeQuotingOrderId)}
                className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Send Quotation to Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
