import { handleAuth, handleCallback, Session } from '@auth0/nextjs-auth0';
import { NextApiRequest } from 'next';

const afterCallback = async (
    req: NextApiRequest,
    session: Session,
) => {
    // add the user to our database
    await fetch(`${process.env.API_URL}/api/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session.user.sub }),
    });
    return session;
};

export const GET = handleAuth({
    // @ts-ignore
    callback: handleCallback({ afterCallback })
});