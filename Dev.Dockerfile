FROM alex-milanov/alphapm

ENV NODE_ENV development
ENV NPM_CONFIG_LOGLEVEL warn
ENV PORT 8089

COPY . $HOME/

CMD ["npm","start"]
