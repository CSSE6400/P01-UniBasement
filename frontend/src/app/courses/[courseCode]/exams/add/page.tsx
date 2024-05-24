'use client';
import requireRole from '@/app/requireRole';
import requireAuth from '@/app/requireAuth';
import { UserRole } from '@/types';
import Title from '@/components/Title';
import AddExamForm from '@/components/Exams/AddExamForm';

function AddExam(){
    return (
        <main>
            <div className="max-w-4xl w-full mx-auto flex flex-col items-center justify-center">
                <Title title="Add Exam"/>
                <AddExamForm onSubmit={(data) => console.log(data)}/>
            </div>
        </main>
    );
}

export default requireAuth(requireRole(AddExam, UserRole.ADMIN));