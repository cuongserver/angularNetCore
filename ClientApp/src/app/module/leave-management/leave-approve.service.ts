import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import {LeaveApplication} from '@app/module/leave-management/user-leave-application/user-leave-application.component'
@Injectable()
export class LeaveApproveService {
  private ApproveFunctionOpened = new Subject<any>();
  private ApproveFunctionClosed = new Subject<any>();
  private ApproveFunctionDecided = new Subject<any>();

  OpenApproveFunction(app: LeaveApplication, decision: boolean, index: number) {
    this.ApproveFunctionOpened.next({ app: app, decision: decision, index: index });
  }

  OnOpenApproveFunction(): Observable<any> {
    return this.ApproveFunctionOpened.asObservable();
  }

  CloseApproveFunction() {
    this.ApproveFunctionClosed.next();
  }

  OnCloseApproveFunction(): Observable<any> {
    return this.ApproveFunctionClosed.asObservable();
  }

  ApproveFunctionIsDecided(decision: boolean, index: number) {
    this.ApproveFunctionDecided.next({ decision: decision, index: index });
  }

  OnApproveFunctionIsDecided(): Observable<any> {
    return this.ApproveFunctionDecided.asObservable();
  }
}
