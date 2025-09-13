# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-alpine

WORKDIR /usr/src/app

# نسخ الـ backend
COPY --from=build /usr/src/app/dist/apps/api ./dist/apps/api

# نسخ الـ frontend جوه فولدر public عشان NestJS يقدمه
COPY --from=build /usr/src/app/dist/apps/auth-assessment ./dist/apps/api/public

COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

EXPOSE 3000
CMD ["node", "dist/apps/api/main.js"]
