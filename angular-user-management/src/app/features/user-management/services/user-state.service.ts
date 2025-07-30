import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../../core/models/user.interface';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<User | null>(null);
  private errorSubject = new BehaviorSubject<string>('');
  
  // Expose observables for components to subscribe to
  readonly loading$ = this.loadingSubject.asObservable();
  readonly user$ = this.userSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();
  
  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {}
  
  /**
   * Load user data
   */
  loadUser(id: number): void {
    this.loadingSubject.next(true);
    this.errorSubject.next('');
    
    this.userService.getUser(id).pipe(
      tap(user => this.userSubject.next(user)),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe({
      error: (err) => {
        this.errorSubject.next('Could not fetch user');
        console.error('Error fetching user:', err);
      }
    });
  }
  
  /**
   * Update user data
   */
  updateUser(user: User): Observable<any> {
    this.loadingSubject.next(true);
    
    return this.userService.updateUser(user).pipe(
      tap(() => {
        this.userSubject.next(user);
        this.notificationService.showSuccess('User updated successfully');
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }
  
  /**
   * Change user password
   */
  changePassword(userId: number, newPassword: string): Observable<any> {
    this.loadingSubject.next(true);
    
    return this.userService.changePassword({ id: userId, password: newPassword }).pipe(
      tap(() => {
        this.notificationService.showSuccess('Password changed successfully');
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }
  
  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.userSubject.getValue();
  }
  
  /**
   * Clear user state
   */
  clearState(): void {
    this.userSubject.next(null);
    this.errorSubject.next('');
  }
}