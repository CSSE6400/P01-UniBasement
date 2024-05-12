'use client'
import { useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function requireAuth(
  WrappedComponent: React.ComponentType<any>,
) {
  const ComponentWithAuth = (props: any) => {
    const { user, isLoading } = useUser()

    useEffect(() => {
      if (!isLoading && !user) {
        window.location.href = '/api/auth/login'
      }
    }, [user, isLoading])

    return user ? <WrappedComponent {...props} /> : null
  }

  ComponentWithAuth.displayName = `requireAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`

  return ComponentWithAuth
}
