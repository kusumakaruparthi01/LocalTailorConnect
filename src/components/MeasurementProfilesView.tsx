import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MeasurementProfile } from '../types';
import {
  Ruler,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Info,
  Save,
  X,
} from 'lucide-react';

export const MeasurementProfilesView: React.FC = () => {
  const {
    measurementProfiles,
    addMeasurementProfile,
    updateMeasurementProfile,
    deleteMeasurementProfile,
    customer,
  } = useApp();

  const [activeProfileId, setActiveProfileId] = useState<string>(
    measurementProfiles[0]?.id || ''
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Profile being edited or viewed
  const currentProfile =
    measurementProfiles.find((p) => p.id === activeProfileId) || measurementProfiles[0];

  const [editValues, setEditValues] = useState(currentProfile?.measurements || {});
  const [editName, setEditName] = useState(currentProfile?.profileName || '');

  // New profile form state
  const [newProfileName, setNewProfileName] = useState('Festive & Party Wear');
  const [newCategory, setNewCategory] = useState<'Women' | 'Men' | 'General'>('Women');
  const [newMeasurements, setNewMeasurements] = useState({
    bust: 34,
    waist: 28,
    hip: 36,
    shoulder: 14,
    sleeveLength: 16,
    blouseLength: 14,
    armHole: 15,
    frontNeckDepth: 7,
    backNeckDepth: 8.5,
  });

  const handleStartEdit = (profile: MeasurementProfile) => {
    setActiveProfileId(profile.id);
    setEditName(profile.profileName);
    setEditValues({ ...profile.measurements });
    setIsEditing(true);
    setIsCreatingNew(false);
  };

  const handleSaveEdit = () => {
    if (!currentProfile) return;
    updateMeasurementProfile(currentProfile.id, {
      profileName: editName,
      measurements: editValues,
    });
    setIsEditing(false);
  };

  const handleCreateNew = () => {
    addMeasurementProfile({
      profileName: newProfileName,
      garmentCategory: newCategory,
      measurements: newMeasurements,
      isDefault: false,
    });
    setIsCreatingNew(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Notice */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
            <Ruler className="w-3.5 h-3.5" />
            <span>Digital Tailoring Cloud</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            My Measurement Profile
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Save once, stitch anywhere. Your body measurements are securely stored and can be
            reused for future orders across all partner tailors.
          </p>
        </div>

        <button
          onClick={() => {
            setIsCreatingNew(true);
            setIsEditing(false);
          }}
          className="px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Profile</span>
        </button>
      </div>

      {/* Trust Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-3 text-xs text-stone-700">
        <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0" />
        <div>
          <span className="font-bold text-amber-900">Encrypted Measurement Vault: </span>
          <span>Your measurements are securely stored and can be reused for future orders.</span>
        </div>
      </div>

      {/* Main Content: Profile Tabs & Measurement Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List of Profiles */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
            Saved Profiles ({measurementProfiles.length})
          </h3>

          <div className="space-y-2">
            {measurementProfiles.map((p) => {
              const isSelected = p.id === (currentProfile?.id || activeProfileId);
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setActiveProfileId(p.id);
                    setIsEditing(false);
                    setIsCreatingNew(false);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-amber-800 ring-2 ring-amber-800/20 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-serif font-bold text-sm text-stone-900">
                      {p.profileName}
                    </h4>
                    {p.isDefault && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Bust: {p.measurements.bust}" • Waist: {p.measurements.waist}" • Hip:{' '}
                    {p.measurements.hip}"
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-stone-400 mt-3 pt-2 border-t border-stone-100">
                    <span>Updated {p.updatedAt}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(p);
                      }}
                      className="text-amber-800 hover:underline font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Sheet / Edit / Create View */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          {/* If creating new */}
          {isCreatingNew ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Create New Measurement Profile
                </h3>
                <button
                  onClick={() => setIsCreatingNew(false)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Profile Name</label>
                  <input
                    type="text"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="e.g. Traditional Wear, Festive Blouse"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Garment Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800 bg-white"
                  >
                    <option value="Women">Women's Ethnic & Daily</option>
                    <option value="Men">Men's Bespoke</option>
                    <option value="General">General / Kids</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                  Enter Tape Measurements (Inches)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(newMeasurements).map(([key, val]) => (
                    <div key={key} className="space-y-1">
                      <label className="text-[11px] font-medium text-stone-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')} (in)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={val}
                        onChange={(e) =>
                          setNewMeasurements({
                            ...newMeasurements,
                            [key]: Number(e.target.value),
                          })
                        }
                        className="w-full text-xs p-2 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-800"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsCreatingNew(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNew}
                  className="px-5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs"
                >
                  Save Profile
                </button>
              </div>
            </div>
          ) : isEditing ? (
            /* Editing current profile */
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Editing: {currentProfile?.profileName}
                </h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Profile Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
                />
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                  Tape Measurements (Inches)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(editValues).map(([key, val]) => {
                    if (key === 'notes') return null;
                    return (
                      <div key={key} className="space-y-1">
                        <label className="text-[11px] font-medium text-stone-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1')} (in)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={val as number}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              [key]: Number(e.target.value),
                            })
                          }
                          className="w-full text-xs p-2 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-800"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Profile</span>
                </button>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-stone-900">
                    {currentProfile?.profileName}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Category: {currentProfile?.garmentCategory} Wear • Last updated{' '}
                    {currentProfile?.updatedAt}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEdit(currentProfile)}
                    className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Measurements</span>
                  </button>
                  {measurementProfiles.length > 1 && (
                    <button
                      onClick={() => deleteMeasurementProfile(currentProfile.id)}
                      className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Tape Values Display Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-[11px] font-semibold text-stone-500 block">Bust / Chest</span>
                  <div className="font-serif text-2xl font-bold text-stone-900 mt-1">
                    {currentProfile?.measurements.bust || 34}{' '}
                    <span className="text-xs font-sans text-stone-500 font-normal">in</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-[11px] font-semibold text-stone-500 block">Waist</span>
                  <div className="font-serif text-2xl font-bold text-stone-900 mt-1">
                    {currentProfile?.measurements.waist || 28}{' '}
                    <span className="text-xs font-sans text-stone-500 font-normal">in</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-[11px] font-semibold text-stone-500 block">Hip</span>
                  <div className="font-serif text-2xl font-bold text-stone-900 mt-1">
                    {currentProfile?.measurements.hip || 36}{' '}
                    <span className="text-xs font-sans text-stone-500 font-normal">in</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-[11px] font-semibold text-stone-500 block">Shoulder Width</span>
                  <div className="font-serif text-2xl font-bold text-stone-900 mt-1">
                    {currentProfile?.measurements.shoulder || 14}{' '}
                    <span className="text-xs font-sans text-stone-500 font-normal">in</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-[11px] font-semibold text-stone-500 block">Sleeve Length</span>
                  <div className="font-serif text-2xl font-bold text-stone-900 mt-1">
                    {currentProfile?.measurements.sleeveLength || 17}{' '}
                    <span className="text-xs font-sans text-stone-500 font-normal">in</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-[11px] font-semibold text-stone-500 block">Blouse / Shirt Length</span>
                  <div className="font-serif text-2xl font-bold text-stone-900 mt-1">
                    {currentProfile?.measurements.blouseLength || 14}{' '}
                    <span className="text-xs font-sans text-stone-500 font-normal">in</span>
                  </div>
                </div>

                {currentProfile?.measurements.armHole && (
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                    <span className="text-[11px] font-semibold text-stone-500 block">Arm Hole</span>
                    <div className="font-serif text-2xl font-bold text-stone-900 mt-1">
                      {currentProfile.measurements.armHole}{' '}
                      <span className="text-xs font-sans text-stone-500 font-normal">in</span>
                    </div>
                  </div>
                )}

                {currentProfile?.measurements.frontNeckDepth && (
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                    <span className="text-[11px] font-semibold text-stone-500 block">Front Neck Depth</span>
                    <div className="font-serif text-2xl font-bold text-stone-900 mt-1">
                      {currentProfile.measurements.frontNeckDepth}{' '}
                      <span className="text-xs font-sans text-stone-500 font-normal">in</span>
                    </div>
                  </div>
                )}

                {currentProfile?.measurements.backNeckDepth && (
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                    <span className="text-[11px] font-semibold text-stone-500 block">Back Neck Depth</span>
                    <div className="font-serif text-2xl font-bold text-stone-900 mt-1">
                      {currentProfile.measurements.backNeckDepth}{' '}
                      <span className="text-xs font-sans text-stone-500 font-normal">in</span>
                    </div>
                  </div>
                )}
              </div>

              {currentProfile?.measurements.notes && (
                <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-stone-700">
                  <span className="font-semibold text-amber-900 block mb-0.5">Special Fit Notes:</span>
                  <p className="italic">{currentProfile.measurements.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
