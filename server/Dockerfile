FROM --platform=linux/amd64 node:lts-alpine3.19

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY pnpm-lock.yaml ./


RUN npm install -g pnpm

RUN pnpm install

COPY tsconfig.json ./

RUN mkdir ./src

COPY server.ts ./src/
# build

RUN pnpm build

EXPOSE 3005

CMD [ "pnpm", "start" ]
