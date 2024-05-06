import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Course {
    @PrimaryColumn({ length: 8 })
    courseCode: string;

    @Column({ length: 100 })
    courseName: string;

    @Column('text', { nullable: true })
    courseDescription: string;

    @Column({ length: 100 })
    university: string;

    @Column({ default: 0 })
    stars: number;

    @Column({ default: 0 })
    votes: number;
}

