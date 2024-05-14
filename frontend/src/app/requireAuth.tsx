import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function requireAuth(WrappedComponent: React.ComponentType<any>) {
  const ComponentWithAuth = (props: any) => {
    const { user, isLoading } = useUser();
    const route = window.location.href;

    useEffect(() => {
      if (!isLoading && !user) {
        const nonce = uuidv4(); // Generate a nonce
        const state = {
          redirectUrl: route,
          expiresOn: new Date().getTime() + 15 * 60 * 1000, // 15 minutes from now
        };
        // localStorage.setItem(nonce, JSON.stringify(state)); // Store the nonce and the state
        window.location.href = `/api/auth/login?state=${nonce}`; // Pass the nonce as the state parameter
      }
    }, [user, isLoading, route]);

    return user ? <WrappedComponent {...props} /> : null;
  };

  ComponentWithAuth.displayName = `requireAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithAuth;
}