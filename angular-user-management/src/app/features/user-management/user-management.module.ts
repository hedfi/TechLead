import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UserProfileComponent } from './user-profile/user-profile.component';
import { SharedModule } from '../../shared/shared.module';
import { UserManagementRoutingModule } from './user-management-routing.module';

@NgModule({
  declarations: [
    UserProfileComponent
    // Add other user management components here
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    SharedModule,
    UserManagementRoutingModule
  ],
  exports: [
    UserProfileComponent
  ]
})
export class UserManagementModule { }