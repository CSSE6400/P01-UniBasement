import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Question } from './Question';
import { User } from './User';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    commentId: number;

    @ManyToOne(() => Question, question => question.questionId)
    questionId: Question.questionId;

    @ManyToOne(() => User, user => user.userId)
    userId: User.userId;

    @Column({ nullable: true })
    parentCommentId: number;

    @Column('text', { nullable: true })
    commentText: string;

    @Column('text', { nullable: true })
    commentPNG: string;

    @Column({ default: false })
    isCorrect: boolean;

    @Column({ default: false })
    isEndorsed: boolean;

    @Column({ default: 0 })
    upvotes: number;

    @Column({ default: 0 })
    downvotes: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}

