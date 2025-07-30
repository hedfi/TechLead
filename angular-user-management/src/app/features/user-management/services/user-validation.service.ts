import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserValidationService {
  /**
   * Validate email format
   */
  validateEmail(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    if (!email) {
      return null;
    }
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email) ? null : { invalidEmail: true };
  }
  
  /**
   * Validate password strength
   */
  validatePasswordStrength(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) {
      return null;
    }
    
    const errors: ValidationErrors = {};
    
    if (password.length < 8) {
      errors['minLength'] = true;
    }
    
    if (!/[A-Z]/.test(password)) {
      errors['noUppercase'] = true;
    }
    
    if (!/[a-z]/.test(password)) {
      errors['noLowercase'] = true;
    }
    
    if (!/[0-9]/.test(password)) {
      errors['noDigit'] = true;
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors['noSpecialChar'] = true;
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  }
  
  /**
   * Get password strength feedback message
   */
  getPasswordStrengthFeedback(errors: ValidationErrors | null): string {
    if (!errors) {
      return 'Strong password';
    }
    
    const messages = [];
    
    if (errors['minLength']) {
      messages.push('Password must be at least 8 characters long');
    }
    
    if (errors['noUppercase']) {
      messages.push('Include at least one uppercase letter');
    }
    
    if (errors['noLowercase']) {
      messages.push('Include at least one lowercase letter');
    }
    
    if (errors['noDigit']) {
      messages.push('Include at least one number');
    }
    
    if (errors['noSpecialChar']) {
      messages.push('Include at least one special character');
    }
    
    return messages.join('. ');
  }
}