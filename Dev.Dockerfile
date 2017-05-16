FROM alex-milanov/alphapm

ENV NODE_ENV development
ENV NPM_CONFIG_LOGLEVEL warn
ENV PORT 8080

COPY src $HOME/src
COPY bin $HOME/bin
COPY package.json $HOME/package.json

RUN npm i

RUN pwd && ls

CMD ["npm","start"]
