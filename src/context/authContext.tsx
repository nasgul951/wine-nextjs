'use client';
import React from 'react';
import { IAuthContext, IAppState, IDispatchAction, ISessionInfo } from '../types';
import { CredentialsAuthRequest } from '../types/auth';
import { useAuthService } from '../hooks/service';

const AuthContext = React.createContext<IAuthContext>({
  user: null,
  token: null,
  login: async () => false,
  getUserInfo: async () => null,
  logout: () => {}
});

function authReducer(state: IAppState, action: IDispatchAction) {
  switch (action.type) {
  case "SET_TOKEN":
    localStorage.setItem('session-key', action.payload as string);
    return { ...state, token: action.payload as string };
  case "SET_USER":
    return { ...state, user: action.payload as ISessionInfo };
  case "LOGOUT":
    localStorage.removeItem('session-key');
    return { ...state, token: null, user: null };
  default:
    return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialState: IAppState = { token: null, user: null}
  const [state, dispatch] = React.useReducer<IAppState, [IDispatchAction]>(authReducer, initialState);
  const authService = useAuthService();

  if (!state.token) {
    // Check localStorage for existing session token
    const token = localStorage.getItem('session-key');
    if (token) {
      dispatch({ type: "SET_TOKEN", payload: token });
    }
  }

  const login = async (req: CredentialsAuthRequest): Promise<boolean> => {
    const response = await authService.loginWithCredentials(req);
    if (response.success) {
      dispatch({ type: "SET_TOKEN", payload: response.data!.token });
      return true;
    }
    return false;
  }

  const getUserInfo = React.useCallback(async (): Promise<ISessionInfo | null> => {
    const response = await authService.getUserInfo();
    if (response.success) {
      const user: ISessionInfo = {
        userId: response.data!.userId,
        userName: response.data!.userName
      };
      dispatch({ type: "SET_USER", payload: user });
      return user;
    }
    return null;
  }, [authService]);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  }

  // Set the API token when the token state changes
  React.useEffect(() => {
    if (!state.token) return;
    authService.setApiToken(state.token);
    getUserInfo();
  }, [state.token, authService, getUserInfo]);

  return (
    <AuthContext.Provider value={{ user: state.user, token: state.token, login, getUserInfo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication context.
 * Returns the current authentication state and actions.
 */
export function useAuth() {
  return React.useContext(AuthContext);
}
