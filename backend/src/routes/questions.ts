// Imports
import { Request, Response } from 'express'; // Import Request and Response types
import { QuestionBodyParams, QuestionRouteParams } from '../types';

import { getConnection } from '../db/index';
import { Exam as ExamDb } from '../db/Exam';
import { Question as QuestionDb } from '../db/Questions';
import { Comment as CommentDb } from '../db/Comments';
import { User as UserDb } from '../db/User';

import { nest } from './helpful_friends';

export async function editQuestion(req: Request<QuestionRouteParams, any, QuestionBodyParams>, res: Response) {
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
}

export async function postQuestion(req: Request<any, any, QuestionBodyParams>, res: Response) {
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
}

export async function getQuestionComments(req: Request<QuestionRouteParams>, res: Response) {
    const { questionId, userId } = req.params;

    const commentRepository = getConnection().getRepository(CommentDb);
    const questionRepository = getConnection().getRepository(QuestionDb);
    const questions = await questionRepository.findOne({ where: { questionId } });

    if (!questions) {
        res.status(404).json('Question not found');
        return;
    }

    if (!userId) {
        res.status(400).json('Missing userId');
        return;
    }

    const userRepository = getConnection().getRepository(UserDb);
    const user = await userRepository.findOne({ where: { userId } });

    if (!user) {
        res.status(404).json('User not found');
        return;
    }

    const comments = await commentRepository.find({ where: { questionId } });

    let commentsWithFlag = comments.map((comment) => {
        return {
            ...comment,
            upvoted: user.upvoted.includes(comment.commentId),
            downvoted: user.downvoted.includes(comment.commentId),
        }
    });
    
    res.status(200).json(nest(commentsWithFlag));
}

export async function getQuestion(req: Request<QuestionRouteParams>, res: Response) {
    const { questionId } = req.params;

    const questionRepository = getConnection().getRepository(QuestionDb);
    const question = await questionRepository.findOne({ where: { questionId } });

    if (!question) {
        res.status(404).json('Question not found');
        return;
    }

    res.status(200).json(question);
}
