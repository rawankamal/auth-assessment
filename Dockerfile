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

# Verify build output
RUN ls -la apps/dist/
RUN ls -la apps/dist/api/
RUN ls -la apps/dist/apps/frontend/

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --legacy-peer-deps && npm cache clean --force

# Copy built apps from builder
COPY --from=builder /app/apps/dist ./apps/dist

# Verify the copy worked
RUN ls -la apps/dist/
RUN ls -la apps/dist/api/
RUN test -f apps/dist/api/main.js || (echo "main.js not found!" && exit 1)

# Cloud Run expects the container to listen on 0.0.0.0:$PORT
ENV NODE_ENV=production
ENV PORT=8080

# Expose port (documentation only for Cloud Run)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/api || exit 1

# Start the server
CMD ["node", "apps/dist/api/main.js"]
