# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build both applications
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --legacy-peer-deps && npm cache clean --force

# Copy built applications from builder stage
# Note: Nx builds to dist/apps/* not apps/dist/*
COPY --from=builder /app/dist ./dist

# Copy any additional files needed at runtime
COPY --from=builder /app/nx.json ./nx.json

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start the NestJS application
CMD ["node", "apps/dist/apps/api/main.js"]
