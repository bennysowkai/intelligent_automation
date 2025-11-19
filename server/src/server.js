import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import onboardingRoutes from './routes/onboarding.js';
import surveyRoutes from './routes/surveys.js';
import docTaskRoutes from './routes/docTasks.js';
import workItemRoutes from './routes/workItems.js';
import governanceRoutes from './routes/governance.js';
import sharepointRoutes from './routes/sharepoint.js';
import summaryRoutes from './routes/summary.js';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/onboarding-tasks', onboardingRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/doc-tasks', docTaskRoutes);
app.use('/api/work-items', workItemRoutes);
app.use('/api/governance-checks', governanceRoutes);
app.use('/api/sharepoint-migration', sharepointRoutes);
app.use('/api/summary', summaryRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Intelligent Automation Hub - Server Started');
  console.log('='.repeat(50));
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  console.log('='.repeat(50));
  console.log('Available endpoints:');
  console.log(`  GET  /health - Health check`);
  console.log(`  POST /api/auth/login - User login`);
  console.log(`  GET  /api/summary - Dashboard summary`);
  console.log(`  *    /api/onboarding-tasks - Onboarding tasks CRUD`);
  console.log(`  *    /api/surveys - Satisfaction surveys CRUD`);
  console.log(`  *    /api/doc-tasks - Documentation tasks CRUD`);
  console.log(`  *    /api/work-items - Work items CRUD`);
  console.log(`  *    /api/governance-checks - Governance checks CRUD`);
  console.log(`  *    /api/sharepoint-migration - SharePoint mock API`);
  console.log('='.repeat(50));
});

export default app;
