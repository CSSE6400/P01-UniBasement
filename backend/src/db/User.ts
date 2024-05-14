import { Column, Entity, PrimaryColumn } from 'typeorm';
import { RateObject } from '../types';

@Entity()
export class User {
    @PrimaryColumn()
    userId: string;

    @Column({ default: 0 })
    role: number;

    @Column({ type: 'jsonb', default: [] })
    rated: RateObject[];

    @Column({ type: 'int', array: true, default: [] })
    upvoted: number[];

    @Column({ type: 'int', array: true, default: [] })
    downvoted: number[];
}

