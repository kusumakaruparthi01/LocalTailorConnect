import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Clock, CheckCircle2, User, Phone, FileText } from 'lucide-react';

export const AppointmentBookingModal: React.FC = () => {
  const {
    isAppointmentModalOpen,
    setIsAppointmentModalOpen,
    tailors,
    selectedTailorId,
    bookAppointment,
    customer,
  } = useApp();

  const [date, setDate] = useState('2026-09-18');
  const [timeSlot, setTimeSlot] = useState('11:30 AM');
  const [appointmentType, setAppointmentType] = useState<
    'Fitting Trial' | 'Measurement Taking' | 'Design Consultation'
  >('Fitting Trial');
  const [notes, setNotes] = useState('Trial for wedding blouse neck fitting');

  if (!isAppointmentModalOpen) return null;

  const tailor = tailors.find((t) => t.id === selectedTailorId) || tailors[0];

  const timeSlots = [
    '10:30 AM',
    '11:30 AM',
    '02:30 PM',
    '04:00 PM',
    '05:30 PM',
    '07:00 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookAppointment({
      tailorId: tailor.id,
      tailorShop: tailor.shopName,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      type: appointmentType,
      appointmentType,
      date,
      timeSlot,
      address: tailor.address,
      notes,
    });
    setIsAppointmentModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Reserve Fitting Slot
            </span>
            <h3 className="font-serif font-bold text-lg text-stone-900 mt-0.5">
              Book Appointment
            </h3>
          </div>
          <button
            onClick={() => setIsAppointmentModalOpen(false)}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80 text-xs text-stone-700">
            Boutique: <strong>{tailor.shopName}</strong> • {tailor.address}, {tailor.city}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Appointment Type</label>
            <select
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value as any)}
              className="w-full text-xs p-2.5 border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-amber-800"
            >
              <option value="Fitting Trial">Fitting Room Trial</option>
              <option value="Measurement Taking">Master Measurement Taking</option>
              <option value="Design Consultation">Bridal Design & Fabric Consultation</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs p-2.5 border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-amber-800"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 block">Available Time Slot</label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  className={`py-2 px-1 rounded-xl text-xs font-medium border transition-all ${
                    timeSlot === slot
                      ? 'border-amber-800 bg-amber-50 text-amber-900 font-bold ring-1 ring-amber-800'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Special Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Bringing sample fabric or matching jewelry"
              className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAppointmentModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
