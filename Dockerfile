FROM node:20 AS react_build_base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

CMD ["node", "./dist/server.js"]
