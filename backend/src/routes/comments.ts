// Imports
import { Request, Response } from 'express'; // Import Request and Response types
import { CommentBodyParams, CommentRouteParams } from '../types';

import { getConnection } from '../db/index';
import { User as UserDb } from '../db/User';
import { Question as QuestionDb } from '../db/Questions';
import { Comment as CommentDb } from '../db/Comments';

export async function editComments(req: Request<CommentRouteParams, any, CommentBodyParams>, res: Response) {
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

    comment.commentText = "Deleted";
    comment.commentPNG = "Deleted";
    comment.isCorrect = false;
    comment.isEndorsed = false;
    comment.upvotes = 0;
    comment.downvotes = 0;
    commentRepository.update(comment.commentId, comment);

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
    commentRepository.update(comment.commentId, comment);

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
    commentRepository.update(comment.commentId, comment);

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
    commentRepository.update(comment.commentId, comment);

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
    commentRepository.update(comment.commentId, comment);

    res.status(200).json('Comment removed endorsement');
}

export async function upvoteComments(req: Request<CommentRouteParams>, res: Response) {
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
}

export async function downvoteComments(req: Request<CommentRouteParams>, res: Response) {
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
}

export async function postComment(req: Request<any, any, CommentBodyParams>, res: Response) {
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
}

export async function getComment(req: Request<CommentRouteParams, any, any>, res: Response) {
    const { commentId } = req.params;
    const commentRepository = getConnection().getRepository(CommentDb);
    const comment = await commentRepository.findOne({ where: { commentId } });

    if (!comment) {
        res.status(404).json('Comment not found');
        return;
    }

    res.status(200).json(comment);
}


