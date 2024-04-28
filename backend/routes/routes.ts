// Imports
import { Router, Request, Response } from 'express'; // Import Request and Response types
import * as db from '../db/index';
import { v4 as uuidv4, validate } from 'uuid';
const { exec } = require('child_process');

// Export Routers
export const router = Router();

// Routes

/*
 * Post Requests below
 * ===================
 *
 * Inputs and params are described within HANDSHAKE.md
 *
 */

/*
 * Deletes
 * =======
 */

/*
 * Edits
 * =====
 */

// Edits a question
router.post('/questions/:questionId/edit', async (req: Request, res: Response) => {
    const questionID = req.params.question
    const { questionText, questionType, questionPNG } = req.body;
    await db.query(`
    UPDATE questions
    SET questionText = $1, questionType = $2, questionPNG = $3
    WHERE questions.questionID = $4
    `, [questionText, questionType, questionPNG, questionID]);
    res.status(200).json('Question Edited!');
});

// Deletes a comment
router.post('/comments/:commentId/delete', async (req: Request, res: Response) => {
    const commentID = req.params.commentId;
    editComment(commentID, '', '');
    res.status(200).json('Comment Deleted!');
});

// Edits a comment
router.post('/comments/:commentId/edit', async (req: Request, res: Response) => {
    const commentID = req.params.commentId;
    editComment(commentID, req.body.commentText, req.body.commentPNG);
    res.status(200).json('Comment Edited!');
});

// Sets a comment as correct
router.post('/comments/:commentId/correct', async (req: Request, res: Response) => {
    const commentID = req.params.commentId;
    await db.query(`
    UPDATE comments
    SET iscorrect = true
    WHERE commentsid = $1
    `, [commentID]);
    res.status(200).json('Corrected!');
});

// Endorses a comment
router.post('/comments/:commentId/endorse', async (req: Request, res: Response) => {
    const commentID = req.params.commentId;
    await db.query(`
    UPDATE comments
    SET isendorsed = true
    WHERE commentsid = $1
    `, [commentID]);
    res.status(200).json('Endorsed!');
});

// Downvotes a comment
router.post('/comments/:commentId/downvote', async (req: Request, res: Response) => {
    const commentID = req.params.commentId;
    await db.query(`
    UPDATE comments
    SET downvotes = downvotes + 1
    WHERE commentsid = $1
    `, [commentID]);
    res.status(200).json('Downvoted!');
});

// Upvotes a comment
router.post('/comments/:commentId/upvote', async (req: Request, res: Response) => {
    const commentID = req.params.commentId;
    await db.query(`
    UPDATE comments
    SET upvotes = upvotes + 1
    WHERE commentsid = $1
    `, [commentID]);
    res.status(200).json('Upvoted!');
});

/*
 * Adds
 * =====
 */

