import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Admin Dashboard | AI Knowledge Base',
  description: 'Manage data for your AI Digital Twin',
};

import AdminClientLayout from '@/components/admin/AdminClientLayout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
