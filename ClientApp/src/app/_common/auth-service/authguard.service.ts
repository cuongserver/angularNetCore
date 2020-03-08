import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtModule, JwtHelperService } from "@auth0/angular-jwt";
import { MatDialog } from "@angular/material/dialog";
import { DialogController, MessageBoxButton, MessageBoxStyle, DialogService } from "./../dialog/dialog.component";
import { Subscription, Observable } from "rxjs";

//@Injectable()
@Injectable()
export class PreventUnauthenticated implements CanActivate {

  subscriber: Subscription
  constructor(private jwtHelper: JwtHelperService, private router: Router, private dialogService: DialogService,
    private dialog: MatDialog) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    let token = this.jwtHelper.tokenGetter();
    if (token == null) {
      this.dialogService.sendMessage('unauthorized', '');
      return false;
    }
    else {
      return true;
    }
  }
}

@Injectable()
export class PreventBackToLoginPageAfterLogin implements CanActivate {
  constructor(private jwtHelper: JwtHelperService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let token = this.jwtHelper.tokenGetter();
    if (token != null) {
      this.router.navigate(['./dashboard']);
      return false;
    }
    else {
      return true;
    }
  }
}

