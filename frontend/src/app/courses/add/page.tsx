'use client'
import requireRole from '@/app/requireRole';
import requireAuth from '@/app/requireAuth';
import { UserRole } from '@/types';

function AddCourse(){
    return <main>Add a course here</main>
}

export default requireAuth(requireRole(AddCourse, UserRole.ADMIN));