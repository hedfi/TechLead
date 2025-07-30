import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning'
}

export interface Notification {
  message: string;
  type: NotificationType;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  private defaultDuration = 5000; // 5 seconds
  
  /**
   * Get notifications as an observable
   */
  get notifications(): Observable<Notification> {
    return this.notificationSubject.asObservable();
  }
  
  /**
   * Show a success notification
   */
  showSuccess(message: string, duration: number = 3000): void {
    this.showNotification({
      message,
      type: NotificationType.SUCCESS,
      duration
    });
  }
  
  /**
   * Show an error notification
   */
  showError(message: string, duration: number = 5000): void {
    this.showNotification({
      message,
      type: NotificationType.ERROR,
      duration
    });
  }
  
  /**
   * Show an info notification
   */
  showInfo(message: string, duration: number = 3000): void {
    this.showNotification({
      message,
      type: NotificationType.INFO,
      duration
    });
  }
  
  /**
   * Show a warning notification
   */
  showWarning(message: string, duration: number = 4000): void {
    this.showNotification({
      message,
      type: NotificationType.WARNING,
      duration
    });
  }
  
  /**
   * Display notification
   */
  private showNotification(notification: Notification): void {
    this.notificationSubject.next(notification);
    
    // Log to console for debugging
    console.log(`${notification.type.toUpperCase()}: ${notification.message}`);
  }
}