import React, { useState } from 'react';
import { Mail, Phone, Calendar, Trash2, CheckCircle2, Archive, Clock } from 'lucide-react';
import { AdminContactInquiry } from '../../../types/admin';
import { updateInquiryStatus, deleteInquiry } from '../../../lib/firebase';

interface InquiriesModuleProps {
  inquiries: AdminContactInquiry[];
  onRefresh: () => Promise<void>;
}

export const InquiriesModule: React.FC<InquiriesModuleProps> = ({ inquiries, onRefresh }) => {
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'archived'>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredInquiries = inquiries.filter((inq) => {
    if (filter === 'all') return true;
    return inq.status === filter;
  });

  const handleUpdateStatus = async (id: string, status: 'new' | 'contacted' | 'archived') => {
    setProcessingId(id);
    await updateInquiryStatus(id, status);
    setProcessingId(null);
    await onRefresh();
  };

  const handleDelete = async (id: string, _name?: string) => {
    setProcessingId(id);
    await deleteInquiry(id);
    setProcessingId(null);
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            Booking Inquiries &amp; Messages
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Client messages and event inquiries submitted through the contact section ({inquiries.length} total)
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0d0d12] border border-white/10 rounded-xl">
          {(['all', 'new', 'contacted', 'archived'] as const).map((tab) => {
            const count =
              tab === 'all'
                ? inquiries.length
                : inquiries.filter((i) => i.status === tab).length;
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

      {filteredInquiries.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0d0d12] border border-white/10 text-zinc-400 text-sm">
          No inquiries in this category.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              className={`rounded-2xl bg-[#0d0d12] border p-5 flex flex-col md:flex-row gap-5 justify-between transition-all ${
                inq.status === 'new'
                  ? 'border-sky-500/40 shadow-[0_0_20px_rgba(14,165,233,0.08)]'
                  : 'border-white/10 opacity-80'
              }`}
            >
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-white text-base">{inq.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      inq.status === 'new'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : inq.status === 'contacted'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {inq.status}
                  </span>
                  {inq.event_type && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-[#d4af37] border border-white/10 font-semibold">
                      {inq.event_type}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                  <a
                    href={`mailto:${inq.email}`}
                    className="flex items-center gap-1.5 text-zinc-300 hover:text-[#d4af37] transition"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{inq.email}</span>
                  </a>

                  {inq.phone && (
                    <a
                      href={`tel:${inq.phone}`}
                      className="flex items-center gap-1.5 text-zinc-300 hover:text-[#d4af37] transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{inq.phone}</span>
                    </a>
                  )}

                  {inq.event_date && (
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Event Date: {inq.event_date}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <div className="p-3.5 rounded-xl bg-[#14141c] border border-white/5 text-xs text-zinc-200 leading-relaxed">
                    {inq.message}
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500 flex items-center gap-1 pt-1">
                  <Clock className="w-3 h-3" />
                  <span>Received on {new Date(inq.created_at).toLocaleString()}</span>
                </div>
              </div>

              {/* Status Controls */}
              <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-white/5 md:pl-5">
                {inq.status !== 'contacted' && (
                  <button
                    onClick={() => handleUpdateStatus(inq.id, 'contacted')}
                    disabled={processingId === inq.id}
                    className="flex-1 md:w-32 py-1.5 px-3 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Contacted</span>
                  </button>
                )}

                {inq.status !== 'archived' && (
                  <button
                    onClick={() => handleUpdateStatus(inq.id, 'archived')}
                    disabled={processingId === inq.id}
                    className="flex-1 md:w-32 py-1.5 px-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>Archive</span>
                  </button>
                )}

                <button
                  onClick={() => handleDelete(inq.id, inq.name)}
                  disabled={processingId === inq.id}
                  className="p-1.5 text-zinc-500 hover:text-red-400 transition cursor-pointer self-end md:self-center"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
