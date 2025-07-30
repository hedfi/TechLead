import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

/**
 * Pipe to format dates with a default format
 * Usage: {{ dateValue | formatDate }}
 * Usage with custom format: {{ dateValue | formatDate:'MM/dd/yyyy' }}
 */
@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  private datePipe = new DatePipe('en-US');
  
  /**
   * Transform a date to a formatted string
   * @param value The date to format
   * @param format The date format (default: 'MMM d, y')
   * @returns The formatted date string
   */
  transform(value: any, format: string = 'MMM d, y'): string | null {
    if (!value) {
      return null;
    }
    
    return this.datePipe.transform(value, format);
  }
}