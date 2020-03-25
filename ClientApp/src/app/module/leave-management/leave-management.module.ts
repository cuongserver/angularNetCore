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
import { SortableHeaderModule } from '@app/module/shared-module/sortable-header.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '@app/_common/dialog/dialog.component';
import { LeaveLimitService } from '@app/module/leave-management/leave-limit.service';
import { LeaveLimitSummaryComponent } from '@app/module/leave-management/leave-limit-summary/leave-limit-summary.component';
import { AdjustLeaveLimitComponent } from '@app/module/leave-management/adjust-leave-limit/adjust-leave-limit.component';
@NgModule({
  declarations: [
    LeaveLimitSummaryComponent,
    AdjustLeaveLimitComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    TranslationModule,
    SortableHeaderModule,
    FormsModule, ReactiveFormsModule
  ],
  providers: [
    PreventBackToLoginPageAfterLogin,
    RoleCheck,
    PreventUnauthenticated,
    DialogService,
    LeaveLimitService
  ],
  exports: [
    LeaveLimitSummaryComponent,
    AdjustLeaveLimitComponent
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
