import useUserRole from '@/api/useUser';
import { UserRole } from '@/types';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function requireRole(WrappedComponent: React.ComponentType<any>, role: UserRole) {
    const ComponentWithRole = (props: any) => {
        const { user } = useUser();
        const { userRole } = useUserRole(user?.sub || '');

        return userRole === role ? <WrappedComponent {...props} /> : null;
    };

    ComponentWithRole.displayName = `requireRole(${WrappedComponent.displayName || WrappedComponent.name || 'Component'}, ${role})`;

    return ComponentWithRole;
}