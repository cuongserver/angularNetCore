import { Component, OnDestroy } from '@angular/core';
import * as res from '@app/module/system-setting/module-resource';
import { HttpClient } from '@angular/common/http';
import {LeaveApplication,SysParam, Holiday } from '@app/module/leave-management/user-leave-application/user-leave-application.component'
import { LeaveApproveService } from '@app/module/leave-management/leave-approve.service';
import { Subscription } from 'rxjs';
import { apiLink, domain } from '@app/_common/const/apilink'
@Component({
  selector: 'app-approve-leave-application',
  templateUrl: './approve-leave-application.component.html',
  styleUrls: ['./approve-leave-application.component.css'],
  animations: res.fadeAnimation
})
/** approve-leave-application component*/
export class ApproveLeaveApplicationComponent implements OnDestroy {
/** approve-leave-application ctor */
  public response: any
  public transitionState: string = 'in';
  public apps: Array<LeaveApplication> = new Array<LeaveApplication>();
  public onConfirmation: boolean = false;
  public subscription1: Subscription; public subscription2: Subscription;
  public subscription3: Subscription; public subscription4: Subscription;

  constructor(public http: HttpClient, public infoservice: LeaveApproveService) {
    this.getData();
    
  }

  public getData(): void {
    this.http.get(apiLink + '/LeaveManagement/PendingLeaveApplication').subscribe(
      response => {
        let result = JSON.parse(JSON.stringify(response));

        this.apps = result['apps'];
      },
      error => {

      }
    )
  }

  public refresh(): void {
    this.getData();
  }

  public sendDecision(decision: boolean, index: number): void {
    this.subscription1 = this.infoservice.OnCloseApproveFunction().subscribe(() => {
      this.subscription1.unsubscribe();
      this.subscription2.unsubscribe();
      this.onConfirmation = false;
    });
    this.subscription2 = this.infoservice.OnApproveFunctionIsDecided().subscribe(data => {
      console.log(data)
      this.subscription2.unsubscribe();
      let decision: boolean = data.decision as boolean
      let i: number = data.index;
      this.apps[i].approverCommand = decision? '0000':'0001'
    })

    this.infoservice.OpenApproveFunction(this.apps[index], decision, index);
    this.onConfirmation = true;
  }




  ngOnDestroy() {
    if (this.subscription1) this.subscription1.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
  }
}
