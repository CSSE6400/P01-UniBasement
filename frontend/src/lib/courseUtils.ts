import { Course, DisplayCourse } from '@/types';

export function backendCourseToFrontend(course: Course): DisplayCourse {
    // TODO: update to handle last viewed & pinned
    return ({
        href: `/courses/${course.courseCode}/course-profile`,
        pinned: false,
        name: course.courseName,
        code: course.courseCode,
    })
}