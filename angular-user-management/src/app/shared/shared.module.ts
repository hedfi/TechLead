import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NotificationToastComponent } from './components/notification-toast/notification-toast.component';
import { DebounceClickDirective } from './directives/debounce-click.directive';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({
  declarations: [
    ErrorMessageComponent,
    LoadingSpinnerComponent,
    NotificationToastComponent,
    DebounceClickDirective,
    FormatDatePipe,
    SafeHtmlPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ErrorMessageComponent,
    LoadingSpinnerComponent,
    NotificationToastComponent,
    DebounceClickDirective,
    FormatDatePipe,
    SafeHtmlPipe
  ]
})
export class SharedModule { }