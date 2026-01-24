'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from './DashboardLayout';
import { ApiClient, Contract } from '@/app/lib/api-client';

interface ClauseCard {
  id: string;
  tag: string;
  title: string;
  description: string;
}

const ContractEditorPageV2: React.FC = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const contractId = params?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  const clauses = useMemo<ClauseCard[]>(
    () => [
      {
        id: 'confidentiality',
        tag: 'CONFIDENTIALITY',
        title: 'Standard Non-Disclosure',
        description:
          'The Receiving Party shall keep the Confidential Information strictly confidential.',
      },
      {
        id: 'liability',
        tag: 'LIABILITY',
        title: 'Limitation of Liability',
        description:
          'Neither party shall be liable for indirect, incidental, or consequential damages.',
      },
      {
        id: 'termination',
        tag: 'TERMINATION',
        title: 'Termination for Cause',
        description:
          'Either party may terminate this Agreement upon material breach not cured within 30 days.',
      },
    ],
    []
  );

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!contractId) return;
      try {
        setLoading(true);
        setError(null);
        const client = new ApiClient();
        const res = await client.getContractById(contractId);
        if (!alive) return;

        if (res.success) {
          setContract(res.data as any);
        } else {
          setError(res.error || 'Failed to load contract');
        }
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : 'Failed to load contract');
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [contractId]);

  const title = (contract as any)?.title || (contract as any)?.name || 'Master Services Agreement – Acme Corp';

  return (
    <DashboardLayout>
      <div className="bg-[#F2F0EB]">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white border border-black/10 shadow-sm grid place-items-center text-black/45 hover:text-black"
              aria-label="Back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-[#111827] truncate">{title}</h1>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-black/45 font-medium">Last edited 2m ago</span>
                </div>
              </div>
              <p className="text-xs text-black/40 mt-1 truncate">Contract ID: {String(contractId || '')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center -space-x-2">
              {['S', 'A', 'J'].map((c) => (
                <div
                  key={c}
                  className="w-9 h-9 rounded-full border-2 border-[#F2F0EB] bg-white grid place-items-center text-xs font-bold text-black/60"
                >
                  {c}
                </div>
              ))}
              <div className="w-9 h-9 rounded-full border-2 border-[#F2F0EB] bg-[#111827] grid place-items-center text-xs font-bold text-white">
                +3
              </div>
            </div>

            <button className="hidden sm:inline-flex bg-white border border-black/10 rounded-full px-4 py-2 text-sm font-semibold text-[#111827] shadow-sm hover:bg-black/5">
              Save as Draft
            </button>
            <button className="bg-[#FF5C7A] hover:bg-[#ff4768] text-white rounded-full px-5 py-2 text-sm font-semibold shadow-sm">
              Submit for Approval →
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* Clause Library */}
          <aside className="col-span-12 lg:col-span-3 bg-white rounded-[28px] border border-black/5 shadow-sm overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-black/5">
              <p className="text-sm font-semibold text-[#111827]">Clause Library</p>
              <div className="mt-3 flex items-center gap-2 bg-[#F6F3ED] rounded-full px-4 py-2">
                <svg className="w-4 h-4 text-black/35" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input className="bg-transparent outline-none text-sm w-full" placeholder="Search clauses..." />
              </div>
            </div>

            <div className="p-4 space-y-4">
              {clauses.map((c) => (
                <div key={c.id} className="rounded-2xl border border-black/5 bg-[#F6F3ED] p-4">
                  <p className="text-[10px] tracking-wider font-bold text-[#FF5C7A]">{c.tag}</p>
                  <p className="text-sm font-semibold text-[#111827] mt-1">{c.title}</p>
                  <p className="text-xs text-black/45 mt-2 leading-relaxed">{c.description}</p>
                </div>
              ))}
            </div>
          </aside>

          {/* Editor */}
          <section className="col-span-12 lg:col-span-6 bg-white rounded-[28px] border border-black/5 shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-black/45">
                {['B', 'I', 'U'].map((x) => (
                  <button key={x} className="w-9 h-9 rounded-xl hover:bg-black/5 text-sm font-semibold">
                    {x}
                  </button>
                ))}
                <button className="w-9 h-9 rounded-xl hover:bg-black/5" aria-label="Bullets">
                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                  </svg>
                </button>
              </div>
              <button className="w-10 h-10 rounded-full hover:bg-black/5 text-black/45" aria-label="More">
                <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>

            <div className="px-10 py-10 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 260px)' }}>
              {loading ? (
                <div className="text-sm text-black/45">Loading contract…</div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <h2 className="text-center">MASTER SERVICES AGREEMENT</h2>
                  <p>
                    This Master Services Agreement (“Agreement”) is entered into as of May 24, 2024 (the
                    “Effective Date”), by and between Acme Corporation, a Delaware corporation with its
                    principal place of business at 123 Tech Way, San Francisco, CA (“Client”), and
                    Services Inc., a New York corporation (“Provider”).
                  </p>
                  <h3>1. SERVICES</h3>
                  <p>
                    The services to be performed shall be set forth in one or more Statements of Work
                    (“SOW”) executed by the parties. Each SOW shall be governed by the terms and
                    conditions of this Agreement.
                  </p>
                  <h3>2. COMPENSATION</h3>
                  <p>
                    Client shall pay Provider the fees set forth in each SOW. Unless otherwise specified,
                    all fees are due and payable within thirty (30) days of the date of Provider’s invoice.
                  </p>
                  <p className="text-black/40">
                    {(contract as any)?.content ? 'Loaded contract content from API.' : 'Showing template content.'}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Collaboration */}
          <aside className="col-span-12 lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[28px] border border-black/5 shadow-sm overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-black/5">
                <p className="text-sm font-semibold text-[#111827]">Collaboration</p>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F6F3ED] border border-black/5 grid place-items-center text-xs font-bold text-black/60">
                    S
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#111827]">Sarah Miller</p>
                      <p className="text-xs text-black/35">10:45 AM</p>
                    </div>
                    <p className="text-xs text-black/55 mt-1 leading-relaxed">
                      Should we increase the payment term to 45 days for this specific vendor?
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FFEDF1] border border-black/5 grid place-items-center text-xs font-bold text-[#FF5C7A]">
                    Y
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#111827]">You</p>
                      <p className="text-xs text-black/35">10:48 AM</p>
                    </div>
                    <p className="text-xs text-black/55 mt-1 leading-relaxed">
                      Acme normally insists on 30. Let’s check with finance first.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#FFF6E7] border border-orange-100 p-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    <p className="text-xs font-bold text-orange-700">PENDING TASK</p>
                  </div>
                  <p className="text-xs text-black/60 mt-2">
                    Add Exhibit B (Pricing) before submission.
                  </p>
                  <button className="mt-3 text-[11px] font-semibold text-orange-700 hover:text-orange-800">
                    MARK AS DONE
                  </button>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 bg-[#F6F3ED] rounded-full px-4 py-2">
                    <input className="bg-transparent outline-none text-sm w-full" placeholder="Write a comment..." />
                    <button className="w-9 h-9 rounded-full bg-[#FF5C7A] text-white grid place-items-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L11 13" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContractEditorPageV2;
