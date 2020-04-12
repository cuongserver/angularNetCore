import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes } from "@angular/router";
import {
  PreventBackToLoginPageAfterLogin,
  RoleCheck,
  PreventUnauthenticated,
  extractFromToken
} from "@app/_common/auth-service/authguard.service";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { TranslationModule } from "@app/module/shared-module/translation.module";
import { SortableHeaderModule } from "@app/module/shared-module/sortable-header.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogService } from "@app/_common/dialog/dialog.component";
import { LeaveLimitService } from "@app/module/leave-management/leave-limit.service";
import { LeaveLimitSummaryComponent } from "@app/module/leave-management/leave-limit-summary/leave-limit-summary.component";
import { AdjustLeaveLimitComponent } from "@app/module/leave-management/adjust-leave-limit/adjust-leave-limit.component";
import { UserLeaveApplicationComponent } from "@app/module/leave-management/user-leave-application/user-leave-application.component";
import { ApproveLeaveApplicationComponent } from "@app/module/leave-management/approve-leave-application/approve-leave-application.component";
import { LeaveApproveService } from "@app/module/leave-management/leave-approve.service";
import { LeaveApprovalConfirmComponent } from "@app/module/leave-management/approve-leave-application/leave-approval-confirm/leave-approval-confirm.component";
import { LeaveBalanceComponent } from "@app/module/leave-management/leave-balance/leave-balance.component";
import { LeaveApplicationListComponent } from "@app/module/leave-management/leave-application-list/leave-application-list.component";
import { AllApplicationListComponent } from "@app/module/leave-management/all-application-list/all-application-list.component";
import {
  DirectLeaveDeductionComponent,
  DropDownOption
} from "@app/module/leave-management/direct-leave-deduction/direct-leave-deduction.component";
import { DatetimepickerModule } from "@app/module/shared-module/datetime-picker-module/datetimepicker-module.module";
@NgModule({
  declarations: [
    LeaveLimitSummaryComponent,
    AdjustLeaveLimitComponent,
    UserLeaveApplicationComponent,
    ApproveLeaveApplicationComponent,
    LeaveApprovalConfirmComponent,
    LeaveBalanceComponent,
    LeaveApplicationListComponent,
    AllApplicationListComponent,
    DirectLeaveDeductionComponent,
    DropDownOption
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    TranslationModule,
    SortableHeaderModule,
    FormsModule,
    ReactiveFormsModule,
    DatetimepickerModule
  ],
  providers: [
    PreventBackToLoginPageAfterLogin,
    RoleCheck,
    PreventUnauthenticated,
    DialogService,
    LeaveLimitService,
    LeaveApproveService
  ],
  exports: [LeaveLimitSummaryComponent, AdjustLeaveLimitComponent]
})
export class LeaveManagementModule {}

export const LeaveManagementRoutes: Routes = [
  {
    path: "leave-limit-summary",
    component: LeaveLimitSummaryComponent,
    canActivate: [RoleCheck],
    data: { authorizedRoles: ["0000"] }
  },
  {
    path: "user-leave-application",
    component: UserLeaveApplicationComponent,
    canActivate: [RoleCheck],
    data: { authorizedRoles: ["0002", "0003"] }
  },
  {
    path: "approve-leave-application",
    component: ApproveLeaveApplicationComponent,
    canActivate: [RoleCheck],
    data: { authorizedRoles: ["0001", "0002"] }
  },
  {
    path: "leave-balance",
    component: LeaveBalanceComponent,
    canActivate: [RoleCheck],
    data: { authorizedRoles: ["0001", "0002", "0003"] }
  },
  {
    path: "leave-application-list",
    component: LeaveApplicationListComponent,
    canActivate: [RoleCheck],
    data: { authorizedRoles: ["0001", "0002", "0003"] }
  },
  {
    path: "all-application-list",
    component: AllApplicationListComponent,
    canActivate: [RoleCheck],
    data: { authorizedRoles: ["0000"] }
  },
  {
    path: "direct-leave-deduction",
    component: DirectLeaveDeductionComponent,
    canActivate: [RoleCheck],
    data: { authorizedRoles: ["0000"] }
  }
];
