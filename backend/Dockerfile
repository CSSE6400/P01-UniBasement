FROM node:latest

WORKDIR /app

COPY ./package.json /app
COPY ./package-lock.json /app
COPY ./tsconfig.json /app
RUN npm ci

COPY ./src ./src

CMD ["npm", "run", "start"]
