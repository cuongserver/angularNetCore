import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPublicHolidayComponent } from '@app/module/system-setting/component/add-public-holiday/add-public-holiday.component';
import { PublicHolidayListComponent } from '@app/module/system-setting/component/public-holiday-list/public-holiday-list.component';
import { Routes } from '@angular/router';
import {
  PreventBackToLoginPageAfterLogin,
  RoleCheck,
  PreventUnauthenticated,
  extractFromToken
} from '@app/_common/auth-service/authguard.service'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {TranslationModule} from '@app/module/shared-module/translation.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '@app/_common/dialog/dialog.component';

@NgModule({
  declarations: [
    AddPublicHolidayComponent,
    PublicHolidayListComponent
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
    AddPublicHolidayComponent,
    PublicHolidayListComponent
  ]
})
export class SystemSettingModule {
}

export const SystemSettingRoutes: Routes = [
  {
    path: 'add-public-holiday', component: AddPublicHolidayComponent,
    canActivate: [RoleCheck], data: { authorizedRoles: ['0000'] }
  },
  {
    path: 'public-holiday-list', component: PublicHolidayListComponent,
    canActivate: [RoleCheck], data: { authorizedRoles: ['0000'] }
  } 
]




