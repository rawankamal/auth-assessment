# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build both applications (Nx + Angular)
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy only production package.json (dependencies فقط)
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --legacy-peer-deps && npm cache clean --force

# Copy built apps from builder
COPY --from=builder /app/apps/dist ./apps/dist
COPY --from=builder /app/server.js ./

# Expose Cloud Run default port
ENV PORT=8080
EXPOSE 8080

# Start server
CMD ["node", "server.js"]
