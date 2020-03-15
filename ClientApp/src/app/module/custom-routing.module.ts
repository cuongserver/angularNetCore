import { NgModule } from '@angular/core';
import {
  PreventUnauthenticated,
  PreventBackToLoginPageAfterLogin,
  RoleCheck
} from '../_common/auth-service/authguard.service';
import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { AccountInformationComponent } from '../account-maintenance/account-information/account-information.component';
import { ChangePasswordComponent } from '../account-maintenance/change-password/change-password.component';
import { ListAllUserComponent } from '../user-maintenance/list-all-user/list-all-user.component';
import { AddNewUserComponent } from '../user-maintenance/add-new-user/add-new-user.component';

const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full', canActivate: [PreventBackToLoginPageAfterLogin] },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [PreventUnauthenticated],
    children: [
      //{ path: 'account-information', component: AccountInformationComponent, canActivate: [PreventUnauthenticated] },
      //{ path: 'change-password', component: ChangePasswordComponent, canActivate: [PreventUnauthenticated] },
      {
        path: 'account-information', component: AccountInformationComponent,
        canActivate: [RoleCheck], data: { authorizedRoles: ['0000','0003'] }
      },
      {
        path: 'change-password', component: ChangePasswordComponent,
        canActivate: [RoleCheck], data: { authorizedRoles: ['0000', '0003'] }
      },
      {
        path: 'list-all-user', component: ListAllUserComponent,
        canActivate: [RoleCheck], data: { authorizedRoles: ['0000'] }
      },
      {
        path: 'add-new-user', component: AddNewUserComponent,
        canActivate: [RoleCheck], data: { authorizedRoles: ['0000'] }
      }
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
    PreventUnauthenticated,
    RoleCheck
  ],
  exports: [
    RouterModule
  ]
})
export class CustomRoutingModule {

}
