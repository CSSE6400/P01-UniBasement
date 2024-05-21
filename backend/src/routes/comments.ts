// Imports
import { Request, Response } from 'express'; // Import Request and Response types
import { CommentBodyParams, CommentRouteParams } from '../types';

import { getConnection } from '../db';
import { User as UserDb } from '../db/User';
import { Question as QuestionDb } from '../db/Questions';
import { Comment as CommentDb } from '../db/Comments';
import { pushImageToS3 } from './helpfulFriends';

export async function editComments(req: Request<CommentRouteParams, any, CommentBodyParams>, res: Response) {
    const { commentId } = req.params;
    const { commentText, userId } = req.body;

    if (!commentId || !userId) {
        res.status(400).json('Invalid commentId');
        return;
    }

    if (!commentText && !req.file) {
        res.status(400).json('No changes made');
        return;
    }

    const commentRepository = getConnection().getRepository(CommentDb);
    const comment = await commentRepository.findOne({ where: { commentId } });

    if (!comment) {
        res.status(404).json('Comment not found');
        return;
    }

    const userRows = getConnection().getRepository(UserDb);
    const user = await userRows.findOne({ where: { userId } });

    if (!user) {
        res.status(400).json('User does not exist');
        return;
    }

    if (comment.userId !== userId) {
        res.status(401).json('Unauthorized');
        return;
    }

    if (commentText) {
        comment.commentText = commentText;
    }

    if (req.file) {
        comment.commentPNG = await pushImageToS3(req.file.buffer, `${comment.questionId}_${req.file.originalname}`);
    }

    comment.updatedAt = new Date();
    await commentRepository.update(comment.commentId, comment);

    res.status(200).json('Comment edited');
}

export async function deleteComments(req: Request<CommentRouteParams>, res: Response) {
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

    comment.commentText = 'Deleted';
    comment.commentPNG = 'Deleted';
    comment.isCorrect = false;
    comment.isEndorsed = false;
    comment.upvotes = 0;
    comment.downvotes = 0;
    await commentRepository.update(comment.commentId, comment);

    res.status(200).json('Comment deleted');
}

export async function correctComments(req: Request<CommentRouteParams>, res: Response) {
    const { commentId } = req.params;

    const commentRepository = getConnection().getRepository(CommentDb);
    const comment = await commentRepository.findOne({ where: { commentId } });

    if (!comment) {
        res.status(404).json('Comment not found');
        return;
    }

    comment.isCorrect = true;
    await commentRepository.update(comment.commentId, comment);

    res.status(200).json('Comment marked as correct');
}

export async function incorrectComments(req: Request<CommentRouteParams>, res: Response) {
    const { commentId } = req.params;

    const commentRepository = getConnection().getRepository(CommentDb);
    const comment = await commentRepository.findOne({ where: { commentId } });

    if (!comment) {
        res.status(404).json('Comment not found');
        return;
    }

    comment.isCorrect = false;
    await commentRepository.update(comment.commentId, comment);

    res.status(200).json('Comment marked as incorrect');
}

export async function endorseComments(req: Request<CommentRouteParams>, res: Response) {
    const { commentId } = req.params;

    const commentRepository = getConnection().getRepository(CommentDb);
    const comment = await commentRepository.findOne({ where: { commentId } });

    if (!comment) {
        res.status(404).json('Comment not found');
        return;
    }

    comment.isEndorsed = true;
    await commentRepository.update(comment.commentId, comment);

    res.status(200).json('Comment endorsed');
}

export async function unendorseComments(req: Request<CommentRouteParams>, res: Response) {
    const { commentId } = req.params;

    const commentRepository = getConnection().getRepository(CommentDb);
    const comment = await commentRepository.findOne({ where: { commentId } });

    if (!comment) {
        res.status(404).json('Comment not found');
        return;
    }

    comment.isEndorsed = false;
    await commentRepository.update(comment.commentId, comment);

    res.status(200).json('Comment removed endorsement');
}

