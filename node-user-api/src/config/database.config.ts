import mysql from 'mysql2/promise';
import { logger } from './logger.config';

/**
 * Database configuration interface
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
}

/**
 * Get database configuration from environment variables
 */
export const getDatabaseConfig = (): DatabaseConfig => {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'user_management',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10)
  };
};

/**
 * Create database connection pool
 */
export const createConnectionPool = async () => {
  try {
    const config = getDatabaseConfig();
    const pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      connectionLimit: config.connectionLimit,
      waitForConnections: true,
      queueLimit: 0
    });
    
    // Test connection
    const connection = await pool.getConnection();
    connection.release();
    
    logger.info('Database connection established successfully');
    return pool;
  } catch (error) {
    logger.error('Failed to create database connection pool', { error });
    throw error;
  }
};