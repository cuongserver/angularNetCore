import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtModule, JwtHelperService } from "@auth0/angular-jwt";
import { MatDialog } from "@angular/material/dialog";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "./../dialog-service/message-box";
import { MessageService } from "./../dialog-service/message.service";
import { Subscription, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  subscriber: Subscription
  constructor(private jwtHelper: JwtHelperService, private router: Router, private messageService: MessageService,
    private dialog: MatDialog) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    let token = sessionStorage.getItem('jwt');
    if (token == null) {
      this.messageService.sendMessage('unauthorized', '');
      return false;
    }
    else {
      return true;
    }
  }
}
