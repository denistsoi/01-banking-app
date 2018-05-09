FROM mhart/alpine-node:8

RUN apk upgrade -U \
 && rm -rf /var/cache/*

WORKDIR /usr/
COPY package.json .
RUN npm install

COPY . .

RUN mkdir .data && cd .data && mkdir lowdb


EXPOSE 80
CMD ["npm", "start"]