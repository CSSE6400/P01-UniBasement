import { Entity, PrimaryColumn, Column } from 'typeorm';
import { RateObject } from '../types';

@Entity()
export class User {
    @PrimaryColumn()
    userId: string;

    @Column({ default: 0 })
    role: number;

    @Column({ type: 'jsonb', default: [] })
    rated: RateObject[];

    @Column({ type: 'simple-array', default: [] })
    upvoted: number[];

    @Column({ type: 'simple-array', default: [] })
    downvoted: number[];
}

