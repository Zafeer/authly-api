FROM node:20.18.0-alpine

RUN apk add --no-cache bash
RUN npm i -g @nestjs/cli typescript ts-node

COPY package*.json /tmp/app/
RUN cd /tmp/app && npm install

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app

WORKDIR /usr/src/app
RUN if [ ! -f .env ]; then cp env-example-relational .env; fi
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]