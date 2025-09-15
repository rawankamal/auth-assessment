# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build both API and frontend
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /app

# Copy built apps and server.js
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./
COPY package.json ./

# Install only production dependencies
RUN npm install --omit=dev --legacy-peer-deps

EXPOSE 8080

CMD ["node", "server.js"]
