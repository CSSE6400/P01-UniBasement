// Imports
import { Router, Request, Response } from 'express'; // Import Request and Response types
import {
    Comment as IComment,
    CommentBodyParams,
    CommentRouteParams,
    Course,
    CourseBodyParams,
    CourseQueryParams,
    CourseRouteParams,
    Exam,
    ExamBodyParams,
    ExamRouteParams,
    Question,
    QuestionBodyParams,
    QuestionRouteParams,
    RateObject,
} from '../types';

import { getConnection } from '../db/index';
import { User as UserDb } from '../db/User';
import { Course as CourseDb } from '../db/Course';
import { Exam as ExamDb } from '../db/Exam';
import { Question as QuestionDb } from '../db/Questions';
import { Comment as CommentDb } from '../db/Comments';
import {
    starCourse,
    postCourse,
    getCourseExams,
    getCourseInfo,
    getCourses,
} from './courses';

import {
    editComments,
    deleteComments,
    correctComments,
    incorrectComments,
    endorseComments,
    unendorseComments,
    downvoteComments,
    upvoteComments,
    postComment,
    getComment,
} from './comments';

import {
    postExam,
    getExamQuestions,
    getExamInfo,
} from './exams';

import {
    postQuestion,
    editQuestion,
    getQuestionComments,
    getQuestion,
} from './questions';

import {
    postUser,
} from './users';

import { nest, single_nest } from './helpful_friends';

// Export Routers
export const router = Router();

/*
 * Routes
 * ======
 */
/*
 * Puts
 * ====
 *
 * Inputs and params are described within HANDSHAKE.md
 *
 */

// Edits a question
router.put('/questions/:questionId/edit', editQuestion);

// Edits a comment
router.put('/comments/:commentId/edit', editComments);

/*
 * Patches
 * =======
 *
 * Inputs and params are described within HANDSHAKE.md
 *
 */

// Star rating for a course
router.patch('/courses/:courseCode/star', starCourse);

// Deletes a comment
router.patch('/comments/:commentId/delete', deleteComments);

// Sets a comment as correct
router.patch('/comments/:commentId/correct', correctComments);

// Sets a comment as incorrect
router.patch('/comments/:commentId/incorrect', incorrectComments);

// Endorses a comment
router.patch('/comments/:commentId/endorse', endorseComments);

// Removes endorsement from a comment
router.patch('/comments/:commentId/unendorse', unendorseComments);

// Downvotes a comment
router.patch('/comments/:commentId/downvote', downvoteComments);

// Upvotes a comment
router.patch('/comments/:commentId/upvote', upvoteComments);

/*
 * Post Requests below
 * ===================
 *
 * Inputs and params are described within HANDSHAKE.md
 *
 */

// Adds a new user to the database
router.post('/users', postUser);

// Adds a new comment to the database
router.post('/comments', postComment);

// Adds a new question to the database
router.post('/questions', postQuestion);

// Adds a new exam to the database
router.post('/exams', postExam);

// Adds a new Course to the database
router.post('/courses', postCourse);

/*
 * Get Requests below
 * ==================
 *
 * See outputs and params in HANDSHAKE.md
 *
 */

// Gets comment by comment id
router.get('/comments/:commentId', getComment);

// Gets all comments by question id
router.get('/questions/:questionId/comments', getQuestionComments);


// Gets question information by question id
router.get('/questions/:questionId', getQuestion);

// Exam questions by exam ID
router.get('/exams/:examId/questions', getExamQuestions);


// Exam by ID
router.get('/exams/:examId', getExamInfo);

// A course's exams by code
router.get('/courses/:courseCode/exams', getCourseExams);

// A Courses information by code
router.get('/courses/:courseCode', getCourseInfo);

// All courses
router.get('/courses', getCourses);

// Health Check
router.get('/health', async (req: Request, res: Response) => {
    try {
        await getConnection().query('SELECT 1');
        res.status(200).json('EVERYTHING IS A-OKAY');
    } catch (err) {
        res.status(503).json('ERROR: ' + err);
    }
});

// Evan's Routes
router.get('/Evan', async (req: Request, res: Response) => {
    res.status(200).json('Evan is the best');
});

// The sketch route
router.get('/sketch', async (req: Request, res: Response) => {
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
});
