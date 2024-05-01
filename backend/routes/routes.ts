// Imports
import { Router, Request, Response } from 'express'; // Import Request and Response types
import * as db from '../db/index';
import { v4 as uuidv4, validate } from 'uuid';
const { exec } = require('child_process');

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
router.put('/questions/:questionId/edit', async (req: Request, res: Response) => {
    const questionId = req.params.questionId
    const { questionText, questionType, questionPNG } = req.body;
    await db.query(`
    UPDATE questions
    SET questionText = $1, questionType = $2, questionPNG = $3
    WHERE questions.questionId = $4
    `, [questionText, questionType, questionPNG, questionId]);
    res.status(200).json('Question Edited!');
});

// Deletes a comment
router.put('/comments/:commentId/delete', async (req: Request, res: Response) => {
    const commentId = req.params.commentId;
    editComment(+commentId, '', '');
    res.status(200).json('Comment Deleted!');
});

// Edits a comment
router.put('/comments/:commentId/edit', async (req: Request, res: Response) => {
    const commentId = req.params.commentId;
    editComment(+commentId, req.body.commentText, req.body.commentPNG);
    res.status(200).json('Comment Edited!');
});

/*
 * Patches
 * =======
 *
 * Inputs and params are described within HANDSHAKE.md
 *
 */

// Sets a comment as correct
router.patch('/comments/:commentId/correct', async (req: Request, res: Response) => {
    const commentId = req.params.commentId;
    await db.query(`
    UPDATE comments
    SET "isCorrect" = true
    WHERE "commentId" = $1
    `, [commentId]);
    res.status(200).json('Corrected!');
});

// Endorses a comment
router.patch('/comments/:commentId/endorse', async (req: Request, res: Response) => {
    const commentId = req.params.commentId;
    await db.query(`
    UPDATE comments
    SET "isEndorsed" = true
    WHERE "commentId" = $1
    `, [commentId]);
    res.status(200).json('Endorsed!');
});

// Downvotes a comment
router.patch('/comments/:commentId/downvote', async (req: Request, res: Response) => {
    const commentId = req.params.commentId;
    await db.query(`
    UPDATE comments
    SET "downvotes" = "downvotes" + 1
    WHERE "commentId" = $1
    `, [commentId]);
    res.status(200).json('Downvoted!');
});

// Upvotes a comment
router.patch('/comments/:commentId/upvote', async (req: Request, res: Response) => {
    const commentId = req.params.commentId;
    await db.query(`
    UPDATE comments
    SET "upvotes" = "upvotes" + 1
    WHERE "commentId" = $1
    `, [commentId]);
    res.status(200).json('Upvoted!');
});

/*
 * Post Requests below
 * ===================
 *
 * Inputs and params are described within HANDSHAKE.md
 *
 */

