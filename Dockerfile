FROM node:12.19.0-slim

RUN mkdir /opt/app

WORKDIR /opt/app

ENV NODE_ENV=production

COPY package.json /opt/app/package.json
RUN yarn

COPY . /opt/app

RUN yarn build

EXPOSE 3071
CMD ["yarn", "prod"]
