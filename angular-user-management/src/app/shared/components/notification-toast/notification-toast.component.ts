import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService, Notification, NotificationType } from '../../../core/services/notification.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-notification-toast',
  templateUrl: './notification-toast.component.html',
  styleUrls: ['./notification-toast.component.scss'],
  animations: [
    trigger('toastAnimation', [
      state('void', style({
        transform: 'translateY(-100%)',
        opacity: 0
      })),
      state('visible', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('void => visible', animate('300ms ease-out')),
      transition('visible => void', animate('300ms ease-in'))
    ])
  ]
})
export class NotificationToastComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();
  
  constructor(private notificationService: NotificationService) {}
  
  ngOnInit(): void {
    // Subscribe to notification service
    this.subscription.add(
      this.notificationService.notifications.subscribe(notification => {
        this.showNotification(notification);
      })
    );
  }
  
  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.subscription.unsubscribe();
  }
  
  /**
   * Show a notification
   */
  private showNotification(notification: Notification): void {
    // Add notification to array
    this.notifications.push(notification);
    
    // Remove notification after duration
    setTimeout(() => {
      this.removeNotification(notification);
    }, notification.duration || 5000);
  }
  
  /**
   * Remove a notification
   */
  removeNotification(notification: Notification): void {
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }
  
  /**
   * Get CSS class for notification type
   */
  getNotificationClass(type: NotificationType): string {
    switch (type) {
      case NotificationType.SUCCESS:
        return 'toast-success';
      case NotificationType.ERROR:
        return 'toast-error';
      case NotificationType.INFO:
        return 'toast-info';
      case NotificationType.WARNING:
        return 'toast-warning';
      default:
        return 'toast-info';
    }
  }
  
  /**
   * Get icon for notification type
   */
  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.SUCCESS:
        return 'check_circle';
      case NotificationType.ERROR:
        return 'error';
      case NotificationType.INFO:
        return 'info';
      case NotificationType.WARNING:
        return 'warning';
      default:
        return 'info';
    }
  }
}