import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Directive, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule, JwtHelperService } from "@auth0/angular-jwt";
//dialog

import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; 
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { MatRadioModule } from "@angular/material/radio";
import { MatToolbarModule } from "@angular/material/toolbar";

//

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent, HideDropDownWhenClickAwayDirective } from './dashboard/dashboard.component';
import { SideMenuComponent } from './dashboard/dashboard-side-menu/sidemenu.component';
import { SubGroupComponent } from './dashboard/dashboard-side-menu/subgroup.component';
import { SideMenuClosingService } from './dashboard/dashboard-side-menu/sidemenu.service';

import { DialogService, DialogComponent, DialogController } from "./_common/dialog/dialog.component";
import { HttpClient} from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoaderComponent } from './_common/loader/loader.component';
import { LoaderInterceptorService } from './_common/loader/loaderinterceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomRoutingModule } from './module/custom-routing.module'
import { JsonToCsvService } from '@app/_common/json-to-csv/json-to-csv.service'

//các chức năng của accountMaintenance
import {AccountInformationComponent} from './account-maintenance/account-information/account-information.component'
import {ChangePasswordComponent} from './account-maintenance/change-password/change-password.component'
import { ListAllUserComponent} from './user-maintenance/list-all-user/list-all-user.component';
import { AddNewUserComponent } from './user-maintenance/add-new-user/add-new-user.component';
import { EditUserInfoComponent } from './user-maintenance/list-all-user/edit-user-info/edit-user-info.component';
import { ChangeUserPasswordComponent } from './user-maintenance/list-all-user/change-user-password/change-user-password.component';

import { SystemSettingModule } from '@app/module/system-setting/system-setting.module'
import { LeaveManagementModule } from '@app/module/leave-management/leave-management.module'
import { SortableHeaderModule } from '@app/module/shared-module/sortable-header.module'

import {apiLink, domain} from '@app/_common/const/apilink'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoaderComponent,
    DashboardComponent,
    DialogComponent,
    HideDropDownWhenClickAwayDirective,
    SideMenuComponent, SubGroupComponent,
    AccountInformationComponent,
    ChangePasswordComponent,
    ListAllUserComponent,
    AddNewUserComponent,
    EditUserInfoComponent,
    ChangeUserPasswordComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    CustomRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [domain],
        blacklistedRoutes: []
      }
    }),

    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatRadioModule,
    MatToolbarModule,
    MatSlideToggleModule,
    SystemSettingModule,
    LeaveManagementModule,
    SortableHeaderModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    },
    {
      provide: MAT_DIALOG_DATA, useValue: {}
    },
    DialogService,
    SideMenuClosingService,
    JsonToCsvService    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function tokenGetter() {
  return sessionStorage.getItem("jwt");
}
export function extractFromToken(segment: string, jwtHelper: JwtHelperService): string {
  let token = tokenGetter();
  let decodedInfo = jwtHelper.decodeToken(token);
  return decodedInfo[segment];
}

