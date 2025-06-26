import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
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
    icon: <PersonIcon />,
    pattern: 'wines{/:wineId}*',
  },
  {
    segment: 'varietals',
    title: 'All Varietals',
    icon: <PersonIcon />,
    pattern: 'varietals',
  },
];

const BRANDING = {
  title: 'Wine Cellar',
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-toolpad-color-scheme="light">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <NextAppProvider navigation={NAVIGATION} branding={BRANDING}>
            <AuthProvider>
              {props.children}
            </AuthProvider>
          </NextAppProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
