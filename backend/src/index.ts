/**
 * Imports
 */
import express from 'express';
import cors from 'cors';

import { router } from './routes/routes';

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 8080;

// Make the app
const app = express();

/**
 *  App Configuration
 */
app.use(cors());
app.use(express.json());
app.use('/api', router);

app.use(express.urlencoded({ extended: false }));

/**
 * Server Activation / Confirmation
 */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
