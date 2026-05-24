FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon
# Copie explicite des répertoires nécessaires uniquement
COPY app.js ./
COPY config ./config
COPY controllers ./controllers
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
EXPOSE 3001
CMD ["nodemon", "app.js"]

FROM node:20-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
# Copie explicite des répertoires nécessaires uniquement
COPY app.js ./
COPY config ./config
COPY controllers ./controllers
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
EXPOSE 3001
CMD ["node", "app.js"]