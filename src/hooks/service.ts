import { useMemo } from 'react';
import { AuthService } from '../service/authService';
import { WineService } from '../service/wineService';
import { useAuth } from '../context/authContext';
import { UserService } from '@/service/userService';

export function useAuthService() {
  return useMemo(() => new AuthService(), []);
}

export function useWineService(): WineService {
  const { token } = useAuth();

  if (!token) {
    throw new Error('useWineService must be used within an authenticated context');
  }

  return useMemo(() => new WineService(token), [token]);
}

export function useUserService(): UserService {
  const { token } = useAuth();

  if (!token) {
    throw new Error('useUserService must be used within an authenticated context');
  }

  return useMemo(() => new UserService(token), [token]);
}