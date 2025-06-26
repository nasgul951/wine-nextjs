'use client';
import * as React from 'react';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { useActivePage } from '@toolpad/core/useActivePage';
import invariant from 'tiny-invariant';
import { useAuth } from '../../context/authContext';

export default function DashboardPagesLayout(props: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  const pathname = usePathname();
  const params = useParams();
  const activePage = useActivePage();
  invariant(activePage, 'Active page must be defined in DashboardPagesLayout');

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

  const path = `${activePage.path}/${wineId ? wineId : ''}`;

  const breadcrumbs = React.useMemo(() => {
    if (!title) {
      return undefined;
    }

    return [...activePage.breadcrumbs, {title, path}];
  }, [activePage.breadcrumbs, title, path]);

  // If the user is not authenticated, redirect to the login page
  React.useEffect(() => {
    if (!user) {
      console.log('The user is not defined, Oh No!');
      router.push('/login');
    }
    console.log('I have a user, All good');
  }, [user, router]);

  if (!user) {
    // If the user is not authenticated, we don't render the layout
    return null;
  }
  
  return (
    <DashboardLayout>
      <PageContainer title={title} breadcrumbs={breadcrumbs}>
        <div id="dashboard-layout-container" className="p-0 md:px-4 md:py-6 w-full md:w-4xl">
          {props.children}
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
