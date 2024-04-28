// Imports
import { Pool } from 'pg'

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
        courseCode VARCHAR(8) PRIMARY KEY,
        courseName VARCHAR(100),
        courseDescription TEXT
    );

     CREATE TABLE IF NOT EXISTS exams (
        examId SERIAL PRIMARY KEY,
        courseCode VARCHAR(8) REFERENCES courses(courseCode),
        examYear INTEGER, 
        examSemester Integer, 
        examType VARCHAR(20)
    );
    
    CREATE TABLE IF NOT EXISTS questions (
        questionId SERIAL PRIMARY KEY,
        examId INTEGER REFERENCES exams(examID),
        questionText TEXT,
        questionPng BYTEA, 
        questionType VARCHAR(20)
    );

    CREATE TABLE IF NOT EXISTS comments (
        commentId SERIAL PRIMARY KEY,
        questionId INTEGER REFERENCES questions(questionID),
        parentCommentId INTEGER,

        commentText TEXT,
        commentPNG BYTEA, 
        
        isCorrect BOOLEAN NOT NULL DEFAULT FALSE,
        isEndorsed BOOLEAN NOT NULL DEFAULT FALSE,
        
        upvotes INTEGER NOT NULL DEFAULT 0,
        downvotes INTEGER NOT NULL DEFAULT 0,

        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`;  
    pool.query(query);
}

export const query1 = (text: any) => {
    return pool.query(text);
}

export const query = (text: any, params: any) => {
    return pool.query(text, params);
}

export const query3 = (text: any, params: any, callback: any) => {
    return pool.query(text, params, callback);
}
