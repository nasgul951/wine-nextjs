import { useMemo } from 'react';
import { WineService } from '../service/wineService';

export function useWineService() {
  return useMemo(() => new WineService(), []);
}