import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exam } from './Exam';

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    questionId: number;

    @ManyToOne(() => Exam, { nullable: false })
    @JoinColumn({
        name: 'examId',
        referencedColumnName: 'examId',
    })
    exam: Exam;

    @Column()
    examId: Exam['examId'];

    @Column('text', { nullable: true })
    questionText: string;

    @Column('text', { nullable: true })
    questionPNG: string;

    @Column({ length: 20 })
    questionType: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}

