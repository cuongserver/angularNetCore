import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { LeaveBalance } from '@app/module/leave-management/leave-limit-summary/leave-limit-summary.component';


@Injectable()
export class LeaveLimitService {
  private AdjustLimitFunctionOpened = new Subject<any>();
  private AdjustLimitFunctionClosed = new Subject<any>();
  private AdjustLimitFunctionConfirm = new Subject<any>();

  OpenAdjustLimitFunction(detail: LeaveBalance, index: number) {
    this.AdjustLimitFunctionOpened.next({ detail: detail, index: index });
  }

  OnOpenAdjustLimitFunction(): Observable<any> {
    return this.AdjustLimitFunctionOpened.asObservable();
  }

  CloseAdjustLimitFunction() {
    this.AdjustLimitFunctionClosed.next();
  }

  OnCloseAdjustLimitFunction(): Observable<any> {
    return this.AdjustLimitFunctionClosed.asObservable();
  }

  ConfirmAdjustLimitFunction(detail: LeaveBalance, index: number) {
    this.AdjustLimitFunctionConfirm.next({ detail: detail, index: index });
  }

  OnConfirmAdjustLimitFunction(): Observable<any> {
    return this.AdjustLimitFunctionConfirm.asObservable();
  }
}
