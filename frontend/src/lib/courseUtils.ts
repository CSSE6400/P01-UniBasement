import { Course, DisplayCourse } from '@/types';

export function backendCourseToFrontend(course: Course, pinnedCourses: DisplayCourse[]): DisplayCourse {
    return ({
        href: `/courses/${course.courseCode}`,
        pinned: pinnedCourses.some(pinnedCourse => pinnedCourse.code === course.courseCode),
        name: course.courseName,
        code: course.courseCode,
    })
}