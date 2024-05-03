// Imports
import { Router, Request, Response } from 'express'; // Import Request and Response types
import * as db from '../db';
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
} from '../types';

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
router.put('/questions/:questionId/edit', async (req: Request<QuestionRouteParams, any, QuestionBodyParams>, res: Response) => {
    const { questionId } = req.params;
    const { questionText, questionType, questionPNG } = req.body;

    if (!questionText && !questionType && !questionPNG) {
        res.status(400).json('No changes made');
        return;
    }

    const args = [];
    let count = 1;
    let query = `UPDATE questions SET `;

    if (questionText) {
        query += `"questionText" = $${count}::text, `
        args.push(questionText);
        count++;
    }

    if (questionType) {
        query += `"questionType" = $${count}::text, `
        args.push(questionType);
        count++;
    }

    if (questionPNG) {
        query += `"questionPNG" = $${count}::text, `
        args.push(questionPNG);
        count++;
    }

    query += `updated_at = NOW() WHERE "questionId" = $${count}::int`
    args.push(questionId);

    const { rowCount } = await db.query(query, args);
    if (rowCount === 0) {
        res.status(404).json('Question not found');
        return;
    }

    res.status(200).json('Question edited');
});

// Edits a comment
router.put('/comments/:commentId/edit', async (req: Request<CommentRouteParams, any, CommentBodyParams>, res: Response) => {
    const { commentId } = req.params;

    if (!req.body.commentText && !req.body.commentPNG) {
        res.status(400).json('No changes made');
        return;
    }

    const { rowCount } = await editComment(commentId, req.body.commentText, req.body.commentPNG);
    if (rowCount === 0) {
        res.status(404).json('Comment not found');
        return;
    }

    res.status(200).json('Comment Edited');
});

/*
 * Patches
 * =======
 *
 * Inputs and params are described within HANDSHAKE.md
 *
 */

//TODO needs to be tested
// Deletes a comment
router.patch('/comments/:commentId/delete', async (req: Request<CommentRouteParams>, res: Response) => {
    const { commentId } = req.params;

    const { rowCount } = await editComment(commentId, '', '');
    if (rowCount === 0) {
        res.status(404).json('Question not found');
        return;
    }

    res.status(200).json('Comment Deleted');
});

//TODO needs to be tested
// Sets a comment as correct
router.patch('/comments/:commentId/correct', async (req: Request<CommentRouteParams>, res: Response) => {
    const { commentId } = req.params;

    const { rowCount } = await db.query(`
    UPDATE comments
    SET "isCorrect" = true
    WHERE "commentId" = $1
    `, [commentId]);
    if (rowCount === 0) {
        res.status(404).json('Comment not found');
        return;
    }

    res.status(200).json('Corrected');
});

//TODO needs to be tested
// Endorses a comment
router.patch('/comments/:commentId/endorse', async (req: Request<CommentRouteParams>, res: Response) => {
    const { commentId } = req.params;

    const { rowCount } = await db.query(`
    UPDATE comments
    SET "isEndorsed" = true
    WHERE "commentId" = $1
    `, [commentId]);
    if (rowCount === 0) {
        res.status(404).json('Comment not found');
        return;
    }

    res.status(200).json('Endorsed');
});

//TODO needs to be tested
// Downvotes a comment
router.patch('/comments/:commentId/downvote', async (req: Request<CommentRouteParams>, res: Response) => {
    const { commentId } = req.params;

    const { rowCount } = await db.query(`
    UPDATE comments
    SET "downvotes" = "downvotes" + 1
    WHERE "commentId" = $1
    `, [commentId]);
    if (rowCount === 0) {
        res.status(404).json('Comment not found');
        return;
    }

    res.status(200).json('Downvoted');
});

//TODO needs to be tested
// Upvotes a comment
router.patch('/comments/:commentId/upvote', async (req: Request<CommentRouteParams>, res: Response) => {
    const { commentId } = req.params;

    const { rowCount } = await db.query(`
    UPDATE comments
    SET "upvotes" = "upvotes" + 1
    WHERE "commentId" = $1
    `, [commentId]);
    if (rowCount === 0) {
        res.status(404).json('Comment not found');
        return;
    }

    res.status(200).json('Upvoted');
});

/*
 * Post Requests below
 * ===================
 *
 * Inputs and params are described within HANDSHAKE.md
 *
 */

