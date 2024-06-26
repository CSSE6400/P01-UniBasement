// Imports
import { Request, Response } from 'express'; // Import Request and Response types
import { getConnection } from '../db';
import { User as UserDb } from '../db/User';

export async function postUser(req: Request, res: Response) {
    const { userId, picture } = req.body;

    if (!userId) {
        res.status(400).json('Missing userId');
        return;
    }

    const userRepository = getConnection().getRepository(UserDb);

    // Check for user
    const user = await userRepository.findOne({ where: { userId } });

    if (user) {
        res.status(409).json('User already exists');
        return;
    }

    // Add user
    const newUser = new UserDb();
    newUser.userId = userId;
    newUser.picture = picture;
    await userRepository.save(newUser);

    res.status(201).json('User Added');
}

export async function getUserRole(req: Request, res: Response) {
    const { userId } = req.params;

    if (!userId) {
        res.status(400).json('Missing userId');
        return;
    }

    const userRepository = getConnection().getRepository(UserDb);

    // Check for user
    const user = await userRepository.findOne({ where: { userId } });

    if (!user) {
        res.status(404).json('User not found');
        return;
    }

    res.status(200).json(user.role);
}