'use client';

import React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WineIcon from '@mui/icons-material/WineBar';
import VarietalIcon from '@mui/icons-material/Diversity2';
import StoreIcon from '@mui/icons-material/Warehouse';
import PeopleIcon from '@mui/icons-material/People';
import type { Navigation } from '@toolpad/core/AppProvider';
import { useAuth } from '@/context/authContext';

const BRANDING = {
  title: 'Wine Cellar'
};

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const navigation: Navigation = React.useMemo(() => {
    const items: Navigation = [
      {
        kind: 'header',
        title: 'Main items'
      },
      {
        title: 'Dashboard',
        icon: <DashboardIcon />
      },
      {
        segment: 'wines',
        title: 'All Wine',
        icon: <WineIcon />,
        pattern: 'wines{/:wineId}*'
      },
      {
        segment: 'varietals',
        title: 'All Varietals',
        icon: <VarietalIcon />,
        pattern: 'varietals{/:varietal}'
      },
      {
        segment: 'store',
        title: 'Storage',
        icon: <StoreIcon />,
        pattern: 'store{/:id}'
      }
    ];

    if (user?.isAdmin) {
      items.push(
        {
          kind: 'divider'
        },
        {
          kind: 'header',
          title: 'Admin'
        },
        {
          segment: 'users',
          title: 'Users',
          icon: <PeopleIcon />,
          pattern: 'users{/:userId}*'
        }
      );
    }

    return items;
  }, [user?.isAdmin]);

  return (
    <NextAppProvider navigation={navigation} branding={BRANDING}>
      {children}
    </NextAppProvider>
  );
};

export default AppProvider;
