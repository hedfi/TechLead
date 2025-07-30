import bcrypt from 'bcryptjs';
import { IUserService } from './user.service.interface';
import { IUserRepository } from '../../repositories/user/user.repository.interface';
import { User, UserCreateDTO, UserUpdateDTO, UserResponseDTO } from '../../types/user.types';
import { logger } from '../../config/logger.config';

/**
 * User service implementation
 */
export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}
  
  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<UserResponseDTO | null> {
    try {
      const user = await this.userRepository.findById(id);
      return user ? this.mapUserToResponseDTO(user) : null;
    } catch (error) {
      logger.error('Error in getUserById service', { error, userId: id });
      throw error;
    }
  }
  
  /**
   * Get all users
   */
  async getAllUsers(): Promise<UserResponseDTO[]> {
    try {
      const users = await this.userRepository.findAll();
      return users.map(user => this.mapUserToResponseDTO(user));
    } catch (error) {
      logger.error('Error in getAllUsers service', { error });
      throw error;
    }
  }
  
  /**
   * Create a new user
   */
  async createUser(userData: UserCreateDTO): Promise<UserResponseDTO> {
    try {
      // Check if user with email already exists
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Hash password
      const hashedPassword = await this.hashPassword(userData.password);
      
      // Create user
      const newUser = await this.userRepository.create({
        ...userData,
        password: hashedPassword
      });
      
      return this.mapUserToResponseDTO(newUser);
    } catch (error) {
      logger.error('Error in createUser service', { error, email: userData.email });
      throw error;
    }
  }
  
  /**
   * Update an existing user
   */
  async updateUser(id: number, userData: UserUpdateDTO): Promise<boolean> {
    try {
      // Check if user exists
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }
      
      // If email is being updated, check if it's already in use
      if (userData.email && userData.email !== existingUser.email) {
        const userWithEmail = await this.userRepository.findByEmail(userData.email);
        if (userWithEmail) {
          throw new Error('Email is already in use');
        }
      }
      
      // Update user
      return await this.userRepository.update(id, userData);
    } catch (error) {
      logger.error('Error in updateUser service', { error, userId: id });
      throw error;
    }
  }
  
  /**
   * Change user password
   */
  async changePassword(id: number, password: string): Promise<boolean> {
    try {
      // Check if user exists
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }
      
      // Hash new password
      const hashedPassword = await this.hashPassword(password);
      
      // Update password
      return await this.userRepository.changePassword(id, hashedPassword);
    } catch (error) {
      logger.error('Error in changePassword service', { error, userId: id });
      throw error;
    }
  }
  
  /**
   * Delete a user
   */
  async deleteUser(id: number): Promise<boolean> {
    try {
      // Check if user exists
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }
      
      // Delete user
      return await this.userRepository.delete(id);
    } catch (error) {
      logger.error('Error in deleteUser service', { error, userId: id });
      throw error;
    }
  }
  
  /**
   * Hash password
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
  
  /**
   * Map User entity to UserResponseDTO
   */
  private mapUserToResponseDTO(user: User): UserResponseDTO {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserResponseDTO;
  }
}