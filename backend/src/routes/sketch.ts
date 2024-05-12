// Imports
import { Request, Response } from 'express'; // Import Request and Response types

import { getConnection } from '../db/index';
import { User as UserDb } from '../db/User';
import { Course as CourseDb } from '../db/Course';
import { Exam as ExamDb } from '../db/Exam';
import { Question as QuestionDb } from '../db/Questions';
import { Comment as CommentDb } from '../db/Comments';

export async function setupData(req: Request, res: Response) {
    const db = getConnection();

    const user = db.getRepository(UserDb);

    const checkData = await user.find();

    if (checkData.length > 0) {
        res.status(400).json('Data already exists');
        return;
    }

    const course = db.getRepository(CourseDb);
    const exam = db.getRepository(ExamDb);
    const question = db.getRepository(QuestionDb);
    const comment = db.getRepository(CommentDb);

    // Makes a bunch of users
    const users = ['Evan', 'Liv', 'Lakshan', 'Jackson', 'Tristan', 'Pramith', 'Ibrahim'];

    for (const u of users) {
        const newUser = new UserDb();
        newUser.userId = u;
        await user.save(newUser);
    }


    // Makes a bunch of courses
    const courses = [
        {
            courseCode: 'ENGG1001',
            courseName: 'Programming for Engineers',
            courseDescription: 'An introductory course covering basic concepts of software engineering.',
            university: 'UQ',
        },
        {
            courseCode: 'MATH1051',
            courseName: 'Calculus & Linear Algebra',
            courseDescription: 'A foundational course in calculus covering limits, derivatives, and integrals.',
            university: 'UQ',
        },
        {
            courseCode: 'ENGG1100',
            courseName: 'Professional Engineering',
            courseDescription: 'An introductory course covering fundamental concepts in engineering principles.',
            university: 'UQ',
        },
    ];
    
    for (const c of courses) {
        const newCourse = new CourseDb();
        newCourse.courseCode = c.courseCode;
        newCourse.courseName = c.courseName;
        newCourse.courseDescription = c.courseDescription;
        newCourse.university = c.university;
        await course.save(newCourse);
    }

    // Makes a bunch of exams
    const exams = [
        {
            courseCode: 'ENGG1001',
            examYear: 2021,
            examSemester: 1,
            examType: 'Final',
        },
        {
            courseCode: 'ENGG1001',
            examYear: 2022,
            examSemester: 1,
            examType: 'Final',
        },
        {
            courseCode: 'ENGG1001',
            examYear: 2023,
            examSemester: 1,
            examType: 'Final',
        },
        {
            courseCode: 'MATH1051',
            examYear: 2021,
            examSemester: 1,
            examType: 'Midterm',
        },
        {
            courseCode: 'MATH1051',
            examYear: 2021,
            examSemester: 1,
            examType: 'Final',
        },
        {
            courseCode: 'MATH1051',
            examYear: 2021,
            examSemester: 2,
            examType: 'Midterm',
        },
        {
            courseCode: 'MATH1051',
            examYear: 2021,
            examSemester: 2,
            examType: 'Final',
        },
        {
            courseCode: 'MATH1051',
            examYear: 2021,
            examSemester: 3,
            examType: 'Midterm',
        },
        {
            courseCode: 'MATH1051',
            examYear: 2021,
            examSemester: 3,
            examType: 'Final',
        },
        {
            courseCode: 'MATH1051',
            examYear: 2022,
            examSemester: 1,
            examType: 'Midterm',
        },
        {
            courseCode: 'MATH1051',
            examYear: 2022,
            examSemester: 1,
            examType: 'Final',
        },
        {
            courseCode: 'MATH1051',
            examYear: 2022,
            examSemester: 2,
            examType: 'Midterm',
        },
        {
            courseCode: 'MATH1051',
            examYear: 2022,
            examSemester: 2,
            examType: 'Final',
        },
        {
            courseCode: 'MATH1051',
            examYear: 2022,
            examSemester: 3,
            examType: 'Midterm',
        },
        {
            courseCode: 'MATH1051',
            examYear: 2022,
            examSemester: 3,
            examType: 'Final',
        },
        {
            courseCode: 'MATH1051',
            examYear: 2023,
            examSemester: 1,
            examType: 'Midterm',
        },
        {
            courseCode: 'MATH1051',
            examYear: 2023,
            examSemester: 1,
            examType: 'Final',
        },
        {
            courseCode: 'MATH1051',
            examYear: 2023,
            examSemester: 2,
            examType: 'Midterm',
        },
        {
            courseCode: 'MATH1051',
            examYear: 2023,
            examSemester: 2,
            examType: 'Final',
        },
        {
            courseCode: 'MATH1051',
            examYear: 2023,
            examSemester: 3,
            examType: 'Midterm',
        },
        {
            courseCode: 'MATH1051',
            examYear: 2023,
            examSemester: 3,
            examType: 'Final',
        },
    ];

    for (const e of exams) {
        const newExam = new ExamDb();
        newExam.courseCode = e.courseCode;
        newExam.examYear = e.examYear;
        newExam.examSemester = e.examSemester;
        newExam.examType = e.examType;
        await exam.save(newExam);
    }

    // Makes a bunch of questions
    const questions = [
        {
            examId: 1,
            questionText: 'Who is the best tutor at UQ?',
            questionType: 'Multiple Choice',
        },
        {
            examId: 2,
            questionText: 'Who is not the best tutor at UQ?',
            questionType: 'Multiple Choice',
        },
        {
            examId: 3,
            questionText: 'Who is the second best tutor at UQ?',
            questionType: 'Multiple Choice',
        },
    ];

    for (const q of questions) {
        const newQuestion = new QuestionDb();
        newQuestion.examId = q.examId;
        newQuestion.questionText = q.questionText;
        newQuestion.questionType = q.questionType;
        await question.save(newQuestion);
    }

    // Makes a bunch of comments
    const comments = [
        {
            questionId: 1,
            parentCommentId: null,
            userId: 'Evan',
            commentText: 'Evan Hughes',
        },
        {
            questionId: 1,
            parentCommentId: 1,
            userId: 'Liv',
            commentText: 'Are you stupid it is clearly Liv Ronda',
        },
        {
            questionId: 1,
            parentCommentId: 2,
            userId: 'Jackson',
            commentText: 'Bro went to stupid school L',
        },
        {
            questionId: 1,
            parentCommentId: 1,
            userId: 'Lakshan',
            commentText: 'Fax what a goat',
        },
        {
            questionId: 2,
            parentCommentId: null,
            userId: 'Evan',
            commentText: 'Not Evan Hughes cause he is the best',
        },
        {
            questionId: 2,
            parentCommentId: 5,
            userId: 'Liv',
            commentText: 'Facts it is clearly Liv Ronda because she is the worst',
        },
        {
            questionId: 2,
            parentCommentId: 6,
            userId: 'Jackson',
            commentText: 'ong',
        },
        {
            questionId: 2,
            parentCommentId: 5,
            userId: 'Lakshan',
            commentText: 'Fax what a goat',
        },
        {
            questionId: 3,
            parentCommentId: null,
            userId: 'Evan',
            commentText: 'Not Evan Hughes cause he is the best',
        },
        {
            questionId: 3,
            parentCommentId: 9,
            userId: 'Evan',
            commentText: 'TRUEEE!!!',
        },
        {
            questionId: 3,
            parentCommentId: 10,
            userId: 'Evan',
            commentText: 'ong',
        },
        {
            questionId: 3,
            parentCommentId: 9,
            userId: 'Evan',
            commentText: 'Fax what a goat',
        },
    ];

    for (const c of comments) {
        const newComment = new CommentDb();
        newComment.questionId = c.questionId;
        if (c.parentCommentId) {
            newComment.parentCommentId = c.parentCommentId;
        }
        newComment.userId = c.userId;
        newComment.commentText = c.commentText;
        await comment.save(newComment);
    }
    
    res.status(200).json(`THIS SHIT SKETCH ASF AND WAS LIV'S IDEA!!!\n`);
}
