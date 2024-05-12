import { DataSource } from 'typeorm';

import { User } from './User';
import { Course } from './Course';
import { Exam } from './Exam';
import { Question } from './Questions';
import { Comment as Com } from './Comments';

const BackendDataSource = new DataSource({
  type: process.env.DB_TYPE as 'postgres',
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, Course, Exam, Question, Com],
})

BackendDataSource.initialize()
    .then(() => {
      console.log('Connected to the database');
    })
    .catch((err) => {
      console.log(err);
    });

export const getConnection = () => BackendDataSource;
