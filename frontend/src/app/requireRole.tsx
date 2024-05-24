import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useUserRole from '@/api/useUser';
import { UserRole } from '@/types';
import NotFound from '@/app/not-found';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function requireRole(WrappedComponent: React.ComponentType<any>, role: UserRole) {
    const ComponentWithRole = (props: any) => {
        const { user } = useUser();
        const { userRole } = useUserRole(user?.sub || '');

        return userRole === role ? <WrappedComponent {...props} /> : <NotFound/>;
    };

    ComponentWithRole.displayName = `requireRole(${WrappedComponent.displayName || WrappedComponent.name || 'Component'}, ${role})`;

    return ComponentWithRole;
}