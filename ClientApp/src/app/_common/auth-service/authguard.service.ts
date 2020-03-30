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
  constructor(public jwtHelper: JwtHelperService, public router: Router, public dialogService: DialogService,
    public dialog: MatDialog) {
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
export class RoleCheck implements CanActivate {

  public subscriber: Subscription
  constructor(public jwtHelper: JwtHelperService, public router: Router, public dialogService: DialogService,
    public dialog: MatDialog) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    let roles: Array<string> = route.data["authorizedRoles"];
    let token = this.jwtHelper.tokenGetter();
    if (token == null) {
      this.sendMessage();
      return false;
    }
    let role: string = extractFromToken('role', this.jwtHelper);
    if (!roles.includes(role)) {
      this.sendMessage();
      return false;
    }
    else {
      return true;
    }
  }

  public sendMessage() {
    this.subscriber = this.dialogService.getMessage().subscribe((message) => {
      this.subscriber.unsubscribe();
      DialogController.show(this.dialog, message.text, message.extraInfo, '', '',
          MessageBoxButton.Ok, false, MessageBoxStyle.Simple).subscribe((result) => {

        });
    });
    this.dialogService.sendMessage('unauthorized', '');
  }
}

@Injectable()
export class PreventBackToLoginPageAfterLogin implements CanActivate {
  constructor(public jwtHelper: JwtHelperService, public router: Router) {
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

export function extractFromToken(segment: string, jwtHelper: JwtHelperService): string {
  let token = jwtHelper.tokenGetter();
  let decodedInfo = jwtHelper.decodeToken(token);
  return decodedInfo[segment];
}
