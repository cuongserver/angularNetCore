import { Component } from '@angular/core';
import * as res from '@app/module/system-setting/module-resource';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { apiLink, domain } from '@app/_common/const/apilink'
@Component({
  selector: 'app-leave-balance',
  templateUrl: './leave-balance.component.html',
  styleUrls: ['./leave-balance.component.css'],
  animations: res.fadeAnimation
})
/** leave-balance component*/
export class LeaveBalanceComponent {
  public transitionState: string = 'in';
  public leaveTypes: Array<LeaveType> = new Array<LeaveType>();
  public currentYear: number
  public reportYears: Array<string> = new Array<string>();
  public reportYear: string
  constructor(public http: HttpClient) {
    this.currentYear = (new Date()).getFullYear();
    for (var i = 0; i < 5; i += 1) {
      this.reportYears.push(this.currentYear + '');
      this.currentYear -= 1;
    }
    this.reportYear = this.reportYears[0];
    this.refresh();
  }

  public getData(reportYear: string): void {
    this.http.get(apiLink + '/LeaveManagement/LeaveBalance', {
      params: {
        reportYear: reportYear
      }
    }).subscribe(
      response => {
        let result = JSON.parse(JSON.stringify(response))
        this.leaveTypes = result['leaveTypes'] as Array<LeaveType>
      },
      error => {

      }

    )
  }

  public refresh(): void {
    this.getData(this.reportYear);
  }
}


interface LeaveType {
  leaveCode: string
  limit: number
  used: number
  pending: number
  balance: number
}