// Adds a new comment to the database
router.post('/comments', async (req: Request, res: Response) => {
    const { parentCommentID, commentText, commentPNG, isCorrect, isEndorsed, upvotes, downvotes } = req.body;
    await db.query(`
    INSERT INTO comments (parentCommentID, commentText, commentPNG, isCorrect, isEndorsed, upvotes, downvotes)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [parentCommentID, commentText, commentPNG, isCorrect, isEndorsed, upvotes, downvotes]);
    res.status(201).json('Comment Added!');
});

// Adds a new question to the database
router.post('/questions', async (req: Request, res: Response) => {
    const { examID, questionText, questionType, questionPNG } = req.body;
    await db.query(`
    INSERT INTO questions (examID, questionText, questionType, questionPNG)
    VALUES ($1, $2, $3, $4)
    `, [examID, questionText, questionType, questionPNG]);
    res.status(201).json('Question Added!');
});

// Adds a new exam to the database
router.post('/exams', async (req: Request, res: Response) => {
    const { examYear, examSemester, examType, courseCode } = req.body;
    await db.query(`
    INSERT INTO exams (examYear, examSemester, examType, courseCode)
    VALUES ($1, $2, $3, $4)
    `, [examYear, examSemester, examType, courseCode]);
    res.status(201).json('Exam Added!');
});

// Adds a new Course to the database
router.post('/courses', async (req: Request, res: Response) => {
    const { courseCode, courseName, courseDescription } = req.body;
    await db.query(`
    INSERT INTO courses (courseCode, courseName, courseDescription)
    VALUES ($1, $2, $3)
    `, [courseCode, courseName, courseDescription]);
    res.status(201).json('Course Added!');
});

/*
 * Get Requests below
 * ==================
 *
 * See outputs and params in HANDSHAKE.md
 *
 */ 

// Gets comment by comment id
router.get('/comments/:commentId', async (req: Request, res: Response) => {
    const commentID = req.params.commentId;
    const comment = await db.query(`
    SELECT commentsid, parentcommentid, commenttext, commentpng, iscorrect, isendorsed, upvotes, downvotes, created_at, updated_at
    FROM comments
    WHERE comments.commentsid = $1
    `, [commentID]);
    res.status(200).json(comment.rows[0]);
});

// Gets all comments by question id
router.get('/questions/:questionId/comments', async (req: Request, res: Response) => {
    const questionID = req.params.questionId;
    const question = await db.query(`
    SELECT commentsid, parentcommentid, commenttext, commentpng, iscorrect, isendorsed, upvotes, downvotes, created_at, updated_at
    FROM comments
    WHERE comments.questionid = $1
    `, [questionID]);
    res.status(200).json(nest(question.rows));
});

// Gets question information by question id
router.get('/questions/:questionId', async (req: Request, res: Response) => {
    const questionID = req.params.questionId;
    const question = await db.query(`
    SELECT questionID, questionText, questionType, questionpng
    FROM questions
    WHERE questions.questionID = $1
    `, [questionID]);
    res.status(200).json(question.rows[0]);
});

// Exam questions by exam ID
router.get('/exams/:examId/questions', async (req: Request, res: Response) => {
    const examID = req.params.examId;
    const exam = await db.query(`
    SELECT questionID, questionText, questionType, questionpng
    FROM questions
    WHERE questions.examID = $1
    `, [examID]);
    res.status(200).json(exam.rows);
});

// Exam by ID
router.get('/exams/:examId', async (req: Request, res: Response) => {
    const examID = req.params.examId;
    const exams = await db.query(`
    SELECT examID, examYear, examSemester, examType
    FROM exams
    WHERE exams.examID = $1
    `, [examID]);
    res.status(200).json(exams.rows[0]);
});

// A course's exams by code
router.get('/courses/:courseCode/exams', async (req: Request, res: Response) => {
    const courseCode = req.params.courseCode;
    const course = await db.query(`
    SELECT examID, examYear, examSemester, examType
    FROM exams
    WHERE exams.courseCode = $1
    `, [courseCode]);
    res.status(200).json(course.rows);
});

// A Courses information by code
router.get('/courses/:courseCode', async (req: Request, res: Response) => {
    const courseCode = req.params.courseCode;
    const course = await db.query(`
    SELECT courseCode, courseName, courseDescription
    FROM courses
    WHERE courses.courseCode = $1
    `, [courseCode]);
    res.status(200).json(course.rows[0]);
});

// All courses
router.get('/courses', async (req: Request, res: Response) => {
    const offet = req.query.offset ?? 0;
    const limit = req.query.limit ?? 100;
    const courses = await db.query(`
    SELECT courseCode, courseName, courseDescription 
    FROM courses 
    LIMIT $1 
    OFFSET $2
    `, [limit, offet]);
    res.status(200).json(courses.rows);
});

// Health Check
router.get('/health', async (req: Request, res: Response) => {
    try {
        await db.query1('SELECT NOW()');
        res.status(200).json('EVERYTHING IS A-OKAY');
    } catch (err) {
        res.status(503).json('ERROR: ' + err);
    }
});

// Evan's Routes
router.get('/evan', async (req: Request, res: Response) => {
    res.status(200).json('Evan is the best');
});

// Interfaces

// Used in nest helper function
interface CommentObject {
    commentsid: number;
    parentcommentid: number | null;
    commenttext: string;
    commentpng: string | null;
    iscorrect: boolean;
    isendorsed: boolean;
    upvotes: number;
    downvotes: number;
    created_at: string;
    updated_at: string;
    children?: CommentObject[];
}

// Helper functions

// function to edit / delete a comment
async function editComment(commentID: number, commentText: string, commentPNG: string) {
    await db.query(`
    UPDATE comments
    SET commenttext = $1, commentpng = $2
    WHERE commentsid = $3
    `, [commentText, commentPNG, commentID]);
}

// function to nest comments into their parent comments
export function nest(jsonData: any[]) {
    const dataDict: { [id: number]: CommentObject } = {};
    jsonData.forEach(item => dataDict[item.commentsid] = item);

    jsonData.forEach(item => {
        if (item.parentcommentid !== null) {
            const parent = dataDict[item.parentcommentid];
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(item);
        }
    });

    const resultJsonData = jsonData.filter(item => item.parentcommentid === null);
    return resultJsonData;
}

// function to return one comment with its children
export function single_nest(jsonData: any[], commentID: number) {
    const dataDict: { [id: number]: CommentObject } = {};
    jsonData.forEach(item => dataDict[item.commentsid] = item);

    jsonData.forEach(item => {
        if (item.parentcommentid !== null) {
            const parent = dataDict[item.parentcommentid];
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(item);
        }
    });

    const resultJsonData = jsonData.filter(item => item.commentsid === commentID);
    return resultJsonData;
}

