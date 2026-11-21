'use client';

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Service } from '@/types';
import { apiFetch } from '@/lib/api';
import ServiceSearchBar from './views/ServiceSearchBar';
import ServiceFilterSidebar from './views/ServiceFilterSidebar';
import ServiceCardGrid from './views/ServiceCardGrid';
import ServicePagination from './views/ServicePagination';
import EmptyState from './views/EmptyState';
import { Wrench } from 'lucide-react';

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlCategory = searchParams.get('category') || 'All';
  const urlMode = searchParams.get('serviceMode') || 'All';
  const urlSort = searchParams.get('sort') || 'newest';
  const urlSearch = searchParams.get('search') || '';
  const urlPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [services, setServices] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync state with URL params
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  // Update URL helper preserving filter state on page reload
  const updateUrl = useCallback(
    (newParams: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === '' || value === 'All') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`/services?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Fetch services from server whenever URL search params change
  useEffect(() => {
    async function fetchServerServices() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (urlSearch) queryParams.set('search', urlSearch);
        if (urlCategory && urlCategory !== 'All') queryParams.set('category', urlCategory);
        if (urlMode && urlMode !== 'All') queryParams.set('serviceMode', urlMode);
        if (urlSort) queryParams.set('sort', urlSort);
        queryParams.set('page', String(urlPage));
        queryParams.set('limit', '9');

        const res = await apiFetch<{
          success: boolean;
          services: Service[];
          total: number;
          totalPages: number;
          page: number;
        }>(`/services?${queryParams.toString()}`);

        if (res.success) {
          setServices(res.services || []);
          setTotal(res.total || 0);
          setTotalPages(res.totalPages || 1);
        }
      } catch (err) {
        console.error('Failed to load services:', err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    }

    fetchServerServices();
  }, [urlSearch, urlCategory, urlMode, urlSort, urlPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ search: searchInput.trim(), page: 1 });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    updateUrl({ search: null, page: 1 });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    router.push('/services');
  };

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            <Wrench className="w-4 h-4" />
            <span>Certified Technician Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Browse Repair Services
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-xl">
            Showing {total} approved repair solutions across Dhaka and nationwide. Filter by category, service mode, or sort by pricing.
          </p>
        </div>

        {/* Search Bar Top */}
        <div className="mb-8">
          <ServiceSearchBar
            search={searchInput}
            onSearchChange={setSearchInput}
            onSubmit={handleSearchSubmit}
            onClear={handleClearSearch}
          />
        </div>

        {/* Layout: Sidebar + Service Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <ServiceFilterSidebar
              selectedCategory={urlCategory}
              selectedMode={urlMode}
              selectedSort={urlSort}
              onCategoryChange={(cat) => updateUrl({ category: cat, page: 1 })}
              onModeChange={(mode) => updateUrl({ serviceMode: mode, page: 1 })}
              onSortChange={(sort) => updateUrl({ sort, page: 1 })}
              onReset={handleResetFilters}
            />
          </div>

          {/* Main Services Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-96 rounded-2xl bg-white border border-slate-200 animate-pulse p-4 space-y-4"
                  >
                    <div className="h-44 bg-slate-200 rounded-xl" />
                    <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                    <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                  </div>
                ))}
              </div>
            ) : services.length > 0 ? (
              <>
                <ServiceCardGrid services={services} />
                <ServicePagination
                  currentPage={urlPage}
                  totalPages={totalPages}
                  onPageChange={(page) => updateUrl({ page })}
                />
              </>
            ) : (
              <EmptyState onReset={handleResetFilters} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
