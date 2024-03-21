FROM --platform=linux/amd64 node:lts-alpine3.19

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY nodemon.json ./

RUN npm install -g pnpm

RUN pnpm install


# RUN mkdir ./src

COPY tsconfig.json ./

COPY server.ts ./


COPY lib ./lib


# build

RUN pnpm build

EXPOSE 3005

CMD [ "pnpm", "start" ]