export async function upvoteComments(req: Request<CommentRouteParams>, res: Response) {
    const { commentId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        res.status(404).json('Needs a user id');
        return;
    }

    const userRows = getConnection().getRepository(UserDb);
    const user = await userRows.findOne({ where: { userId } });

    if (!user) {
        res.status(400).json('User does not exist');
        return;
    }


    const commentRows = getConnection().getRepository(CommentDb);
    const comment = await commentRows.findOne({ where: { commentId } });

    if (!comment) {
        res.status(404).json('Comment not found');
        return;
    }

    let vote = 1;

    // check to see if has been upvoted
    if (user.upvoted.includes(+commentId)) {
        vote = -1;
        user.upvoted = user.upvoted.filter((id) => id !== +commentId);
    } else {
        user.upvoted.push(+commentId);
    }

    if (user.downvoted.includes(+commentId)) {
        comment.downvotes -= 1;
        user.downvoted = user.downvoted.filter((id) => id !== +commentId);
    }

    comment.upvotes += vote;
    await commentRows.update(comment.commentId, comment);

    await userRows.update(user.userId, user);

    res.status(200).json('Comment upvoted');
}

export async function downvoteComments(req: Request<CommentRouteParams>, res: Response) {
    const { commentId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        res.status(404).json('Needs a user id');
        return;
    }

    const userRows = getConnection().getRepository(UserDb);
    const user = await userRows.findOne({ where: { userId } });

    if (!user) {
        res.status(400).json('User does not exist');
        return;
    }

    const commentRows = getConnection().getRepository(CommentDb);
    const comment = await commentRows.findOne({ where: { commentId } });

    if (!comment) {
        res.status(404).json('Comment not found');
        return;
    }

    let vote = 1;

    // check to see if has been upvoted
    if (user.downvoted.includes(+commentId)) {
        vote = -1;
        user.downvoted = user.downvoted.filter((id) => id !== +commentId);
    } else {
        user.downvoted.push(+commentId);
    }

    if (user.upvoted.includes(+commentId)) {
        comment.upvotes -= 1;
        user.upvoted = user.upvoted.filter((id) => id !== +commentId);
    }

    comment.downvotes += vote;
    await commentRows.update(comment.commentId, comment);

    await userRows.update(user.userId, user);

    res.status(200).json('Comment downvoted');
}

export async function postComment(req: Request<any, any, CommentBodyParams>, res: Response) {
    const {
        userId,
        questionId,
        parentCommentId,
        commentText,
    } = req.body;

    // Check key
    if (!questionId || !userId) {
        res.status(400).json('Missing questionId or userId');
        return;
    }

    if (!commentText && !req.file) {
        res.status(400).json('Missing commentText or commentPNG');
        return;
    }

    const userRows = getConnection().getRepository(UserDb);
    const user = await userRows.findOne({ where: { userId } });

    if (!user) {
        res.status(400).json('User does not exist');
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
        if (parentComment.questionId !== +questionId) {
            res.status(400).json('Parent comment is not from the same question');
            return;
        }
    }
    // Query the database and get the id of the new comment
    const newComment = new CommentDb();
    newComment.userId = userId;
    newComment.questionId = +questionId;

    if (parentCommentId) {
        newComment.parentCommentId = parentCommentId;
    }

    if (commentText) {
        newComment.commentText = commentText;
    }

    if (req.file) {
        newComment.commentPNG = await pushImageToS3(req.file.buffer, `${questionId}_${req.file.originalname}`);
    }
    const savedComment = await commentRepository.save(newComment);

    res.status(201).json({ commentId: savedComment.commentId });
}

export async function getComment(req: Request<CommentRouteParams, any, any>, res: Response) {
    const { commentId } = req.params;
    const commentRepository = getConnection().getRepository(CommentDb);
    const comment = await commentRepository
        .createQueryBuilder('comment')
        .leftJoin('comment.user', 'user')
        .select('user.picture')
        .where('comment.commentId = :commentId', { commentId })
        .getOne();

    if (!comment) {
        res.status(404).json('Comment not found');
        return;
    }

    const { user: commentUser, ...restOfComment } = comment;

    res.status(200).json({ picture: commentUser.picture, ...restOfComment });
}


