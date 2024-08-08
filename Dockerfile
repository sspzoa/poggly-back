FROM node:alpine

WORKDIR /usr/app
COPY ./ /usr/app

ARG DATABASE_URL
ARG SECRET_KEY

ENV DATABASE_URL=${DATABASE_URL}
ENV SECRET_KEY=${SECRET_KEY}

RUN yarn install

CMD ["yarn", "start"]