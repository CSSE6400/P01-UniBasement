import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from './Course';

@Entity()
export class Exam {
    @PrimaryGeneratedColumn()
    examId: number;

    @ManyToOne(() => Course, { nullable: false })
    @JoinColumn({
        name: 'courseCode',
        referencedColumnName: 'courseCode',
    })
    course: Course;

    @Column()
    courseCode: Course['courseCode'];

    @Column()
    examYear: number;

    @Column()
    examSemester: number;

    @Column({ length: 20 })
    examType: string;
}

