// Imports
import { Request, Response } from 'express'; // Import Request and Response types
import { CourseBodyParams, CourseQueryParams, CourseRouteParams, RateObject } from '../types';

import { getConnection } from '../db/index';
import { User as UserDb } from '../db/User';
import { Course as CourseDb } from '../db/Course';
import { Exam as ExamDb } from '../db/Exam';

export async function starCourse(req: Request<CourseRouteParams>, res: Response) {
    const { courseCode } = req.params;
    const { starRating, userId } = req.body;

    if (starRating === undefined || !userId) {
        res.status(400).json('Missing starRating or userId');
        return;
    }

    // Checks to see star rating is between 1 and 5
    if (starRating < 0 || starRating > 5) {
        res.status(400).json('Star rating must be between 0 and 5');
        return;
    }

    const userRows = getConnection().getRepository(UserDb);
    const user = await userRows.findOne({ where: { userId } });

    if (!user) {
        res.status(400).json('User does not exist');
        return;
    }

    const courseRepository = getConnection().getRepository(CourseDb);
    const course = await courseRepository.findOne({ where: { courseCode } });

    if (!course) {
        res.status(404).json('Course not found');
        return;
    }

    // Goes through the JSON array and sees if the course is there
    const rating: RateObject | undefined = user.rated.find((course: RateObject) => course.courseCode === courseCode);
    
    course.stars += rating ? starRating - rating.stars : starRating;
    course.votes += rating ? 0 : 1;

    const i = user.rated.findIndex((course: RateObject) => course.courseCode === courseCode);
    
    if (i !== -1) {
        user.rated[i].stars = starRating;
    } else {
        user.rated.push({ courseCode: courseCode, stars: starRating });
    }

    await userRows.update(user.userId, user);
    await courseRepository.update(course.courseCode, course);

    res.status(200).json('Course starred');
}

export async function postCourse(req: Request<any, any, CourseBodyParams>, res: Response) {
    const {
        courseCode,
        courseName,
        courseDescription,
        university,
    } = req.body;

    if (!courseCode || !courseName || !courseDescription || !university) {
        res.status(400).json('Missing courseCode, courseName, courseDescription, or university');
        return;
    }

    const courseRepository = getConnection().getRepository(CourseDb);
    const course = await courseRepository.findOne({ where: { courseCode } });
    if (course) {
        res.status(409).json('Course already exists');
        return;
    }

    const newCourse = new CourseDb();
    newCourse.courseCode = courseCode;
    newCourse.courseName = courseName;
    newCourse.courseDescription = courseDescription;
    newCourse.university = university;
    await courseRepository.save(newCourse);


    res.status(201).json('Course Added');
}

export async function getCourseExams(req: Request<CourseRouteParams>, res: Response) {
    const { courseCode } = req.params;

    const courseRepository = getConnection().getRepository(CourseDb);
    const course = await courseRepository.findOne({ where: { courseCode } });

    if (!course) {
        res.status(404).json('Course not found');
        return;
    }

    const examRepository = getConnection().getRepository(ExamDb);
    const exams = await examRepository.find({ where: { courseCode } });

    res.status(200).json(exams);
}

export async function getCourseInfo(req: Request<CourseRouteParams>, res: Response) {
    const { courseCode } = req.params;

    const courseRepository = getConnection().getRepository(CourseDb);
    const course = await courseRepository.findOne({ where: { courseCode } });

    if (!course) {
        res.status(404).json('Course not found');
        return;
    }

    res.status(200).json(course);
}

export async function getCourses(req: Request<any, any, any, CourseQueryParams>, res: Response) {
    const offset = req.query.offset ?? 0;
    const limit = req.query.limit ?? 100;

    const courseRepository = getConnection().getRepository(CourseDb);
    const courses = await courseRepository.find({ skip: offset, take: limit });

    res.status(200).json(courses);
}
