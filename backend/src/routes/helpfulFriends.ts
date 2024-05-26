// Imports
import { Comment as IComment } from '../types';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { fromContainerMetadata } from '@aws-sdk/credential-providers';

// Helper functions

// function to nest comments into their parent comments
export function nest(commentRows: IComment[]) {
    const dataDict: { [id: number]: IComment } = {};
    commentRows.forEach(item => dataDict[item.commentId] = item);

    commentRows.forEach(item => {
        if (item.parentCommentId !== null) {
            const parent = dataDict[item.parentCommentId];
            if (!parent) {
                // parent comment not in results for some reason
                return;
            }
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
const bucketUrl = process.env.S3_BUCKET_URL;
const region = process.env.AWS_REGION;
const s3Client = new S3Client({
    region,
    credentials: fromContainerMetadata(),
});

export async function pushImageToS3(file: Buffer, key: string) {
    if (!bucketName) return 'image not uploaded';

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: file,
    };

    await s3Client.send(new PutObjectCommand(params));

    return `https://${bucketUrl}/${key}`;
}