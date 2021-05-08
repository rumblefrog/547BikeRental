FROM node:alpine

RUN apk --update add tzdata \
   && cp /usr/share/zoneinfo/America/New_York /etc/localtime \
   && echo "America/New_York" > /etc/timezone \
   && apk del tzdata

WORKDIR /usr/src/app

COPY package.json .
RUN yarn

ADD . /usr/src/app
RUN yarn compile

CMD [ "yarn", "start" ]
EXPOSE 3000
