// Imports
import { Pool, QueryResultRow } from 'pg';

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export const setupTables = () => {
     const query = `
     CREATE TABLE IF NOT EXISTS courses (
        "courseCode" VARCHAR(8) PRIMARY KEY,
        "courseName" VARCHAR(100),
        "courseDescription" TEXT
    );

     CREATE TABLE IF NOT EXISTS exams (
        "examId" SERIAL PRIMARY KEY,
        "courseCode" VARCHAR(8) REFERENCES courses("courseCode"),
        "examYear" INTEGER, 
        "examSemester" Integer, 
        "examType" VARCHAR(20)
    );
    
    CREATE TABLE IF NOT EXISTS questions (
        "questionId" SERIAL PRIMARY KEY,
        "examId" INTEGER REFERENCES exams("examId"),
        "questionText" TEXT,
        "questionPNG" BYTEA, 
        "questionType" VARCHAR(20)
    );

    CREATE TABLE IF NOT EXISTS comments (
        "commentId" SERIAL PRIMARY KEY,
        "questionId" INTEGER REFERENCES questions("questionId"),
        "parentCommentId" INTEGER,

        "commentText" TEXT,
        "commentPNG" BYTEA, 
        "isCorrect" BOOLEAN DEFAULT FALSE,
        "isEndorsed" BOOLEAN DEFAULT FALSE,
        "upvotes" INTEGER DEFAULT 0,
        "downvotes" INTEGER DEFAULT 0,

        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
    );`;  
    pool.query(query);
}

export function query1<Result extends QueryResultRow>(text: any) {
    return pool.query<Result>(text);
}

export function query<Result extends QueryResultRow>(text: any, params: any) {
    return pool.query<Result>(text, params);
}

export function query3<Result extends QueryResultRow>(text: any, params: any, callback: any) {
    return pool.query<Result>(text, params, callback);
}