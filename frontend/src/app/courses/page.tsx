'use client';
import useCourses from '@/api/useCourses';
import Card from '@/components/Card';
import { IconCirclePlus } from '@tabler/icons-react';
import CourseCard from '@/components/CourseCard';
import { backendCourseToFrontend } from '@/lib/courseUtils';
import requireAuth from '../requireAuth';
import { usePinned } from '@/api/usePins';
import { useMemo } from 'react';
import Title from '@/components/Title';

function Courses() {
    const { courses, isError, isLoading } = useCourses();
    const { pinned } = usePinned();

    const displayCourses = useMemo(
        () => courses
            ?.map((course) => {
                return backendCourseToFrontend(course, pinned);
            })
            ?.sort((a, b) => {
                if (a.pinned && !b.pinned) {
                    return -1;
                } else if (!a.pinned && b.pinned) {
                    return 1;
                } else {
                    return 0;
                }
            }),
        [courses, pinned]);

    return (
        <main>
            <div className="max-w-4xl w-full mx-auto flex flex-col items-center justify-center">
                <Title title="Courses"/>
                {isLoading && <p>Loading...</p>}
                <div className="m-5 grid grid-cols-4 gap-4">
                    {!isError &&
                        !isLoading &&
                        displayCourses?.map((course) => (
                            <CourseCard
                                course={course}
                                key={course.code}
                            />
                        ))}
                    <Card>
                        {/* TODO: Make this do something */}
                        <h3 className="text-sm font-semibold leading-7 text-zinc-900 dark:text-white">
                            Add Course <IconCirclePlus/>
                        </h3>
                    </Card>
                </div>
            </div>
        </main>
    );
}

export default requireAuth(Courses);
