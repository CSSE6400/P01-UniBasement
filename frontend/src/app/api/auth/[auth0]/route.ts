import { handleAuth, handleCallback, Session } from '@auth0/nextjs-auth0';
import { NextApiRequest } from 'next';

const afterCallback = async (
    req: NextApiRequest,
    session: Session,
) => {
    console.log('in da callback');
    console.log(`user id: ${session.user.sub}, api url: ${process.env.API_URL}`);
    try { 
      // add the user to our database
      await fetch(`${process.env.API_URL}/api/users`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: session.user.sub }),
      });
      console.log('user added to database');
    } catch (e) {
      console.log('error adding user to database', e);
    }
   
    return session;
};

export const GET = handleAuth({
    // @ts-ignore
    callback: handleCallback({ afterCallback })
});