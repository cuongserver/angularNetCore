import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Directive, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { JwtModule } from "@auth0/angular-jwt";
//dialog

import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { MatRadioModule } from "@angular/material/radio";
import { MatToolbarModule } from "@angular/material/toolbar";

//

import { AppComponent } from './app.component';
//import { NavMenuComponent } from './nav-menu/nav-menu.component';
//import { HomeComponent } from './home/home.component';
//import { CounterComponent } from './counter/counter.component';
//import { FetchDataComponent } from './fetch-data/fetch-data.component';
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
import {
  PreventUnauthenticated,
  PreventBackToLoginPageAfterLogin
} from './_common/auth-service/authguard.service';


@NgModule({
  declarations: [
    AppComponent,
    //NavMenuComponent,
    //HomeComponent,
    //CounterComponent,
    //FetchDataComponent,
    LoginComponent,
    LoaderComponent,
    DashboardComponent,
    DialogComponent,
    HideDropDownWhenClickAwayDirective,
    SideMenuComponent, SubGroupComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent, pathMatch: 'full', canActivate: [PreventBackToLoginPageAfterLogin] },
      { path: 'dashboard', component: DashboardComponent, canActivate: [PreventUnauthenticated]}
      //{ path: 'fetch-data', component: FetchDataComponent },
      //{ path: 'login', component: LoginComponent }
    ]),

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
        whitelistedDomains: ["localhost:44300"],
        blacklistedRoutes: []
      }
    }),

    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatRadioModule,
    MatToolbarModule
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
    PreventBackToLoginPageAfterLogin,
    PreventUnauthenticated,
    SideMenuClosingService
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

