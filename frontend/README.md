# UniBasement Frontend

The frontend is powered by Next.js and uses Tailwind CSS for styling.

## Setting Up the Development Server
The frontend requires environment variables to be setup for Auth0 and the backend api.  
Copy the provided `.env-example` file to a new file called `.env.local` and fill in the required values. For more info on setting up an Auth0 tenant for Next.js see the [Auth0 Docs](https://auth0.com/docs/quickstart/webapp/nextjs/interactive)


Make sure all the below commands are run from the `frontend` directory.  


First install the npm dependencies:
```bash
npm install
```

Next, run the development server:
```bash
npm run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.
