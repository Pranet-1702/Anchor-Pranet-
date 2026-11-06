import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Star,
  Trash2,
  Calendar,
  Building,
  User,
  Sparkles,
  AlertTriangle,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';
import { DatabaseFeedback } from '../../../lib/firebase';
import {
  updateFeedbackStatus,
  toggleFeedbackFeatured,
  deleteFeedback,
} from '../../../lib/firebase';

interface TestimonialsModuleProps {
  feedbacks: DatabaseFeedback[];
  onRefresh: () => Promise<void>;
}

export const TestimonialsModule: React.FC<TestimonialsModuleProps> = ({
  feedbacks,
  onRefresh,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [deleteModalTarget, setDeleteModalTarget] = useState<{ id: string; name: string } | null>(null);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Auto-dismiss notification after 4 seconds
  useEffect(() => {
    if (actionNotice) {
      const timer = setTimeout(() => setActionNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionNotice]);

  const filteredFeedbacks = feedbacks.filter((fb) => {
    if (filter === 'all') return true;
    return fb.status === filter;
  });

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      setProcessingId(id);
      const ok = await updateFeedbackStatus(id, status);
      if (ok) {
        try {
          localStorage.removeItem('pranet_public_feedbacks');
        } catch {
          // ignore
        }
        await onRefresh();
        setActionNotice({
          type: 'success',
          text: `Review successfully marked as "${status}".`,
        });
      } else {
        setActionNotice({
          type: 'error',
          text: 'Failed to update review status. Please try again.',
        });
      }
    } catch (err) {
      setActionNotice({
        type: 'error',
        text: `Error updating review: ${err instanceof Error ? err.message : 'Unknown error'}`,
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      setProcessingId(id);
      const ok = await toggleFeedbackFeatured(id, !current);
      if (ok) {
        try {
          localStorage.removeItem('pranet_public_feedbacks');
        } catch {
          // ignore
        }
        await onRefresh();
        setActionNotice({
          type: 'success',
          text: !current
            ? 'Review is now featured on the public homepage.'
            : 'Review removed from featured list.',
        });
      } else {
        setActionNotice({
          type: 'error',
          text: 'Failed to update featured status.',
        });
      }
    } catch (err) {
      setActionNotice({
        type: 'error',
        text: `Error updating featured state: ${err instanceof Error ? err.message : 'Unknown error'}`,
      });
    } finally {
      setProcessingId(null);
    }
  };

  const requestDelete = (id: string, name: string) => {
    setDeleteModalTarget({ id, name });
  };

  const executeDelete = async () => {
    if (!deleteModalTarget) return;
    const target = deleteModalTarget;
    try {
      setProcessingId(target.id);
      const ok = await deleteFeedback(target.id);
      if (ok) {
        try {
          localStorage.removeItem('pranet_public_feedbacks');
        } catch {
          // ignore
        }
        setDeleteModalTarget(null);
        await onRefresh();
        setActionNotice({
          type: 'success',
          text: `Review by "${target.name}" permanently deleted from Cloud Firestore.`,
        });
      } else {
        setActionNotice({
          type: 'error',
          text: 'Failed to delete review. Please verify admin privileges.',
        });
      }
    } catch (err) {
      setActionNotice({
        type: 'error',
        text: `Delete error: ${err instanceof Error ? err.message : 'Failed to delete'}`,
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            Testimonials &amp; Feedback Moderation
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Approve reviews to publish on the live homepage, feature standout testimonials, or reject submissions ({feedbacks.length} total in Firestore)
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0d0d12] border border-white/10 rounded-xl">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => {
            const count =
              tab === 'all'
                ? feedbacks.length
                : feedbacks.filter((f) => f.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer flex items-center gap-1.5 ${
                  filter === tab
                    ? 'bg-[#d4af37] text-[#0a0a0c]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    filter === tab
                      ? 'bg-black/30 text-black'
                      : 'bg-white/10 text-zinc-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs animate-fadeIn ${
            actionNotice.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionNotice.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="font-medium">{actionNotice.text}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="p-1 hover:bg-white/10 rounded transition cursor-pointer text-zinc-400 hover:text-white"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Feedbacks List */}
      {filteredFeedbacks.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0d0d12] border border-white/10 text-zinc-400 text-sm space-y-2">
          <div className="w-10 h-10 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
            <User className="w-5 h-5" />
          </div>
          <p className="font-medium text-zinc-300">
            No feedback entries in the "{filter}" category.
          </p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            When clients or event coordinators submit feedback via the website, new reviews will appear here for your moderation.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks.map((fb) => {
            const fullName =
              fb.full_name ||
              (fb as unknown as { fullName?: string }).fullName ||
              'Anonymous Client';
            const roleDisplay = (fb.role || 'Client').replace(/_/g, ' ');
            const feedbackText =
              fb.feedback ||
              (fb as unknown as { feedbackText?: string }).feedbackText ||
              '';
            const eventTitle =
              fb.event_name ||
              (fb as unknown as { eventName?: string }).eventName ||
              null;
            const ratingValue =
              typeof fb.rating === 'number' && !isNaN(fb.rating)
                ? Math.min(5, Math.max(1, fb.rating))
                : 5;

            return (
              <div
                key={fb.id}
                className={`rounded-2xl bg-[#0d0d12] border p-5 flex flex-col md:flex-row gap-5 justify-between transition-all ${
                  fb.status === 'pending'
                    ? 'border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.08)]'
                    : fb.status === 'approved'
                    ? 'border-emerald-500/30'
                    : 'border-white/5 opacity-60'
                }`}
              >
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < ratingValue
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-zinc-600'
                          }`}
                        />
                      ))}
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        fb.status === 'approved'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : fb.status === 'rejected'
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {fb.status}
                    </span>

                    {fb.public_consent && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-zinc-400 border border-white/10">
                        Public Consent Granted
                      </span>
                    )}

                    {fb.is_featured && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Featured on Home</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-1">
                    <span className="font-bold text-white flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#d4af37]" />
                      {fullName}
                    </span>
                    <span className="text-zinc-500">•</span>
                    <span className="capitalize">{roleDisplay}</span>
                    {fb.organization && (
                      <>
                        <span className="text-zinc-500">•</span>
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3 text-[#d4af37]" />
                          {fb.organization}
                        </span>
                      </>
                    )}
                    {eventTitle && (
                      <>
                        <span className="text-zinc-500">•</span>
                        <span className="text-[#d4af37]">
                          Event: {eventTitle}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-sm text-zinc-200 italic pt-1 leading-relaxed">
                    "{feedbackText}"
                  </p>

                  <div className="text-[11px] text-zinc-500 flex items-center gap-1 pt-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Submitted on{' '}
                      {fb.created_at && !isNaN(new Date(fb.created_at).getTime())
                        ? new Date(fb.created_at).toLocaleDateString()
                        : 'Recently'}
                    </span>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-white/5 md:pl-5">
                  {fb.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(fb.id, 'approved')}
                      disabled={processingId === fb.id}
                      className="flex-1 md:w-32 py-1.5 px-3 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {fb.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(fb.id, 'rejected')}
                      disabled={processingId === fb.id}
                      className="flex-1 md:w-32 py-1.5 px-3 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}

                  {fb.status === 'approved' && (
                    <button
                      onClick={() => handleToggleFeatured(fb.id, Boolean(fb.is_featured))}
                      disabled={processingId === fb.id}
                      className={`flex-1 md:w-32 py-1.5 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                        fb.is_featured
                          ? 'bg-[#d4af37] text-[#0a0a0c] font-bold'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{fb.is_featured ? 'Featured' : 'Make Featured'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => requestDelete(fb.id, fullName)}
                    disabled={processingId === fb.id}
                    className="p-1.5 text-zinc-500 hover:text-red-400 transition cursor-pointer self-end md:self-center disabled:opacity-40"
                    title="Delete review"
                    aria-label={`Delete review from ${fullName}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal (In-app, iframe-safe with no window.confirm) */}
      {deleteModalTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setDeleteModalTarget(null)}
        >
          <div
            className="max-w-md w-full bg-[#0d0d14] border border-rose-500/40 rounded-2xl p-6 shadow-2xl space-y-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3
                  id="delete-modal-title"
                  className="text-base font-bold text-white tracking-wide"
                >
                  Permanently Delete Review?
                </h3>
                <p className="text-xs text-zinc-400">
                  This action removes the review from Cloud Firestore and the public website.
                </p>
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-zinc-300">
              <span className="text-zinc-500 block text-[11px] uppercase tracking-wider mb-0.5">
                Client / Reviewer:
              </span>
              <strong className="text-white font-medium">{deleteModalTarget.name}</strong>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Are you sure you want to proceed? Once deleted, this testimonial cannot be recovered.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalTarget(null)}
                disabled={processingId !== null}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                disabled={processingId !== null}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition flex items-center gap-1.5 cursor-pointer shadow-lg disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{processingId ? 'Deleting...' : 'Permanently Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
