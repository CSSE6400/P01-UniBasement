import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exam } from './Exam';

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    questionId: number;

    @ManyToOne(() => Exam, exam => exam.examId)
    examId: Exam['examId'];

    @Column('text', { nullable: true })
    questionText: string;

    @Column('text', { nullable: true })
    questionPNG: string;

    @Column({ length: 20 })
    questionType: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}

