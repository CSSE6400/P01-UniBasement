/**
 * Imports
 */
import express from "express";
import cors from 'cors';

import { createConnection, Connection } from 'typeorm';
import { User } from './db/User';
import { Course } from './db/Course';
import { Exam } from './db/Exam';
import { Question } from './db/Questions';
import { Comment as com} from './db/Comments';
import * as db from './db';

import { routes } from './routes';

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 8080;

// Make the app
const app = express();

/**
 *  App Configuration
 */
app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.use(express.urlencoded({ extended: false }));

/**
 * Database Connection
 */
export const connectDatabase = async () => {
  connection = await createConnection({
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [User, Course, Exam, Question, Com],
  }).then(connection => {
    console.log('Connected to the database');
  }).catch(error => console.log(error));
};

export const getConnection = () => connection;

/**
 * Server Activation / Confirmation
 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
