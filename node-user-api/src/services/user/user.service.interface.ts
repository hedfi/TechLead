import { User, UserCreateDTO, UserUpdateDTO, UserResponseDTO } from '../../types/user.types';

/**
 * User service interface that defines business logic operations
 */
export interface IUserService {
  /**
   * Get user by ID
   */
  getUserById(id: number): Promise<UserResponseDTO | null>;
  
  /**
   * Get all users
   */
  getAllUsers(): Promise<UserResponseDTO[]>;
  
  /**
   * Create a new user
   */
  createUser(userData: UserCreateDTO): Promise<UserResponseDTO>;
  
  /**
   * Update an existing user
   */
  updateUser(id: number, userData: UserUpdateDTO): Promise<boolean>;
  
  /**
   * Change user password
   */
  changePassword(id: number, password: string): Promise<boolean>;
  
  /**
   * Delete a user
   */
  deleteUser(id: number): Promise<boolean>;
}