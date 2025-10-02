import { CredentialsAuthRequest } from './auth';

export interface IAuthContext {
  token: string | null;
  user: ISessionInfo | null;
  login: (req: CredentialsAuthRequest) => Promise<boolean>;
  getUserInfo: () => Promise<ISessionInfo | null>;
  logout: () => void;
}

export interface ISessionInfo {
  userId: number;
  userName: string;
}

export interface IAppState {
  token: string | null;
  user: ISessionInfo | null;
}

export interface IDispatchAction {
  type: string;
  payload?: unknown;
}

export interface IGenericResponse<T> {
  success: boolean;
  data?: T;
  status: number;
  errors?: string[];
}

export interface IPagedResponse<T> {
  items: T[];
  totalCount: number;
}

export interface ISortModel {
  field: string;
  sort: 'asc' | 'desc';
}

export interface INameCount {
  name: string;
  count: number;
}
