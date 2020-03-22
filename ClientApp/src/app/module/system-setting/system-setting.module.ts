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
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {TranslationModule} from '@app/module/shared-module/translation.module'


@NgModule({
  declarations: [
    AddPublicHolidayComponent,
    PublicHolidayListComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    TranslationModule
  ],
  providers: [
    PreventBackToLoginPageAfterLogin,
    RoleCheck,
    PreventUnauthenticated
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




