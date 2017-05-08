# FROM node:6.2
FROM mhart/alpine-node:6
RUN apk add --no-cache python=2.7.12-r0 make gcc g++


ENV HOME=/code
ENV NODE_ENV production

COPY npm-shrinkwrap.json $HOME/

WORKDIR $HOME

RUN npm install

COPY server $HOME/
COPY dist $HOME/

EXPOSE 8080

CMD ["nodemon", "server"]
