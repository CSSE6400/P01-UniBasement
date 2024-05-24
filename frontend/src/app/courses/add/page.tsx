'use client';
import requireRole from '@/app/requireRole';
import requireAuth from '@/app/requireAuth';
import { UserRole } from '@/types';
import AddCourseForm from '@/components/Courses/AddCourseForm';
import Title from '@/components/Title';

function AddCourse(){
    return (
        <main>
            <div className="max-w-4xl w-full mx-auto flex flex-col items-center justify-center">
                <Title title="Add Course"/>
                <AddCourseForm onSubmit={(data) => console.log(data)}/>
            </div>
        </main>
    );
}

export default requireAuth(requireRole(AddCourse, UserRole.ADMIN));