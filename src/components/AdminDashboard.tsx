import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Users,
  ShoppingBag,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Filter,
  AlertTriangle,
  Award,
  IndianRupee,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { tailors, orders, verifyTailor, setCurrentView, setSelectedOrderId } = useApp();

  const [activeTab, setActiveTab] = useState<'verifications' | 'orders' | 'tailors'>('verifications');
  const [searchTerm, setSearchTerm] = useState('');

  const pendingVerifications = tailors.filter((tailor) => !tailor.isVerified);

  const handleApprove = (shopName: string, id: string) => {
    verifyTailor(id, true);
  };

  const handleReject = (shopName: string, id: string) => {
    verifyTailor(id, false);
  };

  const totalGMV = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const platformRevenue = Math.round(totalGMV * 0.05);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Admin Control Center</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Local Tailor Connect Administration
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Managing tailor verifications, quality assurance, dispute mediation & escrow
            reconciliations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SuperAdmin Access</span>
          </span>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
            Verified Partner Tailors
          </span>
          <div className="font-serif text-3xl font-bold text-stone-900 mt-1">{tailors.filter((tailor) => tailor.isVerified).length}</div>
          <span className="text-[11px] text-emerald-700 mt-1 block font-medium">
            Across {new Set(tailors.map((tailor) => tailor.city)).size} cities
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
            Total Completed Orders
          </span>
          <div className="font-serif text-3xl font-bold text-stone-900 mt-1">{orders.filter((order) => order.status === 'Completed').length}</div>
          <span className="text-[11px] text-stone-500 mt-1 block">Recorded completed orders</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
            Gross Merch. Volume (GMV)
          </span>
          <div className="font-serif text-3xl font-bold text-amber-900 mt-1">
            ₹{(totalGMV / 100000).toFixed(2)} Lakhs
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">Direct to Local Masters</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
            Platform Take Rate (5%)
          </span>
          <div className="font-serif text-3xl font-bold text-emerald-800 mt-1">
            ₹{platformRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">Platform fee collected</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-1 text-xs sm:text-sm font-semibold text-stone-600">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'verifications'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'hover:bg-stone-100 text-stone-700'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Pending Verifications ({pendingVerifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'orders'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'hover:bg-stone-100 text-stone-700'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>All Platform Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tailors')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'tailors'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'hover:bg-stone-100 text-stone-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Active Boutiques ({tailors.length})</span>
        </button>
      </div>

      {/* TAB 1: Verifications */}
      {activeTab === 'verifications' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Tailor Shop Verifications Queue
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Verify business proof, government identification, and craftsmanship quality before
                enabling public listing.
              </p>
            </div>
          </div>

          {pendingVerifications.length > 0 ? (
            <div className="divide-y divide-stone-100">
              {pendingVerifications.map((p) => (
                <div
                  key={p.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-stone-900">{p.shopName}</h4>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                        {p.specializations.join(', ') || 'General tailoring'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      Master: <strong>{p.name}</strong> • {p.city} • {p.phone}
                    </p>
                    <p className="text-[11px] text-stone-400">
                      Account pending identity and business verification
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReject(p.shopName, p.id)}
                      className="px-3.5 py-1.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(p.shopName, p.id)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs"
                    >
                      Approve & Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-stone-500 text-xs">
              All tailor applications have been audited and verified.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: All Platform Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Platform Transaction History
            </h3>
            <span className="text-xs text-stone-500">Live order audit stream</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Tailor Shop</th>
                  <th className="p-4">Garment</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="p-4 font-bold text-stone-900">#{ord.id}</td>
                    <td className="p-4 font-medium text-stone-800">{ord.customerName}</td>
                    <td className="p-4 text-stone-600">{ord.tailorShop}</td>
                    <td className="p-4 text-stone-700">{ord.garmentType}</td>
                    <td className="p-4 text-right font-serif font-bold text-amber-900">
                      ₹{ord.totalAmount}
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrderId(ord.id);
                          setCurrentView('track-order');
                        }}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Active Boutiques */}
      {activeTab === 'tailors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tailors.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.shopName}
                  className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-stone-900">{t.shopName}</h4>
                  <p className="text-xs text-stone-500">
                    Master: {t.name} • {t.city}
                  </p>
                  <span className="text-xs font-bold text-amber-800">
                    ⭐ {t.rating} ({t.reviewCount})
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-stone-600 pt-2 border-t border-stone-100 flex justify-between">
                <span>Experience: {t.experienceYears} yrs</span>
                <span className="text-emerald-700 font-semibold">Verified Partner</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
