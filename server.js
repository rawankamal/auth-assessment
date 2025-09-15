const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Health check endpoint (required for GCP)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    paths: {
      frontend: path.join(__dirname, 'apps/dist/apps/frontend'),
      api: path.join(__dirname, 'apps/dist/api/main.js'),
    },
  });
});

// Initialize NestJS API
let nestApp = null;

async function initializeNestJS() {
  try {
    const apiPath = path.join(__dirname, 'apps/dist/api/main.js');
    console.log(`Loading NestJS API from: ${apiPath}`);

    // Check if the API build exists
    const fs = require('fs');
    if (!fs.existsSync(apiPath)) {
      throw new Error(`API build not found at: ${apiPath}`);
    }

    // Import NestJS modules
    const { NestFactory } = require('@nestjs/core');

    // Import the built AppModule
    const { AppModule } = require('./apps/dist/api/main.js');

    // Create NestJS application
    nestApp = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug'],
    });

    // Configure CORS
    nestApp.enableCors({
      origin: true,
      credentials: true,
    });

    // Set global API prefix
    nestApp.setGlobalPrefix('api');

    // Get the underlying Express app from NestJS
    const nestExpressApp = nestApp.getHttpAdapter().getInstance();

    // Mount NestJS routes under /api
    app.use('/api', nestExpressApp);

    console.log('✅ NestJS API integrated successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize NestJS:', error.message);

    // Fallback API routes
    app.get('/api', (req, res) => {
      res.json({
        message: 'API is running in fallback mode',
        timestamp: new Date().toISOString(),
        error: 'NestJS initialization failed',
      });
    });

    app.use('/api/*', (req, res) => {
      res.status(503).json({
        error: 'API service unavailable',
        message: 'NestJS failed to initialize',
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
      });
    });

    return false;
  }
}

// Serve Angular static files
const frontendPath = path.join(__dirname, 'apps/dist/apps/frontend');
console.log(`📁 Frontend path: ${frontendPath}`);

// Check if frontend build exists
const fs = require('fs');
if (fs.existsSync(frontendPath)) {
  app.use(
    express.static(frontendPath, {
      maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
      etag: false,
      index: false, // Don't serve index.html automatically - we'll handle SPA routing
    })
  );
  console.log('✅ Frontend static files configured');
} else {
  console.warn('⚠️ Frontend build not found at:', frontendPath);
}

// Angular SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html'); // ✅ مش من الـ API
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend build not found');
  }
});


// Global error handling
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message:
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'Something went wrong',
    timestamp: new Date().toISOString(),
  });
});

// Start the server
async function startServer() {
  const PORT = process.env.PORT || 8080;
  const HOST = '0.0.0.0'; // لازم Cloud Run يقدر يربط

  app.listen(PORT, HOST, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
  });

  console.log('🚀 Initializing server...');
  console.log(`📊 Node.js version: ${process.version}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

  // Initialize NestJS first
  const nestInitialized = await initializeNestJS();

  // Start Express server
  const server = app.listen(PORT, HOST, () => {
    console.log(`✅ Server running on ${HOST}:${PORT}`);
    console.log(`📁 Frontend: ${frontendPath}`);
    console.log(
      `🔌 API Status: ${nestInitialized ? 'Integrated' : 'Fallback mode'}`
    );
    console.log(
      `💾 Memory: ${Math.round(
        process.memoryUsage().heapUsed / 1024 / 1024
      )} MB`
    );
    console.log('=====================================');
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);

    server.close(() => {
      console.log('✅ Express server closed');

      if (nestApp) {
        nestApp
          .close()
          .then(() => {
            console.log('✅ NestJS app closed');
            process.exit(0);
          })
          .catch(() => {
            process.exit(1);
          });
      } else {
        process.exit(0);
      }
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

// Start the application
startServer().catch((error) => {
  console.error('💥 Failed to start server:', error);
  process.exit(1);
});

module.exports = app;
