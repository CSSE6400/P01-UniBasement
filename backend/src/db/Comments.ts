import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './Questions';
import { User } from './User';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    commentId: number;

    @ManyToOne(() => Question, { nullable: false })
    @JoinColumn({
        name: 'questionId',
        referencedColumnName: 'questionId',
    })
    question: Question;

    @Column()
    questionId: Question['questionId'];

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'userId',
    })
    user: User;

    @Column()
    userId: User['userId'];

    @Column({ nullable: true })
    parentCommentId: number;

    @Column('text', { nullable: true })
    commentText: string;

    @Column('text', { nullable: true })
    commentPNG: string | null;

    @Column({ default: false })
    isCorrect: boolean;

    @Column({ default: false })
    isDeleted: boolean;

    @Column({ default: 0 })
    upvotes: number;

    @Column({ default: 0 })
    downvotes: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}

