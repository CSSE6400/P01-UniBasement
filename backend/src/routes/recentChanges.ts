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
    const comments = await commentRepository.createQueryBuilder('comment')
        .innerJoin('comment.question', 'question')
        .innerJoin('question.exam', 'exam')
        .where('comment.createdAt > :lastVisited', { lastVisited: new Date(Number(lastVisited)) })
        .andWhere('exam.courseCode IN (:...courseCodes)', { courseCodes: courseCodes })
        .getMany();

    res.status(200).json(comments);
}