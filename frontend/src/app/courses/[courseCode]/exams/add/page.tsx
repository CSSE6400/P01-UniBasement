'use client';
import requireRole from '@/app/requireRole';
import requireAuth from '@/app/requireAuth';
import { UserRole } from '@/types';
import Title from '@/components/Title';
import AddExamForm from '@/components/Exams/AddExamForm';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import usePostExam from '@/api/usePostExam';

function AddExam({ params }: { params: { courseCode: string } }) {
    const { user } = useUser();
    const router = useRouter();
    const { postExam } = usePostExam(params.courseCode, () => {
        router.push(`/courses/${params.courseCode}`);
    });

    return (
        <main>
            <div className="max-w-4xl w-full mx-auto flex flex-col items-center justify-center">
                <Title title="Add Exam"/>
                <AddExamForm
                    onSubmit={async (data) => {
                        console.log(data);
                        await postExam(user?.sub || '', data);
                    }}
                />
            </div>
        </main>
    );
}

export default requireAuth(requireRole(AddExam, UserRole.ADMIN));