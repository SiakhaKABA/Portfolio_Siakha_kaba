FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon
# Copie récursive contrôlée - exclusions gérées par .dockerignore
COPY . .
EXPOSE 3001
CMD ["nodemon", "app.js"]

FROM node:20-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
# Copie récursive contrôlée - exclusions gérées par .dockerignore
COPY . .
EXPOSE 3001
CMD ["node", "app.js"]