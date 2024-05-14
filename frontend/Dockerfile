FROM node:latest

WORKDIR /app

COPY ./package.json /app
COPY ./package-lock.json /app
RUN npm ci

COPY ./next.config.mjs .
COPY ./postcss.config.js .
COPY ./postcss.config.mjs .
COPY ./tailwind.config.ts .
COPY ./tsconfig.json .
COPY ./typography.ts .
COPY ./src ./src
COPY ./public ./public
COPY ./.env.local .
CMD ["npm", "run", "dev"]
