'use client';

import React, { useState } from 'react';
import SidebarV2 from './SidebarV2';
import { Menu } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  description,
  breadcrumbs,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F2F0EB]">
      {/* Sidebar */}
      <SidebarV2 mobileOpen={mobileSidebarOpen} onMobileOpenChange={setMobileSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-[60] inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#0F141F] text-white shadow-lg"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Header Section */}
        {(title || breadcrumbs) && (
          <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
            <div className="px-6 md:px-8 py-6">
              {/* Breadcrumbs */}
              {breadcrumbs && breadcrumbs.length > 0 && (
                <div className="flex items-center gap-2 mb-4 text-sm">
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <span className="text-slate-400">/</span>}
                      {crumb.href ? (
                        <a
                          href={crumb.href}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          {crumb.label}
                        </a>
                      ) : (
                        <span className="text-slate-600">{crumb.label}</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {/* Title & Description */}
              {title && (
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
                  {description && (
                    <p className="text-slate-600 mt-2">{description}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
