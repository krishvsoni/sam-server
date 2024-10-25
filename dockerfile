FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV $(cat .env)


EXPOSE 8083

CMD ["npm", "start"]
