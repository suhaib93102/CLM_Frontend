'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../lib/auth-context';
import { ApiClient } from '../lib/api-client';

// Types
interface Template {
  id: string;
  name: string;
  contract_type?: string;
  description?: string;
}

interface Clause {
  id: string;
  clause_id: string;
  name: string;
  contract_type?: string;
  content: string;
  is_mandatory?: boolean;
}

const CreateContractInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedClauses, setSelectedClauses] = useState<string[]>([]);
  const [contractTitle, setContractTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId) {
      setSelectedTemplate(templateId);
    }
  }, [searchParams]);

  const fetchData = async () => {
    try {
      const client = new ApiClient();
      const [templatesResponse, clausesResponse] = await Promise.all([
        client.getTemplates(),
        client.getClauses(),
      ]);

      if (!templatesResponse.success) {
        setError(templatesResponse.error || 'Failed to load templates');
        setTemplates([]);
      } else {
        const templateList = Array.isArray(templatesResponse.data)
          ? templatesResponse.data
          : (templatesResponse.data as any)?.results || [];
        setTemplates(templateList);

        const templateFromQuery = searchParams.get('template');
        if (!templateFromQuery && templateList.length > 0) {
          setSelectedTemplate(templateList[0].id);
        }
      }

      if (!clausesResponse.success) {
        setError((prev) => prev || clausesResponse.error || 'Failed to load clauses');
        setClauses([]);
      } else {
        const clauseList = Array.isArray(clausesResponse.data)
          ? clausesResponse.data
          : (clausesResponse.data as any)?.results || [];
        setClauses(clauseList);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load templates');
    }
  };

  const handleClauseToggle = (clauseId: string) => {
    setSelectedClauses(prev =>
      prev.includes(clauseId)
        ? prev.filter(id => id !== clauseId)
        : [...prev, clauseId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractTitle.trim()) {
      setError('Contract title is required');
      return;
    }

    if (!selectedTemplate) {
      setError('Please select a template');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const client = new ApiClient();
      const response = await client.generateContract({
        templateId: selectedTemplate,
        title: contractTitle,
        selectedClauses,
        structuredInputs: {},
      });

      if (!response.success) {
        setError(response.error || 'Failed to create contract');
        return;
      }

      const contractId = (response.data as any)?.contract?.id;
      if (contractId) {
        router.push(`/contracts/${contractId}`);
      } else {
        router.push('/contracts');
      }
    } catch (err) {
      console.error('Failed to create contract:', err);
      setError(err instanceof Error ? err.message : 'Failed to create contract');
    } finally {
      setLoading(false);
    }
  };

  const selectedTemplateObj = templates.find((t) => t.id === selectedTemplate) || null;
  const visibleClauses = selectedTemplateObj?.contract_type
    ? clauses.filter((c) => c.contract_type === selectedTemplateObj.contract_type)
    : clauses;

  return (
    <div className="min-h-screen bg-[#F2F0EB] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#2D3748]">Create New Contract</h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contract Title */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contract Title *
            </label>
            <input
              type="text"
              value={contractTitle}
              onChange={(e) => setContractTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter contract title"
              required
            />
          </div>

          {/* Template Selection */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm">
            <h3 className="text-lg font-semibold text-[#2D3748] mb-4">Select Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h4 className="font-medium text-[#2D3748]">{template.name}</h4>
                  {template.description && (
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  )}
                </div>
              ))}
            </div>
            {templates.length === 0 && (
              <p className="text-gray-500 text-center py-8">No templates available</p>
            )}
          </div>

          {/* Clause Selection */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm">
            <h3 className="text-lg font-semibold text-[#2D3748] mb-4">Select Clauses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleClauses.map((clause) => (
                <div
                  key={clause.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedClauses.includes(clause.clause_id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleClauseToggle(clause.clause_id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-[#2D3748]">{clause.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{clause.clause_id}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{clause.content}</p>
                    </div>
                    <div className={`w-5 h-5 rounded border-2 ml-3 mt-1 ${
                      selectedClauses.includes(clause.clause_id)
                        ? 'bg-indigo-500 border-indigo-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedClauses.includes(clause.clause_id) && (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {visibleClauses.length === 0 && (
              <p className="text-gray-500 text-center py-8">No clauses available</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0F141F] text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Creating Contract...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Contract
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateContractPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F2F0EB] p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[20px] shadow-sm p-6 text-gray-600">
              Loading...
            </div>
          </div>
        </div>
      }
    >
      <CreateContractInner />
    </Suspense>
  );
};

export default CreateContractPage;