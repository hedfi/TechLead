/**
 * User-related type definitions
 */

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreateDTO {
  name: string;
  email: string;
  password: string;
}

export interface UserUpdateDTO {
  name?: string;
  email?: string;
}

export interface PasswordChangeDTO {
  id: number;
  password: string;
}

export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}