//TODO needs to be tested
// Adds a new comment to the database
router.post('/comments', async (req: Request<any, any, CommentBodyParams>, res: Response) => {
    const {
        questionId,
        parentCommentId,
        commentText,
        commentPNG,
        isCorrect,
        isEndorsed,
        upvotes,
        downvotes,
    } = req.body;

    // Check key
    if (!questionId) {
        res.status(400).json('Missing questionId');
        return;
    }

    const { rowCount } = await db.query(`SELECT "questionId" FROM questions WHERE "questionId" = $1`, [questionId]);
    if (rowCount === 0) {
        res.status(404).json('Question not found');
        return;
    }

    // Check parent id
    if (parentCommentId) {
        const { rowCount, rows } = await db.query<Partial<IComment>>(`SELECT "commentId", "questionId" FROM comments WHERE "commentId" = $1`, [parentCommentId]);
        if (rowCount === 0) {
            res.status(404).json('Parent comment not found');
            return;
        }
        const parentComment = rows[0];
        if (parentComment.questionId !== questionId) {
            res.status(400).json('Parent comment is not from the same question');
            return;
        }
    }

    await db.query(`
    INSERT INTO comments ("questionId", "parentCommentId", "commentText", "commentPNG", "isCorrect", "isEndorsed", "upvotes", "downvotes")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [questionId, parentCommentId, commentText, commentPNG, isCorrect, isEndorsed, upvotes, downvotes]);

    res.status(201).json('Comment Added');
});

// Adds a new question to the database
router.post('/questions', async (req: Request<any, any, QuestionBodyParams>, res: Response) => {
    const {
        examId,
        questionText,
        questionType,
        questionPNG,
    } = req.body;

    // Check key
    if (!examId) {
        res.status(400).json('Missing examId');
        return;
    }

    const { rowCount } = await db.query(`SELECT "examId" FROM exams WHERE "examId" = $1`, [examId]);
    if (rowCount === 0) {
        res.status(404).json('ExamId not found');
        return;
    }

    await db.query(`
    INSERT INTO questions ("examId", "questionText", "questionType", "questionPNG")
    VALUES ($1, $2, $3, $4)
    `, [examId, questionText, questionType, questionPNG]);

    res.status(201).json('Question added');
});

// Adds a new exam to the database
router.post('/exams', async (req: Request<any, any, ExamBodyParams>, res: Response) => {
    const {
        examYear,
        examSemester,
        examType,
        courseCode,
    } = req.body;

    // Check key
    if (!courseCode) {
        res.status(400).json('Missing courseCode');
        return;
    }

    const { rowCount } = await db.query(`SELECT "courseCode" FROM courses WHERE "courseCode" = $1`, [courseCode]);
    if (rowCount === 0) {
        res.status(404).json('Course not found');
        return;
    }

    await db.query(`
    INSERT INTO exams ("examYear", "examSemester", "examType", "courseCode")
    VALUES ($1, $2, $3, $4)
    `, [examYear, examSemester, examType, courseCode]);

    res.status(201).json('Exam created');
});

// Adds a new Course to the database
router.post('/courses', async (req: Request<any, any, CourseBodyParams>, res: Response) => {
  const {
      courseCode,
      courseName,
      courseDescription,
  } = req.body;

  if (!courseCode) {
      res.status(400).json('Course Code is required');
      return;
  }

  const { rowCount } = await db.query(`SELECT "courseCode" FROM courses WHERE "courseCode" = $1`, [courseCode]);
  if (rowCount !== 0) {
      res.status(409).json('Course Code already exists');
      return;
  }

  await db.query(`
  INSERT INTO courses ("courseCode", "courseName", "courseDescription")
  VALUES ($1, $2, $3)
  `, [courseCode, courseName, courseDescription]);

  res.status(201).json('Course Added');
});

/*
 * Get Requests below
 * ==================
 *
 * See outputs and params in HANDSHAKE.md
 *
 */

//TODO needs to be tested
// Gets comment by comment id
router.get('/comments/:commentId', async (req: Request<CommentRouteParams>, res: Response) => {
    const { commentId } = req.params;

    const { rows } = await db.query<IComment>(`
    SELECT "commentId", "questionId", "parentCommentId", "commentText", "commentPNG", "isCorrect", "isEndorsed", "upvotes", "downvotes", "created_at", "updated_at"
    FROM comments
    WHERE comments."commentId" = $1
    `, [commentId]);

    res.status(200).json(rows[0]);
});

// Gets all comments by question id
router.get('/questions/:questionId/comments', async (req: Request<QuestionRouteParams>, res: Response) => {
    const { questionId } = req.params;

    // Check if the questionId exists in the database
    const { rows : questionRows } = await db.query(`
        SELECT "questionId"
        From questions
        WHERE "questionId" = $1
    `, [questionId]);

    if (questionRows.length === 0) {
        return res.status(404).json({ error: 'Question not found' });
    }

    const { rows } = await db.query<IComment>(`
        SELECT "commentId", "parentCommentId", "commentText", "commentPNG", "isCorrect", "isEndorsed", "upvotes", "downvotes", "created_at", "updated_at"
        FROM comments
        WHERE comments."questionId" = $1
    `, [questionId]);

    res.status(200).json(nest(rows));
});


// Gets question information by question id
router.get('/questions/:questionId', async (req: Request<QuestionRouteParams>, res: Response) => {
    const { questionId } = req.params;

    // Check if the questionId exists in the database
    const { rows : questionRows } = await db.query(`
        SELECT "questionId"
        From questions
        WHERE "questionId" = $1
    `, [questionId]);

    if (questionRows.length === 0) {
        return res.status(404).json({ error: 'Question not found' });
    }

    const { rows } = await db.query<Question>(`
    SELECT "questionId", "questionText", "questionType", "questionPNG"
    FROM questions
    WHERE questions."questionId" = $1
    `, [questionId]);

  res.status(200).json(rows[0]);
});

// Exam questions by exam ID
router.get('/exams/:examId/questions', async (req: Request<ExamRouteParams>, res: Response) => {
  const { examId } = req.params;

  const { rows } = await db.query<Question>(`
  SELECT "questionId", "questionText", "questionType", "questionPNG"
  FROM questions
  WHERE questions."examId" = $1
  `, [examId]);

  if (rows.length === 0) {
      res.status(404).json('No questions found for this exam');
      return;
  }

  res.status(200).json(rows);
});


// Exam by ID
router.get('/exams/:examId', async (req: Request<ExamRouteParams>, res: Response) => {
  const { examId } = req.params;

  const { rows } = await db.query<Exam>(`
  SELECT "examId", "examYear", "examSemester", "examType"
  FROM exams
  WHERE exams."examId" = $1
  `, [examId]);

  if (rows.length === 0) {
      res.status(404).json('Exam not found');
      return;
  }

  res.status(200).json(rows[0]);
});

// A course's exams by code
router.get('/courses/:courseCode/exams', async (req: Request<CourseRouteParams>, res: Response) => {
    const { courseCode } = req.params;

    const { rows } = await db.query<Exam>(`
    SELECT "examId", "examYear", "examSemester", "examType"
    FROM exams
    WHERE exams."courseCode" = $1
    `, [courseCode]);

    res.status(200).json(rows);
});

// A Courses information by code
router.get('/courses/:courseCode', async (req: Request<CourseRouteParams>, res: Response) => {
  const { courseCode } = req.params;

  const { rows } = await db.query<Course>(`
  SELECT "courseCode", "courseName", "courseDescription"
  FROM courses
  WHERE courses."courseCode" = $1
  `, [courseCode]);

  if (rows.length === 0) {
      res.status(404).json('Course not found');
      return;
  }

  res.status(200).json(rows[0]);
});

// All courses
router.get('/courses', async (req: Request<any, any, any, CourseQueryParams>, res: Response) => {
    const offset = req.query.offset ?? 0;
    const limit = req.query.limit ?? 100;

    const { rows } = await db.query<Course>(`
    SELECT "courseCode", "courseName", "courseDescription" 
    FROM courses 
    LIMIT $1 
    OFFSET $2
    `, [limit, offset]);

    res.status(200).json(rows);
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
    const b = await db.query1('SELECT "examId" FROM exams WHERE "examId" = 1');
    if (b.rows.length != 0) {
        res.status(400).json('Data already exists');
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
            (3, 'Who is the second best tutor at UQ?', 'Multiple Choice'),
            (4, 'A question with no comments', 'Multiple Choice');
        
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

// Helper functions

// function to edit / delete a comment
async function editComment(commentId: number, commentText?: string | null, commentPNG?: string | null) {
    const args = [];
    let query = `UPDATE questions SET `
    let count = 1;

    if (commentText) {
        query += `"commentText" = $${count}::text, `
        args.push(commentText);
        count++;
    }

    if (commentPNG) {
        query += `"commentPNG" = $${count}::text, `
        args.push(commentPNG);
        count++;
    }

    query += `"updated_at" = NOW() WHERE "commentId" = $${count}::int`
    args.push(commentId)

    return await db.query(query, args);
}

// function to nest comments into their parent comments
export function nest(commentRows: IComment[]) {
    const dataDict: { [id: number]: IComment } = {};
    commentRows.forEach(item => dataDict[item.commentId] = item);

    commentRows.forEach(item => {
        if (item.parentCommentId !== null) {
            const parent = dataDict[item.parentCommentId];
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(item);
        }
    });

    const resultJsonData = commentRows.filter(item => item.parentCommentId === null);
    return resultJsonData;
}

// function to return one comment with its children
export function single_nest(commentRows: IComment[], commentId: number) {
    const dataDict: { [id: number]: IComment } = {};
    commentRows.forEach(item => dataDict[item.commentId] = item);

    commentRows.forEach(item => {
        if (item.parentCommentId !== null) {
            const parent = dataDict[item.parentCommentId];
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(item);
        }
    });

    const resultJsonData = commentRows.filter(item => item.commentId === commentId);
    return resultJsonData;
}
