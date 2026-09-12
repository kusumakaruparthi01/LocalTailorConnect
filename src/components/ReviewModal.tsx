import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, CheckCircle2 } from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const {
    isReviewModalOpen,
    setIsReviewModalOpen,
    tailors,
    selectedTailorId,
    customer,
    addReview,
  } = useApp();

  const [rating, setRating] = useState(5);
  const [garmentType, setGarmentType] = useState('Blouse Stitching');
  const [comment, setComment] = useState(
    'Incredible fitting and neat finish on the neckline. The trial was right on time and very comfortable.'
  );

  if (!isReviewModalOpen) return null;

  const tailor = tailors.find((t) => t.id === selectedTailorId) || tailors[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReview(tailor.id, {
      customerName: customer.name,
      rating,
      comment,
      garmentType,
      date: 'Just now',
    });
    setIsReviewModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Verified Review
            </span>
            <h3 className="font-serif font-bold text-lg text-stone-900 mt-0.5">
              Rate Your Experience
            </h3>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(false)}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-stone-600">
            Sharing your feedback helps other customers discover master tailors at{' '}
            <strong>{tailor.shopName}</strong>.
          </p>

          <div className="space-y-1.5 text-center py-2">
            <span className="text-xs font-semibold text-stone-700 block">Overall Rating</span>
            <div className="flex items-center justify-center gap-1.5 text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Garment Tailored</label>
            <input
              type="text"
              value={garmentType}
              onChange={(e) => setGarmentType(e.target.value)}
              placeholder="e.g. Silk Saree Blouse, Bespoke Suit"
              className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Detailed Feedback</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the fitting, stitching quality, and timeliness?"
              className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
