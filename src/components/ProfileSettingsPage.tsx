import React, { useEffect, useState } from 'react';
import { ArrowLeft, Building2, Mail, MapPin, Phone, Save, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileSettingsPage: React.FC = () => {
  const { currentUser, updateProfile, navigateToDashboard } = useApp();
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [shopName, setShopName] = useState(currentUser?.shopName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(currentUser?.name || '');
    setPhone(currentUser?.phone || '');
    setCity(currentUser?.city || '');
    setShopName(currentUser?.shopName || '');
  }, [currentUser]);

  if (!currentUser) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSaving(true);
    const result = await updateProfile({
      name,
      phone,
      city,
      shopName: currentUser.role === 'tailor' ? shopName : undefined,
    });
    setIsSaving(false);
    if (!result.success) setError(result.message || 'Unable to update profile.');
  };

  const initial = currentUser.name.trim().charAt(0).toUpperCase() || 'U';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <button
        type="button"
        onClick={navigateToDashboard}
        className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-amber-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </button>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-6 py-7 sm:px-9 border-b border-stone-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-800 text-white flex items-center justify-center text-xl font-bold shadow-sm">
            {initial}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-950">Edit profile</h1>
            <p className="text-sm text-stone-500 mt-1">Keep your account and contact details current.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-9 space-y-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-5">
            <label className="space-y-2 text-sm font-semibold text-stone-700">
              <span>Full name</span>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  minLength={2}
                  maxLength={100}
                  required
                  className="w-full rounded-xl border border-stone-300 py-3 pl-10 pr-3 font-normal focus:outline-none focus:border-amber-800"
                />
              </div>
            </label>

            <label className="space-y-2 text-sm font-semibold text-stone-700">
              <span>Email address</span>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                <input
                  value={currentUser.email}
                  readOnly
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-3 font-normal text-stone-500"
                />
              </div>
            </label>

            <label className="space-y-2 text-sm font-semibold text-stone-700">
              <span>Phone number</span>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  minLength={7}
                  maxLength={30}
                  required
                  className="w-full rounded-xl border border-stone-300 py-3 pl-10 pr-3 font-normal focus:outline-none focus:border-amber-800"
                />
              </div>
            </label>

            <label className="space-y-2 text-sm font-semibold text-stone-700">
              <span>City or town</span>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                <input
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  minLength={2}
                  maxLength={100}
                  required
                  className="w-full rounded-xl border border-stone-300 py-3 pl-10 pr-3 font-normal focus:outline-none focus:border-amber-800"
                />
              </div>
            </label>
          </div>

          {currentUser.role === 'tailor' && (
            <label className="space-y-2 text-sm font-semibold text-stone-700 block">
              <span>Workshop or boutique name</span>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                <input
                  value={shopName}
                  onChange={(event) => setShopName(event.target.value)}
                  minLength={2}
                  maxLength={150}
                  required
                  className="w-full rounded-xl border border-stone-300 py-3 pl-10 pr-3 font-normal focus:outline-none focus:border-amber-800"
                />
              </div>
            </label>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-800 px-6 py-3 text-sm font-bold text-white hover:bg-amber-900 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
