'use client';
import requireRole from '@/app/requireRole';
import requireAuth from '@/app/requireAuth';
import { UserRole } from '@/types';
import AddCourseForm from '@/components/Courses/AddCourseForm';
import Title from '@/components/Title';
import usePostCourse from '@/api/usePostCourse';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

function AddCourse(){
    const { user } = useUser();
    const router = useRouter();
    const { postCourse } = usePostCourse(() => {
        router.push('/courses');
    });

    return (
        <main>
            <div className="max-w-4xl w-full mx-auto flex flex-col items-center justify-center">
                <Title title="Add Course"/>
                <AddCourseForm
                    onSubmit={async (data) => {
                        console.log(data);
                        await postCourse(user?.sub || '', data);
                    }}
                />
            </div>
        </main>
    );
}

export default requireAuth(requireRole(AddCourse, UserRole.ADMIN));