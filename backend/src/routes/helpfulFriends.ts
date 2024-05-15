// Imports
import { Comment as IComment } from '../types';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ObjectCannedACL } from '@aws-sdk/client-s3/dist-types/models/models_0';

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

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.AWS_REGION;
// TODO: add creds here
const s3Client = new S3Client({
    region,
});

export async function pushImageToS3(file: Buffer, key: string) {
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: file,
        ACL: ObjectCannedACL.public_read,
    };

    await s3Client.send(new PutObjectCommand(params));

    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
}