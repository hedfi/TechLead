import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import userRoutes from './routes/user.routes';
import { logger } from './config/logger.config';

/**
 * Express application setup
 */
export const createApp = (): Application => {
  const app: Application = express();
  
  // Middleware
  app.use(helmet()); // Security headers
  app.use(cors()); // CORS support
  app.use(express.json()); // Parse JSON bodies
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } })); // HTTP request logging
  
  // Routes
  app.use('/api/users', userRoutes);
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  
  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Unhandled error', { error: err });
    res.status(500).json({ error: 'Internal server error' });
  });
  
  return app;
};