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
} from './courses';

import {
} from './comments';

import {
} from './exams';

import {
} from './questions';

import {
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
router.put('/questions/:questionId/edit', async (req: Request<QuestionRouteParams, any, QuestionBodyParams>, res: Response) => {
    const { questionId } = req.params;
    const { questionText, questionType, questionPNG } = req.body;

    if (!questionText && !questionType && !questionPNG) {
        res.status(400).json('No changes made');
        return;
    }

    const questionRepository = getConnection().getRepository(QuestionDb);
    const question = await questionRepository.findOne({ where: { questionId } });

    if (!question) {
        res.status(404).json('Question not found');
        return;
    }

    if (questionText) {
        question.questionText = questionText;
    }

    if (questionType) {
        question.questionType = questionType;
    }

    if (questionPNG) {
        question.questionPNG = questionPNG;
    }

    question.updated_at = new Date();
    await questionRepository.update(question.questionId, question);

    res.status(200).json('Question edited');
});

// Edits a comment
router.put('/comments/:commentId/edit', async (req: Request<CommentRouteParams, any, CommentBodyParams>, res: Response) => {
    const { commentId } = req.params;
    const { commentText, commentPNG, userId } = req.body;

    if (!commentId || !userId) {
        res.status(400).json('Invalid commentId');
        return;
    }

    if (!commentText && !commentPNG) {
        res.status(400).json('No changes made');
        return;
    }

    const commentRepository = getConnection().getRepository(CommentDb);
    const comment = await commentRepository.findOne({ where: { commentId } });

    if (!comment) {
        res.status(404).json('Comment not found');
        return;
    }

    if (comment.userId !== userId) {
        res.status(401).json('Unauthorized');
        return;
    }

    if (commentText) {
        comment.commentText = commentText;
    }

    if (commentPNG) {
        comment.commentPNG = commentPNG;
    }

    comment.updated_at = new Date();
    await commentRepository.update(comment.commentId, comment);

    res.status(200).json('Comment edited');
});

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
router.patch('/comments/:commentId/delete', async (req: Request<CommentRouteParams>, res: Response) => {
    const { commentId } = req.params;
    const { userId } = req.body;

    const commentRepository = getConnection().getRepository(CommentDb);
    const comment = await commentRepository.findOne({ where: { commentId } });

    if (!comment) {
        res.status(404).json('Comment not found');
        return;
    }

    if (comment.userId !== userId) {
        res.status(401).json('Unauthorized');
        return;
    }

    comment.commentText = "Deleted";
    comment.commentPNG = "Deleted";
    comment.isCorrect = false;
    comment.isEndorsed = false;
    comment.upvotes = 0;
    comment.downvotes = 0;
    commentRepository.update(comment.commentId, comment);

    res.status(200).json('Comment deleted');
});

// Sets a comment as correct
router.patch('/comments/:commentId/correct', async (req: Request<CommentRouteParams>, res: Response) => {
    const { commentId } = req.params;

    const commentRepository = getConnection().getRepository(CommentDb);
    const comment = await commentRepository.findOne({ where: { commentId } });

    if (!comment) {
        res.status(404).json('Comment not found');
        return;
    }

    comment.isCorrect = true;
    commentRepository.update(comment.commentId, comment);

    res.status(200).json('Comment marked as correct');
});

// Sets a comment as incorrect
router.patch('/comments/:commentId/incorrect', async (req: Request<CommentRouteParams>, res: Response) => {
    const { commentId } = req.params;

    const commentRepository = getConnection().getRepository(CommentDb);
    const comment = await commentRepository.findOne({ where: { commentId } });

    if (!comment) {
        res.status(404).json('Comment not found');
        return;
    }

    comment.isCorrect = false;
    commentRepository.update(comment.commentId, comment);

    res.status(200).json('Comment marked as incorrect');
});

// Endorses a comment
router.patch('/comments/:commentId/endorse', async (req: Request<CommentRouteParams>, res: Response) => {
    const { commentId } = req.params;

    const commentRepository = getConnection().getRepository(CommentDb);
    const comment = await commentRepository.findOne({ where: { commentId } });

    if (!comment) {
        res.status(404).json('Comment not found');
        return;
    }

    comment.isEndorsed = true;
    commentRepository.update(comment.commentId, comment);

    res.status(200).json('Comment endorsed');
});

// Removes endorsement from a comment
router.patch('/comments/:commentId/unendorse', async (req: Request<CommentRouteParams>, res: Response) => {
    const { commentId } = req.params;

    const commentRepository = getConnection().getRepository(CommentDb);
    const comment = await commentRepository.findOne({ where: { commentId } });

    if (!comment) {
        res.status(404).json('Comment not found');
        return;
    }

    comment.isEndorsed = false;
    commentRepository.update(comment.commentId, comment);

    res.status(200).json('Comment removed endorsement');
});


// Downvotes a comment
router.patch('/comments/:commentId/downvote', async (req: Request<CommentRouteParams>, res: Response) => {
    const { commentId } = req.params;
    const { userId } = req.body;

    const userRows = getConnection().getRepository(UserDb);
    const user = await userRows.findOne({ where: { userId } });

    if (!user) {
        res.status(400).json('User does not exist');
        return;
    }

    // check to see if has been upvoted
    if (user.downvoted.includes(commentId)) {
        res.status(400).json('Already downvoted');
        return;
    }

    const commentRows = getConnection().getRepository(CommentDb);
    const comment = await commentRows.findOne({ where: { commentId } });

    if (!comment) {
        res.status(404).json('Comment not found');
        return;
    }

    comment.downvotes += 1;
    commentRows.update(comment.commentId, comment);

    user.downvoted.push(commentId);
    userRows.update(user.userId, user);

    res.status(200).json('Comment downvoted');
});

// Upvotes a comment
router.patch('/comments/:commentId/upvote', async (req: Request<CommentRouteParams>, res: Response) => {
    const { commentId } = req.params;
    const { userId } = req.body;

    const userRows = getConnection().getRepository(UserDb);
    const user = await userRows.findOne({ where: { userId } });

    if (!user) {
        res.status(400).json('User does not exist');
        return;
    }

    // check to see if has been downvoted
    if (user.upvoted.includes(commentId)) {
        res.status(400).json('Already upvoted');
        return;
    }

    const commentRows = getConnection().getRepository(CommentDb);
    const comment = await commentRows.findOne({ where: { commentId} });

    if (!comment) {
        res.status(404).json('Comment not found');
        return;
    }

    comment.upvotes += 1;
    commentRows.update(comment.commentId, comment);

    user.upvoted.push(commentId);
    userRows.update(user.userId, user);

    res.status(200).json('Comment upvoted');
});

/*
 * Post Requests below
 * ===================
 *
 * Inputs and params are described within HANDSHAKE.md
 *
 */

// Adds a new user to the database
router.post('/users', async (req: Request<any, any, any, any>, res: Response) => {
    const { userId } = req.body;

    if (!userId) {
        res.status(400).json('Missing userId');
        return;
    }
    
    const userRepository = getConnection().getRepository(UserDb);
    
    // Check for user
    const user = await userRepository.findOne({where: { userId } });
    if (user) {
        res.status(409).json('User already exists');
        return;
    }

    // Add user
    const newUser = new UserDb();
    newUser.userId = userId;
    await userRepository.save(newUser);

    res.status(201).json('User Added');
});

// Adds a new comment to the database
router.post('/comments', async (req: Request<any, any, CommentBodyParams>, res: Response) => {
    const {
        userId,
        questionId,
        parentCommentId,
        commentText,
        commentPNG,
    } = req.body;

    // Check key
    if (!questionId || !userId) {
        res.status(400).json('Missing questionId or userId');
        return;
    }

    if (!commentText && !commentPNG) {
        res.status(400).json('Missing commentText or commentPNG');
        return;
    }

    // Check question id
    const questionRepository = getConnection().getRepository(QuestionDb);
    const question = await questionRepository.findOne({ where: { questionId } });
    if (!question) {
        res.status(404).json('Question not found');
        return;
    }

    const commentRepository = getConnection().getRepository(CommentDb);

    // Check parent id
    if (parentCommentId) {
        const parentComment = await commentRepository.findOne({ where: { commentId: parentCommentId } });
        if (!parentComment) {
            res.status(404).json('Parent comment not found');
            return;
        }
        if (parentComment.questionId !== questionId) {
            res.status(400).json('Parent comment is not from the same question');
            return;
        }
    }
    // Query the database and get the id of the new comment
    const newComment = new CommentDb();
    newComment.userId = userId;
    newComment.questionId = questionId;
    
    if (parentCommentId) {
        newComment.parentCommentId = parentCommentId;
    }
    
    if (commentText) {
        newComment.commentText = commentText;
    }
    
    if (commentPNG) {
        newComment.commentPNG = commentPNG;
    }
    const savedComment = await commentRepository.save(newComment);

    res.status(201).json({ commentId: savedComment.commentId });
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

    if (!questionType) {
        res.status(400).json('Missing questionType');
        return;
    }

    // Check exam id
    const examRepository = getConnection().getRepository(ExamDb);
    const exam = await examRepository.findOne({ where: { examId } });
    if (!exam) {
        res.status(404).json('ExamId not found');
        return;
    }

    const questionRepository = getConnection().getRepository(QuestionDb);

    const newQuestion = new QuestionDb();
    newQuestion.examId = examId;
    
    if (questionText) {
        newQuestion.questionText = questionText;
    }

    if (questionPNG) {
        newQuestion.questionPNG = questionPNG;
    }
    newQuestion.questionType = questionType;
    const savedQuestion = await questionRepository.save(newQuestion);

    res.status(201).json({ questionId: savedQuestion.questionId});
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
    if (!courseCode || !examYear || !examSemester || !examType) {
        res.status(400).json('Missing courseCode, examYear, examSemester, or examType');
        return;
    }

    // Check course code
    const courseRepository = getConnection().getRepository(CourseDb);
    const course = await courseRepository.findOne({ where: { courseCode } });
    if (!course) {
        res.status(404).json('Course not found');
        return;
    }

    const examRepository = getConnection().getRepository(ExamDb);
    
    const newExam = new ExamDb();
    newExam.examYear = examYear;
    newExam.examSemester = examSemester;
    newExam.examType = examType;
    newExam.courseCode = courseCode;
    const savedExam = await examRepository.save(newExam);

    res.status(201).json({ examId: savedExam.examId });
});

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
router.get('/comments/:commentId', async (req: Request<CommentRouteParams>, res: Response) => {
    const { commentId } = req.params;

    const commentRepository = getConnection().getRepository(CommentDb);
    const comment = await commentRepository.findOne({ where: { commentId } });

    if (!comment) {
        res.status(404).json('Comment not found');
        return;
    }

    res.status(200).json(comment);
});

// Gets all comments by question id
router.get('/questions/:questionId/comments', async (req: Request<QuestionRouteParams>, res: Response) => {
    const { questionId } = req.params;

    const commentRepository = getConnection().getRepository(CommentDb);
    const questionRepository = getConnection().getRepository(QuestionDb);
    const questions = await questionRepository.findOne({ where: { questionId } });

    if (!questions) {
        res.status(404).json('Question not found');
        return;
    }

    const comments = await commentRepository.find({ where: { questionId } });

    res.status(200).json(nest(comments));
});


// Gets question information by question id
router.get('/questions/:questionId', async (req: Request<QuestionRouteParams>, res: Response) => {
    const { questionId } = req.params;

    const questionRepository = getConnection().getRepository(QuestionDb);
    const question = await questionRepository.findOne({ where: { questionId } });

    if (!question) {
        res.status(404).json('Question not found');
        return;
    }

    res.status(200).json(question);
});

// Exam questions by exam ID
router.get('/exams/:examId/questions', async (req: Request<ExamRouteParams>, res: Response) => {
    const { examId } = req.params;

    const questionRepository = getConnection().getRepository(QuestionDb);
    const questions = await questionRepository.find({ where: { examId } });

    if (!questions) {
        res.status(404).json('Questions not found');
        return;
    }

    res.status(200).json(questions);
});


// Exam by ID
router.get('/exams/:examId', async (req: Request<ExamRouteParams>, res: Response) => {
    const { examId } = req.params;

    const examRepository = getConnection().getRepository(ExamDb);
    const exam = await examRepository.findOne({ where: { examId } });

    if (!exam) {
        res.status(404).json('Exam not found');
        return;
    }

    res.status(200).json(exam);
});

// A course's exams by code
router.get('/courses/:courseCode/exams', async (req: Request<CourseRouteParams>, res: Response) => {
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
});

// A Courses information by code
router.get('/courses/:courseCode', async (req: Request<CourseRouteParams>, res: Response) => {
    const { courseCode } = req.params;
    
    const courseRepository = getConnection().getRepository(CourseDb);  
    const course = await courseRepository.findOne({ where: { courseCode } });

    if (!course) {
        res.status(404).json('Course not found');
        return;
    }

    res.status(200).json(course);
});

// All courses
router.get('/courses', async (req: Request<any, any, any, CourseQueryParams>, res: Response) => {
    const offset = req.query.offset ?? 0;
    const limit = req.query.limit ?? 100;

    const courseRepository = getConnection().getRepository(CourseDb);
    const courses = await courseRepository.find({ skip: offset, take: limit });

    res.status(200).json(courses);
});

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
