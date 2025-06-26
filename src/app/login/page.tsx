'use client'
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { SignInPage, AuthResponse, type AuthProvider } from '@toolpad/core/SignInPage';
import { useAuth } from '../../context/authContext';

const providers = [{ id: 'credentials', name: 'User and Password' }];

export default function CredentialsSignInPage() {
  const router = useRouter();
  const { user, login } = useAuth();

  React.useEffect(() => {
    if (!user) return;
    // Redirect to the dashboard if the user is already logged in
    router.push('/');
  }, [user, router]);

  const signIn: (provider: AuthProvider, formData: FormData) => Promise<AuthResponse> = async (
    provider,
    formData,
  ) => {
    if (provider.id === 'credentials') {
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const success = await login({ username: email, password });
      if (!success) {
        return {
          type: 'CredentialsSignin',
          error: 'Invalid username or password',
        }
      }
      return {};
    }
    return {
      type: 'UnknownProvider',
      error: 'Provider not supported',
    }
  };

  return (
    <SignInPage
      signIn={signIn}
      providers={providers}
      slotProps={{ emailField: { autoFocus: false }, form: { noValidate: true } }}
    />
  );
}