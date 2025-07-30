import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { IUserRepository } from './user.repository.interface';
import { User } from '../../types/user.types';
import { logger } from '../../config/logger.config';

/**
 * MySQL implementation of the user repository
 */
export class UserRepository implements IUserRepository {
  constructor(private readonly pool: Pool) {}
  
  /**
   * Find user by ID
   */
  async findById(id: number): Promise<User | null> {
    try {
      const [rows] = await this.pool.execute<RowDataPacket[]>(
        'SELECT id, name, email, created_at as createdAt, updated_at as updatedAt FROM users WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? this.mapRowToUser(rows[0]) : null;
    } catch (error) {
      logger.error('Error finding user by ID', { error, userId: id });
      throw error;
    }
  }
  
  /**
   * Find all users
   */
  async findAll(): Promise<User[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        'SELECT id, name, email, created_at as createdAt, updated_at as updatedAt FROM users'
      );
      
      return rows.map(row => this.mapRowToUser(row));
    } catch (error) {
      logger.error('Error finding all users', { error });
      throw error;
    }
  }
  
  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const [rows] = await this.pool.execute<RowDataPacket[]>(
        'SELECT id, name, email, created_at as createdAt, updated_at as updatedAt FROM users WHERE email = ?',
        [email]
      );
      
      return rows.length > 0 ? this.mapRowToUser(rows[0]) : null;
    } catch (error) {
      logger.error('Error finding user by email', { error, email });
      throw error;
    }
  }
  
  /**
   * Create a new user
   */
  async create(data: Partial<User>): Promise<User> {
    try {
      const { name, email, password } = data;
      
      const [result] = await this.pool.execute<ResultSetHeader>(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
      );
      
      const newUser: User = {
        id: result.insertId,
        name: name as string,
        email: email as string
      };
      
      return newUser;
    } catch (error) {
      logger.error('Error creating user', { error, userData: data });
      throw error;
    }
  }
  
  /**
   * Update an existing user
   */
  async update(id: number, data: Partial<User>): Promise<boolean> {
    try {
      const { name, email } = data;
      
      const [result] = await this.pool.execute<ResultSetHeader>(
        'UPDATE users SET name = ?, email = ?, updated_at = NOW() WHERE id = ?',
        [name, email, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      logger.error('Error updating user', { error, userId: id, userData: data });
      throw error;
    }
  }
  
  /**
   * Change user password
   */
  async changePassword(id: number, password: string): Promise<boolean> {
    try {
      const [result] = await this.pool.execute<ResultSetHeader>(
        'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
        [password, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      logger.error('Error changing user password', { error, userId: id });
      throw error;
    }
  }
  
  /**
   * Delete a user
   */
  async delete(id: number): Promise<boolean> {
    try {
      const [result] = await this.pool.execute<ResultSetHeader>(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      logger.error('Error deleting user', { error, userId: id });
      throw error;
    }
  }
  
  /**
   * Map database row to User object
   */
  private mapRowToUser(row: RowDataPacket): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined
    };
  }
}