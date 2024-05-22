import { Request, Response } from 'express';
import { getConnection } from '../db';
import { Comment as CommentDb } from '../db/Comments';

export async function getRecentChanges(req: Request<any, any, any, {
    lastVisited: string,
    courseCodes: string | string[]
}>, res: Response) {
    let { courseCodes, lastVisited } = req.query;

    if (!courseCodes || !lastVisited) {
        res.status(400).json('Must provide courseCodes and lastVisited');
        return;
    }

    if (!Array.isArray(courseCodes)) {
        courseCodes = [courseCodes];
    }

    const commentRepository = getConnection().getRepository(CommentDb);
    const recentChanges = await commentRepository.createQueryBuilder('comment')
        .select([
            'exam.courseCode',
            'exam.examId AS "examId"',
            'exam.examYear AS "examYear"',
            'exam.examSemester AS "examSemester"',
            'exam.examType AS "examType"',
            'COUNT(comment.commentId) AS changes',
        ])
        .innerJoin('comment.question', 'question')
        .innerJoin('question.exam', 'exam')
        .where('comment.createdAt > :lastVisited', { lastVisited: new Date(Number(lastVisited)) })
        .andWhere('exam.courseCode IN (:...courseCodes)', { courseCodes: courseCodes })
        .groupBy('exam.courseCode')
        .addGroupBy('exam."examId"')
        .getRawMany();

    const groupedChanges = recentChanges.reduce((acc, change) => {
        const exam = {
            examId: change.examId,
            examYear: change.examYear,
            examSemester: change.examSemester,
            examType: change.examType,
            changes: Number(change.changes),
        };

        if (acc.has(change.exam_courseCode)) {
            acc.get(change.exam_courseCode).push(exam);
        } else {
            acc.set(change.exam_courseCode, [exam]);
        }

        return acc;
    }, new Map());

    const formattedChanges = Array.from(groupedChanges, ([courseCode, exams]) => ({
        courseCode,
        exams,
    }));

    res.status(200).json(formattedChanges);
}