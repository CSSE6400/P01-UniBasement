import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from './Course';

@Entity()
export class Exam {
    @PrimaryGeneratedColumn()
    examId: number;

    @ManyToOne(() => Course, course => course.courseCode)
    courseCode: Course['courseCode'];

    @Column()
    examYear: number;

    @Column()
    examSemester: number;

    @Column({ length: 20 })
    examType: string;
}

