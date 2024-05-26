// Imports
import { Router } from 'express'; // Import Request and Response types
import { getCourseExams, getCourseInfo, getCourses, postCourse, starCourse } from './courses';

import {
    correctComments,
    deleteComments,
    downvoteComments,
    editComments,
    getComment,
    incorrectComments,
    postComment,
    upvoteComments,
} from './comments';

import { getExamInfo, getExamQuestions, postExam } from './exams';

import { editQuestion, getQuestion, getQuestionComments, postQuestion } from './questions';

import { getUserRole, postUser } from './users';

import { EVAN, healthCheck } from './health';

import { getRecentChanges } from './recentChanges';
import multer from 'multer';

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
 * Inputs and params are described within API.md
 *
 */

// Edits a question
router.put('/questions/:questionId/edit', <any>multer().single('questionPNG'), editQuestion);

// Edits a comment
router.put('/comments/:commentId/edit', <any>multer().single('commentPNG'), editComments);

/*
 * Patches
 * =======
 *
 * Inputs and params are described within API.md
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

// Downvotes a comment
router.patch('/comments/:commentId/downvote', downvoteComments);

// Upvotes a comment
router.patch('/comments/:commentId/upvote', upvoteComments);

/*
 * Post Requests below
 * ===================
 *
 * Inputs and params are described within API.md
 *
 */

// Adds a new user to the database
router.post('/users', postUser);

// Adds a new comment to the database
router.post('/comments', multer().single('commentPNG'), postComment);

// Adds a new question to the database
router.post('/questions', multer().single('questionPNG'), postQuestion);

// Adds a new exam to the database
router.post('/exams', postExam);

// Adds a new Course to the database
router.post('/courses', postCourse);

/*
 * Get Requests below
 * ==================
 *
 * See outputs and params in API.md
 *
 */

// Gets recent changes
router.get('/recent_changes', getRecentChanges);

// Gets a user's role
router.get('/users/:userId/role', getUserRole);

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
router.get('/health', healthCheck);

// Evan's Routes
router.get('/Evan', EVAN);
