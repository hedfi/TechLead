import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private notificationService: NotificationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = 'Bad Request: The server could not understand the request';
              break;
            case 401:
              errorMessage = 'Unauthorized: You need to be authenticated';
              break;
            case 403:
              errorMessage = 'Forbidden: You don\'t have permission to access this resource';
              break;
            case 404:
              errorMessage = 'Not Found: The requested resource does not exist';
              break;
            case 500:
              errorMessage = 'Internal Server Error: Something went wrong on the server';
              break;
            default:
              errorMessage = `Error ${error.status}: ${error.statusText || 'Unknown'}`;
          }
        }
        
        // Log the error
        console.error('HTTP Error:', error);
        
        // Show notification for non-401 errors (401 is handled by auth interceptor)
        if (error.status !== 401) {
          this.notificationService.showError(errorMessage);
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}