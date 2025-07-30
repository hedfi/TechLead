export interface User {
  id: number;
  name: string;
  email: string;
  // Add other user properties as needed
}

export interface PasswordChangeRequest {
  id: number;
  password: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
  error?: string;
}