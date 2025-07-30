import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/models/user.interface';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  user: User | null = null;
  loading = false;
  submitting = false;
  passwordSubmitting = false;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
    this.initForms();
    this.loadUserProfile();
  }
  
  /**
   * Initialize forms
   */
  private initForms(): void {
    // Profile form
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
    
    // Password form
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }
  
  /**
   * Load user profile
   */
  private loadUserProfile(): void {
    this.loading = true;
    
    this.userService.getUser(1) // Using a hardcoded ID for demo purposes
      .subscribe({
        next: (user) => {
          this.user = user;
          this.profileForm.patchValue({
            name: user.name,
            email: user.email
          });
          this.loading = false;
        },
        error: (error) => {
          this.notificationService.showError('Failed to load user profile');
          this.loading = false;
        }
      });
  }
  
  /**
   * Update user profile
   */
  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    
    this.submitting = true;
    
    const updatedUser: User = {
      ...this.user!,
      name: this.profileForm.value.name,
      email: this.profileForm.value.email
    };
    
    this.userService.updateUser(updatedUser)
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Profile updated successfully');
          this.submitting = false;
        },
        error: (error) => {
          this.notificationService.showError('Failed to update profile');
          this.submitting = false;
        }
      });
  }
  
  /**
   * Change password
   */
  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    
    this.passwordSubmitting = true;
    
    this.userService.changePassword({
      id: this.user!.id,
      password: this.passwordForm.value.password
    })
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Password changed successfully');
          this.passwordForm.reset();
          this.passwordSubmitting = false;
        },
        error: (error) => {
          this.notificationService.showError('Failed to change password');
          this.passwordSubmitting = false;
        }
      });
  }
  
  /**
   * Password match validator
   */
  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  
  /**
   * Check if form control has error
   */
  hasError(form: FormGroup, controlName: string, errorName: string): boolean {
    const control = form.get(controlName);
    return control !== null && control.touched && control.hasError(errorName);
  }
  
  /**
   * Get error message for form control
   */
  getErrorMessage(form: FormGroup, controlName: string): string {
    const control = form.get(controlName);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }
    
    if (control.hasError('required')) {
      return 'This field is required';
    }
    
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    
    if (control.hasError('minlength')) {
      const minLength = control.errors['minlength'].requiredLength;
      return `Minimum length is ${minLength} characters`;
    }
    
    if (controlName === 'confirmPassword' && form.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    
    return 'Invalid input';
  }
}