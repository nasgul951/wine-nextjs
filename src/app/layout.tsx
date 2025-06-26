import React, { Suspense } from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WineIcon from '@mui/icons-material/WineBar';
import VarietalIcon from '@mui/icons-material/Diversity2';
import type { Navigation } from '@toolpad/core/AppProvider';
import { AuthProvider } from '../context/authContext';
import './globals.css';

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
];

const BRANDING = {
  title: 'Wine Cellar',
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-toolpad-color-scheme="light">
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <NextAppProvider navigation={NAVIGATION} branding={BRANDING}>
              <AuthProvider>
                {/* This is where the main content of the app will be rendered */}
                {props.children}
              </AuthProvider>
            </NextAppProvider>
          </AppRouterCacheProvider>
        </Suspense>
      </body>
    </html>
  );
}
