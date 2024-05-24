'use client'
import requireRole from '@/app/requireRole';
import requireAuth from '@/app/requireAuth';
import { UserRole } from '@/types';

function AddExam(){
    return <main>Add an exam here</main>
}

export default requireAuth(requireRole(AddExam, UserRole.ADMIN));