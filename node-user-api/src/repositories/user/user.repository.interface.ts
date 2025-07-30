import { IBaseRepository } from '../base/base.repository.interface';
import { User } from '../../types/user.types';

/**
 * User repository interface that extends the base repository
 * and adds user-specific operations
 */
export interface IUserRepository extends IBaseRepository<User, number> {
  /**
   * Find user by email
   */
  findByEmail(email: string): Promise<User | null>;
  
  /**
   * Change user password
   */
  changePassword(id: number, password: string): Promise<boolean>;
}