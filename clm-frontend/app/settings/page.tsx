'use client';

import React from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';

export default function SettingsPage() {
  return (
    <DashboardLayout
      title="Settings"
      description="Workspace preferences"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]}
    >
      <div className="bg-white rounded-[28px] border border-black/5 shadow-sm p-6">
        <p className="text-sm text-black/60">Settings UI placeholder (matches nav in screenshots).</p>
      </div>
    </DashboardLayout>
  );
}
