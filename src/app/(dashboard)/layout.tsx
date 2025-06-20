'use client';
import * as React from 'react';
import { usePathname, useParams } from 'next/navigation';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { Container } from '@mui/material';

export default function DashboardPagesLayout(props: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const [wineId] = params.segments ?? [];

  const title = React.useMemo(() => {
    if (pathname === '/wines/new') {
      return 'New Wine';
    }
    if (wineId && pathname.includes('/edit')) {
      return `Wine ${wineId} - Edit`;
    }
    if (wineId) {
      return `Wine ${wineId}`;
    }
    return undefined;
  }, [wineId, pathname]);

  return (
    <DashboardLayout>
      <PageContainer title={title}>
        <div id="dashboard-layout-container" className="p-0 md:px-4 md:py-6 w-full md:w-4xl">
          {props.children}
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
