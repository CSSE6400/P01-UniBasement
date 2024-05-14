'use client';
const ENDPOINT = `${process.env.API_URL}/api`;

export default async function useUser(userId: string) {

    // send the rating
    const res = await fetch(`${ENDPOINT}/users/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });

    if (res.ok) {
        // // rating successful, invalidate the course cache so it refetches updated data
        // await mutate(ENDPOINT + '/courses/' + courseCode);
    }
}