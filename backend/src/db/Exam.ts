import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Course } from './Course';

@Entity()
export class Exam {
    @PrimaryGeneratedColumn()
    examId: number;

    @ManyToOne(() => Course, course => course.courseCode)
    course: Course;

    @Column()
    examYear: number;

    @Column()
    examSemester: number;

    @Column({ length: 20 })
    examType: string;
}

