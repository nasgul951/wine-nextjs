import React, { Suspense } from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WineIcon from '@mui/icons-material/WineBar';
import VarietalIcon from '@mui/icons-material/Diversity2';
import StoreIcon from '@mui/icons-material/Warehouse';
import type { Navigation } from '@toolpad/core/AppProvider';
import { AuthProvider } from '../context/authContext';
import './globals.css';
import { LinearProgress } from '@mui/material';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'wines',
    title: 'All Wine',
    icon: <WineIcon />,
    pattern: 'wines{/:wineId}*',
  },
  {
    segment: 'varietals',
    title: 'All Varietals',
    icon: <VarietalIcon />,
    pattern: 'varietals{/:varietal}',
  },
  {
    segment: 'store',
    title: 'Storage',
    icon: <StoreIcon />,
    pattern: 'store{/:id}',
  },
];

const BRANDING = {
  title: 'Wine Cellar',
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <Suspense fallback={<LinearProgress/>}>
            <NextAppProvider navigation={NAVIGATION} branding={BRANDING}>
              <AuthProvider>
                {/* This is where the main content of the app will be rendered */}
                {props.children}
              </AuthProvider>
            </NextAppProvider>
          </Suspense>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
