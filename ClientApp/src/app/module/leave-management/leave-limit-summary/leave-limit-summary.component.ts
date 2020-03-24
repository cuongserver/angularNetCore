import * as res from '@app/module/system-setting/module-resource';
import {
  Component, Renderer2, ElementRef,
  Directive, EventEmitter, Input, Output, QueryList, ViewChildren, HostBinding, HostListener, OnInit, AfterViewInit, ViewChild, OnDestroy
} from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { JsonToCsvService } from '@app/_common/json-to-csv/json-to-csv.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { DialogService, DialogController, MessageBoxButton, MessageBoxStyle } from '@app/_common/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '@app/_common/loader/loader.service';

@Component({
  selector: 'app-leave-limit-summary',
  templateUrl: './leave-limit-summary.component.html',
  styleUrls: ['./leave-limit-summary.component.css'],
  animations: res.fadeAnimation
})
/** LeaveLimitSummary component*/
export class LeaveLimitSummaryComponent {
  private transitionState: string = 'in';
  private leavecodes: string[];
  private summary: Array<LeaveBalance> = new Array<LeaveBalance>();
  constructor(private http: HttpClient) {
    this.getData();
  }

  private getData(): void{
    this.http.get('/LeaveManagement/LeaveLimitSummary').subscribe(
      response => {
        let result = JSON.parse(JSON.stringify(response));
        this.leavecodes = result["leaveCodes"] as string[];
        let array1 = result["summary"] as Array<any>;
        array1.forEach(x => {
          let user: User =  {
            userName: x['user']['userName'],
            userFullName: x['user']['userFullName'],
            userDeptCode: x['user']['userDeptCode'],
            userTitleCode: x['user']['userTitleCode']
          }
          let types: Array<LeaveType> = new Array<LeaveType>();
          let array2 = x["leaveTypes"] as Array<any>;
          array2.forEach(y => {
            let leaveType: LeaveType = {
              leaveCode: y['leaveCode'],
              limit: y['limit']!= null ? y['limit'].toString() : '',
              balance: ''
            }
            types.push(leaveType);
          })
          let detail: LeaveBalance = {
            user: user,
            leaveTypes: types
          }
          this.summary.push(detail);
        });

      },
      error => {

      }
    )
  }
}

interface LeaveBalance {
  user: User;
  leaveTypes: LeaveType[]
}

interface User {
  userName: string
  userFullName: string
  userDeptCode: string
  userTitleCode: string
}

interface LeaveType {
  leaveCode: string
  limit: string
  balance: string
}
