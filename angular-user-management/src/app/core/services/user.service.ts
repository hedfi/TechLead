import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User, PasswordChangeRequest, ApiResponse } from '../models/user.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}
  
  /**
   * Get user by ID
   */
  getUser(id: number): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/user/${id}`)
      .pipe(
        map(response => {
          if (!response.data) {
            throw new Error('User data not found');
          }
          return response.data;
        }),
        catchError(this.handleError)
      );
  }
  
  /**
   * Update user information
   */
  updateUser(user: User): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/user/${user.id}`, user)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  /**
   * Change user password
   */
  changePassword(request: PasswordChangeRequest): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/user/change-password`, request)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}