// Adds a new comment to the database
router.post('/comments', async (req: Request, res: Response) => {
    const { parentCommentId, commentText, commentPNG, isCorrect, isEndorsed, upvotes, downvotes } = req.body;
    await db.query(`
    INSERT INTO comments ("parentCommentId", "commentText", "commentPNG", "isCorrect", "isEndorsed", "upvotes", "downvotes")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [parentCommentId, commentText, commentPNG, isCorrect, isEndorsed, upvotes, downvotes]);
    res.status(201).json('Comment Added!');
});

// Adds a new question to the database
router.post('/questions', async (req: Request, res: Response) => {
    const { examId, questionText, questionType, questionPNG } = req.body;
    await db.query(`
    INSERT INTO questions ("examId", "questionText", "questionType", "questionPNG")
    VALUES ($1, $2, $3, $4)
    `, [examId, questionText, questionType, questionPNG]);
    res.status(201).json('Question Added!');
});

// Adds a new exam to the database
router.post('/exams', async (req: Request, res: Response) => {
    const { examYear, examSemester, examType, courseCode } = req.body;
    await db.query(`
    INSERT INTO exams ("examYear", "examSemester", "examType", "courseCode")
    VALUES ($1, $2, $3, $4)
    `, [examYear, examSemester, examType, courseCode]);
    res.status(201).json('Exam Added!');
});

// Adds a new Course to the database
router.post('/courses', async (req: Request, res: Response) => {
    const { courseCode, courseName, courseDescription } = req.body;
    await db.query(`
    INSERT INTO courses ("courseCode", "courseName", "courseDescription")
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
    const commentId = req.params.commentId;
    const comment = await db.query(`
    SELECT "commentId", "parentCommentId", "commentText", "commentPNG", "isCorrect", "isEndorsed", "upvotes", "downvotes", "created_at", "updated_at"
    FROM comments
    WHERE comments."commentId" = $1
    `, [commentId]);
    res.status(200).json(comment.rows[0]);
});

// Gets all comments by question id
router.get('/questions/:questionId/comments', async (req: Request, res: Response) => {
    const questionId = req.params.questionId;
    const question = await db.query(`
    SELECT "commentId", "parentCommentId", "commentText", "commentPNG", "isCorrect", "isEndorsed", "upvotes", "downvotes", "created_at", "updated_at"
    FROM comments
    WHERE comments."questionId" = $1
    `, [questionId]);
    res.status(200).json(nest(question.rows));
});

// Gets question information by question id
router.get('/questions/:questionId', async (req: Request, res: Response) => {
    const questionId = req.params.questionId;
    const question = await db.query(`
    SELECT "questionId", "questionText", "questionType", "questionPNG"
    FROM questions
    WHERE questions."questionId" = $1
    `, [questionId]);
    res.status(200).json(question.rows[0]);
});

// Exam questions by exam ID
router.get('/exams/:examId/questions', async (req: Request, res: Response) => {
    const examId = req.params.examId;
    const exam = await db.query(`
    SELECT "questionId", "questionText", "questionType", "questionPNG"
    FROM questions
    WHERE questions."examId" = $1
    `, [examId]);
    res.status(200).json(exam.rows);
});

// Exam by ID
router.get('/exams/:examId', async (req: Request, res: Response) => {
    const examId = req.params.examId;
    const exams = await db.query(`
    SELECT "examId", "examYear", "examSemester", "examType"
    FROM exams
    WHERE exams."examId" = $1
    `, [examId]);
    res.status(200).json(exams.rows[0]);
});

// A course's exams by code
router.get('/courses/:courseCode/exams', async (req: Request, res: Response) => {
    const courseCode = req.params.courseCode;
    const course = await db.query(`
    SELECT "examId", "examYear", "examSemester", "examType"
    FROM exams
    WHERE exams."courseCode" = $1
    `, [courseCode]);
    res.status(200).json(course.rows);
});

// A Courses information by code
router.get('/courses/:courseCode', async (req: Request, res: Response) => {
    const courseCode = req.params.courseCode;
    const course = await db.query(`
    SELECT "courseCode", "courseName", "courseDescription"
    FROM courses
    WHERE courses."courseCode" = $1
    `, [courseCode]);
    res.status(200).json(course.rows[0]);
});

// All courses
router.get('/courses', async (req: Request, res: Response) => {
    const offet = req.query.offset ?? 0;
    const limit = req.query.limit ?? 100;
    const courses = await db.query(`
    SELECT "courseCode", "courseName", "courseDescription" 
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

// The sketch route
router.get('/sketch', async (req: Request, res: Response) => {
    const b = await db.query1('SELECT * FROM courses')
    if (b.rows.length != 0) {
        return
    }

    await db.query1(`
        INSERT INTO courses ("courseCode", "courseName", "courseDescription") 
        VALUES 
            ('ENGG1001', 'Programming for Engineers', 'An introductory course covering basic concepts of software engineering.'),
            ('MATH1051', 'Calculus & Linear Algebra', 'A foundational course in calculus covering limits, derivatives, and integrals.'),
            ('ENGG1100', 'Professional Engineering', 'An introductory course covering fundamental concepts in engineering principles.');
        
        INSERT INTO exams ("courseCode", "examYear", "examSemester", "examType")
        VALUES 
            ('ENGG1001', 2021, 1, 'Final'),
            ('ENGG1001', 2022, 1, 'Final'),
            ('ENGG1001', 2023, 1, 'Final'),
            ('MATH1051', 2021, 1, 'Midterm'),
            ('MATH1051', 2021, 1, 'Final'),
            ('MATH1051', 2021, 2, 'Midterm'),
            ('MATH1051', 2021, 2, 'Final'),
            ('MATH1051', 2021, 3, 'Midterm'),
            ('MATH1051', 2021, 3, 'Final'),
            ('MATH1051', 2022, 1, 'Midterm'),
            ('MATH1051', 2022, 1, 'Final'),
            ('MATH1051', 2022, 2, 'Midterm'),
            ('MATH1051', 2022, 2, 'Final'),
            ('MATH1051', 2022, 3, 'Midterm'),
            ('MATH1051', 2022, 3, 'Final'),
            ('MATH1051', 2023, 1, 'Midterm'),
            ('MATH1051', 2023, 1, 'Final'),
            ('MATH1051', 2023, 2, 'Midterm'),
            ('MATH1051', 2023, 2, 'Final'),
            ('MATH1051', 2023, 3, 'Midterm'),
            ('MATH1051', 2023, 3, 'Final');

        INSERT INTO questions ("examId", "questionText", "questionType")
        VALUES 
            (1, 'Who is the best tutor at UQ?', 'Multiple Choice'),
            (2, 'Who is not the best tutor at UQ?', 'Multiple Choice'),
            (3, 'Who is the second best tutor at UQ?', 'Multiple Choice');
        
        INSERT INTO comments ("questionId", "parentCommentId", "commentText", "isCorrect", "isEndorsed", "upvotes", "downvotes")
        VALUES 
            (1, NULL, 'Evan Hughes', TRUE, TRUE, 100, 1),
            (1, 1, 'Are you stupid it is clearly Liv Ronda', FALSE, FALSE, 0, 100),
            (1, 2, 'Bro went to stupid school L', FALSE, TRUE, 999, 1),
            (1, 1, 'Fax what a goat', FALSE, FALSE, 80, 1),
            (2, NULL, 'Not Evan Hughes cause he is the best', TRUE, TRUE, 100, 1),
            (2, 5, 'Facts it is clearly Liv Ronda because she is the worst', TRUE, TRUE, 999, 0),
            (2, 6, 'ong', FALSE, TRUE, 9, 1),
            (2, 5, 'Fax what a goat', FALSE, FALSE, 80, 1),
            (3, NULL, 'Not Evan Hughes cause he is the best', TRUE, TRUE, 100, 1),
            (3, 9, 'TRUEEE!!!', TRUE, TRUE, 999, 0),
            (3, 10, 'ong', FALSE, TRUE, 9, 1),
            (3, 9, 'Fax what a goat', FALSE, FALSE, 80, 1);


    `);
    res.status(200).json(`THIS SHIT SKETCH ASF AND WAS LIV'S IDEA!!!`);
});
// Interfaces

// Used in nest helper function
interface CommentObject {
    commentId: number;
    parentCommentId: number | null;
    commenttext: string;
    commentPNG: string | null;
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
async function editComment(commentId: number, commentText: string, commentPNG: string) {
    await db.query(`
    UPDATE comments
    SET commentText = $1, commentPNG = $2
    WHERE commentId = $3
    `, [commentText, commentPNG, commentId]);
}

// function to nest comments into their parent comments
export function nest(jsonData: any[]) {
    const dataDict: { [id: number]: CommentObject } = {};
    jsonData.forEach(item => dataDict[item.commentId] = item);

    jsonData.forEach(item => {
        if (item.parentCommentId !== null) {
            const parent = dataDict[item.parentCommentId];
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(item);
        }
    });

    const resultJsonData = jsonData.filter(item => item.parentCommentId === null);
    return resultJsonData;
}

// function to return one comment with its children
export function single_nest(jsonData: any[], commentId: number) {
    const dataDict: { [id: number]: CommentObject } = {};
    jsonData.forEach(item => dataDict[item.commentId] = item);

    jsonData.forEach(item => {
        if (item.parentCommentId !== null) {
            const parent = dataDict[item.parentCommentId];
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(item);
        }
    });

    const resultJsonData = jsonData.filter(item => item.commentId === commentId);
    return resultJsonData;
}
