# ───────────────────────────────────────────
#  DÉVELOPPEMENT — Vite dev server
# ───────────────────────────────────────────
FROM node:20-alpine AS dev
WORKDIR /app

COPY package*.json ./
RUN npm install

# Copie explicite des fichiers et répertoires nécessaires
COPY index.html ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY src ./src

EXPOSE 8080
CMD ["npm", "run", "dev", "--", "--host"]


# ───────────────────────────────────────────
#  BUILD — compile React en fichiers statiques
# ───────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

# Copie explicite des fichiers et répertoires nécessaires
COPY index.html ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY src ./src
RUN npm run build


# ───────────────────────────────────────────
#  PRODUCTION — Nginx sert les fichiers dist/
# ───────────────────────────────────────────
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
