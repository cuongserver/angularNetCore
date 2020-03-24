import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import {
  PreventBackToLoginPageAfterLogin,
  RoleCheck,
  PreventUnauthenticated,
  extractFromToken
} from '@app/_common/auth-service/authguard.service'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from '@app/module/shared-module/translation.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '@app/_common/dialog/dialog.component';
import { LeaveLimitSummaryComponent } from '@app/module/leave-management/leave-limit-summary/leave-limit-summary.component';

@NgModule({
  declarations: [
    LeaveLimitSummaryComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    TranslationModule,
    FormsModule, ReactiveFormsModule
  ],
  providers: [
    PreventBackToLoginPageAfterLogin,
    RoleCheck,
    PreventUnauthenticated,
    DialogService
  ],
  exports: [
    LeaveLimitSummaryComponent
  ]
})
export class LeaveManagementModule {
}

export const LeaveManagementRoutes: Routes = [
  {
    path: 'leave-limit-summary', component: LeaveLimitSummaryComponent,
    canActivate: [RoleCheck], data: { authorizedRoles: ['0000'] }
  }
]
