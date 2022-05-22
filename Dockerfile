FROM node:alpine

RUN mkdir -p /usr/src/app
ENV PORT 8003

WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm ci

COPY . /usr/src/app

RUN npm run build

EXPOSE 8003
CMD [ "npm", "start" ]