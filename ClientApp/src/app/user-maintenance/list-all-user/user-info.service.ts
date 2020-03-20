import { Injectable } from '@angular/core';
import { User } from './list-all-user.component'
import { Subject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private userEditOpened = new Subject<any>();
  private userEditClose = new Subject<any>();
  private userEditConfirm = new Subject<any>();

  private resetPasswordOpened = new Subject<any>();
  private resetPasswordClose = new Subject<any>();

  sendOpenCommand(user: User, index: number) {
    this.userEditOpened.next({ user: user, index: index });
  }
  getOpenMessage(): Observable<any> {
    return this.userEditOpened.asObservable();
  }

  sendCloseCommand() {
    this.userEditClose.next();
  }
  getCloseMessage(): Observable<any> {
    return this.userEditClose.asObservable();
  }

  sendConfirmCommand(user: User, index: number) {
    this.userEditConfirm.next({ user: user, index: index });
  }

  getConfirmMessage(): Observable<any> {
    return this.userEditConfirm.asObservable();
  }

  OpenResetPasswordFunction(user: User, index: number) {
    this.resetPasswordOpened.next({ user: user, index: index });
  }

  OnOpenResetPasswordFunction(): Observable<any> {
    return this.resetPasswordOpened.asObservable();
  }

  CloseResetPasswordFunction() {
    this.resetPasswordClose.next();
  }

  OnCloseResetPasswordFunction(): Observable<any> {
    return this.resetPasswordClose.asObservable();
  }


}
