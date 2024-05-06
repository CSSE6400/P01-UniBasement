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
} from '../types';

import { getConnection } from ../index;
import { User as UserDb } from '../db/User';
import { Course as CourseDb } from '../db/Course';
import { Exam as ExamDb } from '../db/Exam';
import { Question as QuestionDb } from '../db/Question';
import { Comment as CommentDb } from '../db/Comment';


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
    const question = await questionRepository.findOne({ questionId });

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
    const comment = await commentRepository.findOne({ commentId });

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
router.patch('/courses/:courseCode/star', async (req: Request<CourseRouteParams>, res: Response) => {
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
    const user = await userRows.findOne({ userId });

    if (!user) {
        res.status(400).json('User does not exist');
        return;
    }

    const courseRepository = getConnection().getRepository(CourseDb);
    const course = await courseRepository.findOne({ courseCode });

    if (!course) {
        res.status(404).json('Course not found');
        return;
    }

    course.stars += starRating - (user.rated[courseCode] ?? 0);
    course.votes += user.rated[courseCode] ? 0 : 1; //TODO
    await courseRepository.update(course.courseCode, course);

    user.rated[courseCode] = starRating;
    await userRows.update(user.userId, user);

    res.status(200).json('Course starred');
});

// Deletes a comment
router.patch('/comments/:commentId/delete', async (req: Request<CommentRouteParams>, res: Response) => {
    const { commentId } = req.params;
    const { userId } = req.body;

    const commentRepository = getConnection().getRepository(CommentDb);
    const comment = await commentRepository.findOne({ commentId });

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
    const comment = await commentRepository.findOne({ commentId });

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
    const comment = await commentRepository.findOne({ commentId });

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
    const comment = await commentRepository.findOne({ commentId });

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
    const comment = await commentRepository.findOne({ commentId });

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
    const user = await userRows.findOne({ userId });

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
    const comment = await commentRows.findOne({ commentId });

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
    const user = await userRows.findOne({ userId });

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
    const comment = await commentRows.findOne({ commentId});

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
    const user = await userRepository.findOne({ userId });
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
    const question = await questionRepository.findOne({ questionId });
    if (!question) {
        res.status(404).json('Question not found');
        return;
    }

    const commentRepository = getConnection().getRepository(CommentDb);

    // Check parent id
    if (parentCommentId) {
        const parentComment = await commentRepository.findOne({ commentId: parentCommentId });
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
    newComment.parentCommentId = parentCommentId;
    newComment.commentText = commentText;
    newComment.commentPNG = commentPNG;
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

    // Check exam id
    const examRepository = getConnection().getRepository(ExamDb);
    const exam = await examRepository.findOne({ examId });
    if (!exam) {
        res.status(404).json('Exam not found');
        return;
    }

    const questionRepository = getConnection().getRepository(QuestionDb);

    const newQuestion = new QuestionDb();
    newQuestion.examId = examId;
    newQuestion.questionText = questionText;
    newQuestion.questionType = questionType;
    newQuestion.questionPNG = questionPNG;
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
    if (!courseCode) {
        res.status(400).json('Missing courseCode');
        return;
    }

    // Check course code
    const courseRepository = getConnection().getRepository(CourseDb);
    const course = await courseRepository.findOne({ courseCode });
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
router.post('/courses', async (req: Request<any, any, CourseBodyParams>, res: Response) => {
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
    const course = await courseRepository.findOne({ courseCode });
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
});

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
    const comment = await commentRepository.findOne({ commentId });

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
    //TODO
    const comments = await commentRepository.find({ questionId });

    res.status(200).json(nest(comments));
});


// Gets question information by question id
router.get('/questions/:questionId', async (req: Request<QuestionRouteParams>, res: Response) => {
    const { questionId } = req.params;

    const questionRepository = getConnection().getRepository(QuestionDb);
    const question = await questionRepository.findOne({ questionId });

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
    const questions = await questionRepository.find({ examId });

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
    const exam = await examRepository.findOne({ examId });

    if (!exam) {
        res.status(404).json('Exam not found');
        return;
    }

    res.status(200).json(exam);
});

// A course's exams by code
router.get('/courses/:courseCode/exams', async (req: Request<CourseRouteParams>, res: Response) => {
    const { courseCode } = req.params;

    const examRepository = getConnection().getRepository(ExamDb);
    const exams = await examRepository.find({ courseCode });

    res.status(200).json(exams);
});

// A Courses information by code
router.get('/courses/:courseCode', async (req: Request<CourseRouteParams>, res: Response) => {
    const { courseCode } = req.params;
    
    const courseRepository = getConnection().getRepository(CourseDb);  
    const course = await courseRepository.find({ courseCode });

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
        INSERT INTO users ("userId")
        VALUES 
            ('evan'),
            ('liv'),
            ('lakshan'),
            ('jackson');

        INSERT INTO courses ("courseCode", "courseName", "courseDescription", "university")
        VALUES 
            ('ENGG1001', 'Programming for Engineers', 'An introductory course covering basic concepts of software engineering.', 'UQ'),
            ('MATH1051', 'Calculus & Linear Algebra', 'A foundational course in calculus covering limits, derivatives, and integrals.', 'UQ'),
            ('ENGG1100', 'Professional Engineering', 'An introductory course covering fundamental concepts in engineering principles.', 'UQ');
        
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
            (4, 'A question with no comments', 'Multiple Choice'),
            (5, 'Question which has a comment to be edited', 'Multiple Choice'), 
            (6, 'Question which has a comment to be deleted', 'Multiple Choice'), 
            (7, 'Question which has a comment to be marked as correct', 'Multiple Choice'),
            (8, 'Question which has a comment to be marked as incorrect', 'Multiple Choice'),
            (9, 'Question which has a comment to be endorsed', 'Multiple Choice'),
            (10, 'Question which has a comment endorsed to be removed', 'Multiple Choice'), 
            (11, 'Question which has a comment to be upvoted', 'Multiple Choice'),
            (12, 'Question which has a comment to be downvoted', 'Multiple Choice'),
            (13, 'Question which has no comments. And one will be added', 'Multiple Choice'),
            (14, 'Question which has a comment. And one will be added', 'Multiple Choice'),
            (15, 'Question which has a comment. And one will be added as nested', 'Multiple Choice'),
            (16, 'Question which has a comment. And this is used for error checks on nesting comments with incorrect parent id.', 'Multiple Choice');
        
        INSERT INTO comments ("questionId", "parentCommentId", "userId", "commentText", "isCorrect", "isEndorsed", "upvotes", "downvotes")
        VALUES 
            (1, NULL, 'evan', 'Evan Hughes', TRUE, TRUE, 100, 1),
            (1, 1, 'liv', 'Are you stupid it is clearly Liv Ronda', FALSE, FALSE, 0, 100),
            (1, 2, 'jackson', 'Bro went to stupid school L', FALSE, TRUE, 999, 1),
            (1, 1, 'lakshan', 'Fax what a goat', FALSE, FALSE, 80, 1),
            (2, NULL, 'evan', 'Not Evan Hughes cause he is the best', TRUE, TRUE, 100, 1),
            (2, 5, 'liv', 'Facts it is clearly Liv Ronda because she is the worst', TRUE, TRUE, 999, 0),
            (2, 6, 'jackson', 'ong', FALSE, TRUE, 9, 1),
            (2, 5, 'lakshan', 'Fax what a goat', FALSE, FALSE, 80, 1),
            (3, NULL, 'evan', 'Not Evan Hughes cause he is the best', TRUE, TRUE, 100, 1),
            (3, 9, 'evan', 'TRUEEE!!!', TRUE, TRUE, 999, 0),
            (3, 10, 'evan', 'ong', FALSE, TRUE, 9, 1),
            (3, 9, 'evan', 'Fax what a goat', FALSE, FALSE, 80, 1),
            (5, NULL, 'evan', 'This is a comment that will be edited', TRUE, TRUE, 100, 1), 
            (6, NULL, 'liv', 'This is a comment that will be deleted', TRUE, TRUE, 100, 1), 
            (7, NULL, 'jackson', 'This is a comment that will be marked as correct', FALSE, FALSE, 100, 1),
            (8, NULL, 'lakshan', 'This is a comment that will be marked as incorrect', TRUE, TRUE, 100, 1),
            (9, NULL, 'liv', 'This is a comment that will be endorsed', TRUE, TRUE, 100, 1),
            (10, NULL, 'jackson', 'This is a comment that will have its endorsement removed', TRUE, TRUE, 100, 1),
            (11, NULL, 'lakshan', 'This is a comment that will be upvoted', TRUE, TRUE, 100, 1),
            (12, NULL, 'evan', 'This is a comment that will be downvoted', TRUE, TRUE, 100, 1),
            (14, NULL, 'evan', 'This is a comment that will be added', TRUE, TRUE, 100, 1),
            (15, NULL, 'liv', 'This is a comment that a test will add a nested comment to', TRUE, TRUE, 100, 1),
            (16, NULL, 'evan', 'This is a comment.', TRUE, TRUE, 100, 1);
    `);
    res.status(200).json(`THIS SHIT SKETCH ASF AND WAS LIV'S IDEA!!!`);
});

// Helper functions

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
