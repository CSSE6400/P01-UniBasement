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

import { nest, single_nest } from './helpful_friends';

// Export Routers
export const router = Router();

export async function postExam(req: Request<any, any, ExamBodyParams>, res: Response) {
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
    const { rows } = await db.query(`
    INSERT INTO exams ("examYear", "examSemester", "examType", "courseCode")
    VALUES ($1, $2, $3, $4)
    RETURNING "examId"
    `, [examYear, examSemester, examType, courseCode]);

res.status(201).json({ examId: rows[0].examId });
}

export async function getExamQuestions(req: Request<ExamRouteParams, any, any>, res: Response) {
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
}

export async function getExamInfo(req: Request<ExamRouteParams>, res: Response) {
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
}


