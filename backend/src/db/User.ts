import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column({ default: 0 })
    role: number;

    @Column({ type: 'jsonb', default: {} })
    rated: object;

    @Column({ type: 'simple-array', default: [] })
    upvoted: number[];

    @Column({ type: 'simple-array', default: [] })
    downvoted: number[];
}

