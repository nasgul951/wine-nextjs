'use client';
import * as React from 'react';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { useActivePage } from '@toolpad/core/useActivePage';
import { useAuth } from '../../context/authContext';

const segmentLabels: Record<string, string> = {
  wines: 'Wine',
  users: 'User',
  varietals: 'Varietal',
  store: 'Storage'
};

export default function DashboardPagesLayout(props: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  const pathname = usePathname();
  const params = useParams();
  const activePage = useActivePage();

  const [entityId] = params.segments ?? [];
  const baseSegment = pathname.split('/')[1] ?? '';
  const label = segmentLabels[baseSegment] ?? baseSegment;

  const title = React.useMemo(() => {
    if (entityId === 'new') {
      return `New ${label}`;
    }
    if (entityId && pathname.endsWith('/edit')) {
      return `${label} ${entityId} - Edit`;
    }
    if (entityId) {
      return `${label} ${entityId}`;
    }
    // undefined will fall back to the title defined in the navigation array (appProvider.tsx)
    return undefined;
  }, [entityId, pathname, label]);

  const path = activePage ? `${activePage.path}/${entityId ? entityId : ''}` : '';

  const breadcrumbs = React.useMemo(() => {
    if (!title || !activePage) {
      return undefined;
    }

    return [...activePage.breadcrumbs, {title, path}];
  }, [activePage, title, path]);

  // If the user is not authenticated, redirect to the login page
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || !activePage) {
    // Don't render until user is authenticated and navigation is ready
    return null;
  }
  
  return (
    <DashboardLayout>
      <PageContainer title={title} breadcrumbs={breadcrumbs}>
        <div id="dashboard-layout-container" className="flex justify-center p-0 md:px-4 md:py-6 w-full md:w-4xl">
          {props.children}
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
