// Imports
import { Request, Response } from 'express'; // Import Request and Response types
import { getConnection } from '../db';

export async function healthCheck(req: Request, res: Response) {
    try {
        await getConnection().query('SELECT 1');
        res.status(200).json('EVERYTHING IS A-OKAY');
    } catch (err) {
        res.status(503).json('ERROR: ' + err);
    }
}

export async function EVAN(req: Request, res: Response) {
    res.status(200).json('Evan is the best');
}

