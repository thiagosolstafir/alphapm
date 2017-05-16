# FROM node:6.2
# FROM mhart/alpine-node:6
FROM larslarsson/alpine-node-sass

ENV HOME=/code
ENV NODE_ENV production

COPY npm-shrinkwrap.json $HOME/

WORKDIR $HOME

RUN npm install

COPY server $HOME/server
COPY dist $HOME/dist

EXPOSE 8080

CMD ["nodemon", "server"]
