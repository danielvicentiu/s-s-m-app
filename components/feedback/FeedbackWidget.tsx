'use client';

import { useState, useRef } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { X, MessageSquare, Star, Upload, Check, Loader2 } from 'lucide-react';

type FeedbackCategory = 'bug' | 'feature_request' | 'general';

interface FeedbackData {
  rating: number;
  category: FeedbackCategory;
  comment: string;
  screenshot?: File;
}

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [category, setCategory] = useState<FeedbackCategory>('general');
  const [comment, setComment] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createSupabaseBrowser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Vă rugăm să acordați o evaluare');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('Trebuie să fiți autentificat pentru a trimite feedback');
        setIsSubmitting(false);
        return;
      }

      // Get user's organization
      const { data: membership } = await supabase
        .from('memberships')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

      let screenshotUrl: string | null = null;

      // Upload screenshot if provided
      if (screenshot) {
        const fileExt = screenshot.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `feedback/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('public')
          .upload(filePath, screenshot);

        if (uploadError) {
          console.error('Screenshot upload error:', uploadError);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('public')
            .getPublicUrl(filePath);
          screenshotUrl = publicUrl;
        }
      }

      // Insert feedback
      const { error: insertError } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          organization_id: membership?.organization_id || null,
          rating,
          category,
          comment: comment.trim() || null,
          screenshot_url: screenshotUrl,
          user_agent: navigator.userAgent,
          page_url: window.location.href,
        });

      if (insertError) {
        throw insertError;
      }

      // Success
      setIsSuccess(true);

      // Reset form after 2 seconds and close
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        setRating(0);
        setCategory('general');
        setComment('');
        setScreenshot(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);

    } catch (err) {
      console.error('Feedback submission error:', err);
      setError('A apărut o eroare. Vă rugăm să încercați din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Fișierul este prea mare. Dimensiunea maximă este 5MB.');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Vă rugăm să încărcați doar imagini.');
        return;
      }

      setScreenshot(file);
      setError('');
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hoveredRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 z-40"
        aria-label="Deschide feedback"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Feedback Popup */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Feedback
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label="Închide"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Success Message */}
            {isSuccess ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Mulțumim!
                </h3>
                <p className="text-gray-600">
                  Feedback-ul dvs. a fost trimis cu succes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Cum evaluați experiența dvs.?
                  </label>
                  {renderStars()}
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Categorie
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="general">General</option>
                    <option value="bug">Bug / Problemă</option>
                    <option value="feature_request">Cerere funcționalitate</option>
                  </select>
                </div>

                {/* Comment */}
                <div>
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Comentariu (opțional)
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Spuneți-ne mai multe despre experiența dvs..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                {/* Screenshot Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Screenshot (opțional)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="screenshot-upload"
                    />
                    <label
                      htmlFor="screenshot-upload"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">
                        {screenshot ? screenshot.name : 'Încarcă imagine'}
                      </span>
                    </label>
                    {screenshot && (
                      <button
                        type="button"
                        onClick={() => {
                          setScreenshot(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || rating === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Se trimite...
                    </>
                  ) : (
                    'Trimite Feedback'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
