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

export async function postUser(req: Request, res: Response) {
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
}
