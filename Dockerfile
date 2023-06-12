FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install --production
COPY . .
RUN yarn build
CMD ["node", "dist/main.js"]
EXPOSE 3000
