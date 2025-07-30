import { Request, Response } from 'express';
import { IUserService } from '../../services/user/user.service.interface';
import { UserCreateDTO, UserUpdateDTO } from '../../types/user.types';
import { logger } from '../../config/logger.config';

/**
 * User controller that handles HTTP requests
 */
export class UserController {
  constructor(private readonly userService: IUserService) {}
  
  /**
   * Get user by ID
   */
  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id, 10);
      
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }
      
      const user = await this.userService.getUserById(userId);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.json(user);
    } catch (error) {
      logger.error('Error in getUserById controller', { error, userId: req.params.id });
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  /**
   * Get all users
   */
  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      logger.error('Error in getAllUsers controller', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  /**
   * Create a new user
   */
  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: UserCreateDTO = req.body;
      
      // Validate required fields
      if (!userData.name || !userData.email || !userData.password) {
        res.status(400).json({ error: 'Name, email, and password are required' });
        return;
      }
      
      const newUser = await this.userService.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      logger.error('Error in createUser controller', { error });
      
      if (error instanceof Error && error.message === 'User with this email already exists') {
        res.status(409).json({ error: error.message });
        return;
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  /**
   * Update an existing user
   */
  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id, 10);
      const userData: UserUpdateDTO = req.body;
      
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }
      
      // Validate that at least one field is provided
      if (!userData.name && !userData.email) {
        res.status(400).json({ error: 'At least one field (name or email) must be provided' });
        return;
      }
      
      const success = await this.userService.updateUser(userId, userData);
      
      if (!success) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.json({ message: 'User updated successfully' });
    } catch (error) {
      logger.error('Error in updateUser controller', { error, userId: req.params.id });
      
      if (error instanceof Error && error.message === 'Email is already in use') {
        res.status(409).json({ error: error.message });
        return;
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  /**
   * Change user password
   */
  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, password } = req.body;
      
      if (!id || !password) {
        res.status(400).json({ error: 'User ID and password are required' });
        return;
      }
      
      const userId = parseInt(id.toString(), 10);
      
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }
      
      const success = await this.userService.changePassword(userId, password);
      
      if (!success) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      logger.error('Error in changePassword controller', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  /**
   * Delete a user
   */
  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id, 10);
      
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }
      
      const success = await this.userService.deleteUser(userId);
      
      if (!success) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      logger.error('Error in deleteUser controller', { error, userId: req.params.id });
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}