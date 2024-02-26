FROM node:16

WORKDIR /app/

COPY package*.json /

RUN npm install prettier -g

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# Development
CMD ["node", "dist/server.js"]

# Production
# RUN npm install -g pm2
# CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]