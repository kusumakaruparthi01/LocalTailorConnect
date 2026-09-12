import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MeasurementProfilesView } from './MeasurementProfilesView';
import {
  ShoppingBag,
  Clock,
  Heart,
  Ruler,
  Calendar,
  MessageSquare,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  FileText,
  MapPin,
  Send,
  Plus,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    customer,
    orders,
    tailors,
    setCurrentView,
    setSelectedOrderId,
    setSelectedTailorId,
    setIsCustomRequestOpen,
    reorderPreviousOrder,
    messages,
    sendMessage,
    appointments,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'orders' | 'measurements' | 'saved' | 'appointments' | 'messages'
  >('orders');

  // Active customer orders
  const customerOrders = orders.filter((o) => o.customerId === customer.id);
  const activeOrders = customerOrders.filter((o) => o.status !== 'Completed');
  const completedOrders = customerOrders.filter((o) => o.status === 'Completed');

  // Saved tailors list
  const savedTailorsList = tailors.filter((t) => customer.savedTailorIds.includes(t.id));

  // Chat message state
  const [chatInput, setChatInput] = useState('');
  const [activeChatTailorId, setActiveChatTailorId] = useState('tailor_01');

  const currentChatTailor =
    tailors.find((t) => t.id === activeChatTailorId) || tailors[0];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMessage({
      orderId: 'LTC-10482',
      senderId: customer.id,
      senderName: customer.name,
      senderRole: 'customer',
      recipientId: currentChatTailor.id,
      text: chatInput.trim(),
    });
    setChatInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Welcome Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
            Customer Portal
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Welcome back, {customer.name}
          </h1>
          <p className="text-xs text-stone-500 mt-1 flex items-center gap-2">
            <span>📍 {customer.city}</span>
            <span>•</span>
            <span>{customer.phone}</span>
            <span>•</span>
            <span>{activeOrders.length} active custom garments</span>
          </p>
        </div>

        <button
          onClick={() => setCurrentView('find-tailors')}
          className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Tailoring Request</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-200 pb-1 text-xs sm:text-sm font-semibold text-stone-600 no-scrollbar">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'orders'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'hover:bg-stone-100 text-stone-700'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Orders ({customerOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('measurements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'measurements'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'hover:bg-stone-100 text-stone-700'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>Measurement Profiles</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'saved'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'hover:bg-stone-100 text-stone-700'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Tailors ({savedTailorsList.length})</span>
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
          <span>Appointments ({appointments.length})</span>
        </button>

        <button
          id="messages-tab"
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'messages'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'hover:bg-stone-100 text-stone-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Messages</span>
        </button>
      </div>

      {/* Tab 1: Orders (Active & History) */}
      {activeTab === 'orders' && (
        <div className="space-y-8">
          {/* Active Orders Section */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-700" />
              <span>Active Orders in Progress ({activeOrders.length})</span>
            </h2>

            {activeOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full">
                            #{ord.id}
                          </span>
                          <h3 className="font-serif font-bold text-lg text-stone-900 mt-1.5">
                            {ord.garmentType} ({ord.serviceType})
                          </h3>
                          <p className="text-xs text-stone-500">
                            Boutique: <strong className="text-stone-800">{ord.tailorShop}</strong>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-serif font-bold text-amber-900 text-base">
                            ₹{ord.totalAmount}
                          </span>
                          <span className="text-[10px] block text-stone-400">
                            {ord.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Progress snippet */}
                      <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-stone-600 font-medium">Stage: {ord.status}</span>
                          <span className="text-stone-500 text-[11px]">
                            Est: {ord.estimatedCompletion}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-700 rounded-full"
                            style={{
                              width:
                                ord.status === 'Completed'
                                  ? '100%'
                                  : ord.status === 'Ready'
                                  ? '85%'
                                  : ord.status === 'Alteration'
                                  ? '70%'
                                  : ord.status === 'Stitching'
                                  ? '55%'
                                  : ord.status === 'Cutting'
                                  ? '35%'
                                  : '15%',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedOrderId(ord.id);
                          setCurrentView('track-order');
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                      >
                        <span>Track Live Progress</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-3">
                <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="text-xs text-stone-500">You have no active tailoring orders right now.</p>
                <button
                  onClick={() => setCurrentView('find-tailors')}
                  className="px-4 py-2 bg-amber-800 text-white text-xs font-semibold rounded-xl"
                >
                  Find a Tailor
                </button>
              </div>
            )}
          </div>

          {/* Completed Orders / Order History */}
          <div className="space-y-4 pt-4">
            <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>Order History & Previous Garments</span>
            </h2>

            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Garment</th>
                      <th className="p-4">Tailor</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Amount</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {completedOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="p-4 font-bold text-stone-900">#{ord.id}</td>
                        <td className="p-4 font-medium text-stone-800">
                          {ord.garmentType}
                          <span className="text-[10px] text-stone-400 block">{ord.serviceType}</span>
                        </td>
                        <td className="p-4 text-stone-600">{ord.tailorShop}</td>
                        <td className="p-4 text-stone-500">{ord.createdAt}</td>
                        <td className="p-4 text-right font-serif font-bold text-stone-900">
                          ₹{ord.totalAmount}
                        </td>
                        <td className="p-4 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                            Completed
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => reorderPreviousOrder(ord)}
                            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center gap-1 ml-auto"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reorder</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Measurement Profiles */}
      {activeTab === 'measurements' && <MeasurementProfilesView />}

      {/* Tab 3: Saved Tailors */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">
            My Favorite Tailor Boutiques ({savedTailorsList.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTailorsList.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.shopName}
                    className="w-14 h-14 rounded-2xl object-cover border border-stone-200"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900">{t.shopName}</h3>
                    <p className="text-xs text-stone-500">{t.address}, {t.city}</p>
                    <span className="text-xs font-bold text-amber-800">⭐ {t.rating}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => {
                      setSelectedTailorId(t.id);
                      setCurrentView('tailor-profile');
                    }}
                    className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl text-center"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTailorId(t.id);
                      setIsCustomRequestOpen(true);
                    }}
                    className="flex-1 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-xl text-center shadow-xs"
                  >
                    Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">
            Upcoming Appointments & Trials ({appointments.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full">
                    {apt.appointmentType || apt.type}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {apt.status}
                  </span>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900">
                    {apt.tailorShop}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1">
                    📅 <strong>{apt.date}</strong> at <strong>{apt.timeSlot}</strong>
                  </p>
                  {apt.notes && <p className="text-xs text-stone-500 italic mt-1">{apt.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Messages */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
          {/* Left conversations list */}
          <div className="md:col-span-4 border-r border-stone-200 p-4 space-y-3 bg-stone-50/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-2">
              Conversations
            </h3>
            {tailors.slice(0, 3).map((t) => (
              <div
                key={t.id}
                onClick={() => setActiveChatTailorId(t.id)}
                className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3 ${
                  activeChatTailorId === t.id
                    ? 'bg-white border border-stone-200 shadow-xs ring-1 ring-stone-200'
                    : 'hover:bg-stone-100'
                }`}
              >
                <img
                  src={t.avatar}
                  alt={t.shopName}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-stone-900 truncate">{t.shopName}</h4>
                  <p className="text-[11px] text-stone-500 truncate">Tap to chat with master</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right active chat window */}
          <div className="md:col-span-8 flex flex-col justify-between h-full">
            {/* Chat header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <img
                  src={currentChatTailor.avatar}
                  alt={currentChatTailor.shopName}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-stone-900">
                    {currentChatTailor.shopName}
                  </h4>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    ● Online • Active Order #LTC-10482
                  </span>
                </div>
              </div>
            </div>

            {/* Chat messages */}
            <div className="p-4 space-y-3 overflow-y-auto max-h-80 flex-1 bg-stone-50/30">
              {messages.map((m) => {
                const isMe = m.senderRole === 'customer';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`p-3 rounded-2xl max-w-sm text-xs leading-relaxed ${
                        isMe
                          ? 'bg-amber-800 text-white rounded-br-xs'
                          : 'bg-white border border-stone-200 text-stone-800 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] text-stone-400 mt-0.5 px-1">{m.timestamp}</span>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleSendChat}
              className="p-3 border-t border-stone-200 bg-white flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about neck depth, sleeve piping, or delivery time..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 text-xs p-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-800"
              />
              <button
                type="submit"
                className="p-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
