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

# Verify the actual build structure
RUN echo "=== Build verification ===" && \
  echo "apps/dist structure:" && \
  ls -la apps/dist/ || echo "apps/dist not found" && \
  echo "apps/dist/api:" && \
  ls -la apps/dist/api/ || echo "apps/dist/api not found" && \
  echo "apps/dist/apps:" && \
  ls -la apps/dist/apps/ || echo "apps/dist/apps not found" && \
  echo "apps/dist/apps/frontend:" && \
  ls -la apps/dist/apps/frontend/ || echo "apps/dist/apps/frontend not found"

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy only production package.json (dependencies)
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --legacy-peer-deps && npm cache clean --force


# Copy built applications from builder stage
COPY --from=builder /app/apps/dist ./apps/dist

# Copy server.js
COPY --from=builder /app/server.js ./

# Verify the copied structure
RUN echo "=== Production verification ===" && \
  echo "Copied structure:" && \
  ls -la apps/dist/ && \
  echo "API build:" && \
  ls -la apps/dist/api/ && \
  echo "Frontend build:" && \
  ls -la apps/dist/apps/frontend/ && \
  echo "server.js:" && \
  ls -la server.js

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["node", "server.js"]
