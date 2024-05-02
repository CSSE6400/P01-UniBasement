// Imports
import express from 'express';

import { router } from './routes';

export const routes = express.Router();

routes.use(router);
