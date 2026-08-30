'use client';

import { DeliveryProvider } from '../context/DeliveryContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DeliveryProvider>
      {children}
    </DeliveryProvider>
  );
}