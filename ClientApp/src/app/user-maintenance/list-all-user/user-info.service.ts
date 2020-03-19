import { Injectable } from '@angular/core';
import { User } from './list-all-user.component'
import { Subject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private userEditOpened = new Subject<any>();
  private userEditClose = new Subject<any>();

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

}
