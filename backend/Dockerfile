FROM node:latest

WORKDIR /app

COPY ./package.json /app
COPY ./package-lock.json /app
RUN npm ci

COPY ./index.ts .
COPY ./db ./db
COPY ./routes ./routes

CMD ["npm", "run", "start"]
