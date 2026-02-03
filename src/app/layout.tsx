import React, { Suspense } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { AuthProvider } from '../context/authContext';
import AppProvider from '../components/appProvider';
import './globals.css';
import { LinearProgress } from '@mui/material';

export default async function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <Suspense fallback={<LinearProgress />}>
            <AuthProvider>
              <AppProvider>
                {props.children}
              </AppProvider>
            </AuthProvider>
          </Suspense>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
