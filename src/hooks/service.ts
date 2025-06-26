import { useMemo } from 'react';
import { AuthService } from '../service/authService';
import { WineService } from '../service/wineService';
import { useAuth } from '../context/authContext';

export function useAuthService() {
  return useMemo(() => new AuthService(), []);
}

export function useWineService() {
  const { token } = useAuth();
  return useMemo(() => new WineService(token!), []);
}