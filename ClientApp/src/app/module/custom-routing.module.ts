import { NgModule } from '@angular/core';
import {
  PreventUnauthenticated,
  PreventBackToLoginPageAfterLogin
} from '../_common/auth-service/authguard.service';
import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { AccountInformationComponent } from '../account-maintenance/account-information/account-information.component';
import { ChangePasswordComponent } from '../account-maintenance/change-password/change-password.component';

const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full', canActivate: [PreventBackToLoginPageAfterLogin] },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [PreventUnauthenticated],
    children: [
      { path: 'account-information', component: AccountInformationComponent, canActivate: [PreventUnauthenticated] },
      { path: 'change-password', component: ChangePasswordComponent, canActivate: [PreventUnauthenticated] }
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes
      /*{ enableTracing: true }*/ // <-- debugging purposes only
    )
  ],
  providers: [
    PreventBackToLoginPageAfterLogin,
    PreventUnauthenticated
  ],
  exports: [
    RouterModule
  ]
})
export class CustomRoutingModule {

}
