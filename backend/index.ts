/**
 * Imports
 */
import express from "express";
import { Pool } from 'pg';
import cors from 'cors';

import { routes } from './routes/index';
import * as db from './db/index';

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

//TODO
db.setupTables();

/**
 * Server Activation / Confirmation
 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
