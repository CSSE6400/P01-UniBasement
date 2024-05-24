// Imports
import { Request, Response, Router } from 'express'; // Import Request and Response types
import { ExamBodyParams, ExamRouteParams, UserRole } from '../types';

import { getConnection } from '../db';
import { Course as CourseDb } from '../db/Course';
import { Exam as ExamDb } from '../db/Exam';
import { Question as QuestionDb } from '../db/Questions';
import { User as UserDb } from '../db/User';


export async function postExam(req: Request<any, any, ExamBodyParams>, res: Response) {
    const {
        examYear,
        examSemester,
        examType,
        courseCode,
        userId,
    } = req.body;

    // Check key
    if (!courseCode || !examYear || !examSemester || !examType) {
        res.status(400).json('Missing courseCode, examYear, examSemester, or examType');
        return;
    }

    if (!userId) {
        res.status(400).json('Missing userId');
        return;
    }

    const userRepository = getConnection().getRepository(UserDb);
    const user = await userRepository.findOne({ where: { userId } });

    if (!user || user.role !== UserRole.ADMIN) {
        res.status(403).json('Unauthorized user');
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
}

export async function getExamQuestions(req: Request<ExamRouteParams, any, any>, res: Response) {
    const { examId } = req.params;

    const questionRepository = getConnection().getRepository(QuestionDb);
    const questions = await questionRepository.find({ where: { examId } });

    if (!questions.length) {
        res.status(404).json('Questions not found');
        return;
    }

    res.status(200).json(questions);
}

export async function getExamInfo(req: Request<ExamRouteParams>, res: Response) {
    const { examId } = req.params;

    const examRepository = getConnection().getRepository(ExamDb);
    const exam = await examRepository.findOne({ where: { examId } });

    if (!exam) {
        res.status(404).json('Exam not found');
        return;
    }

    res.status(200).json(exam);
}


