import { Component, OnDestroy } from '@angular/core';
import { LeaveApplication } from '@app/module/leave-management/user-leave-application/user-leave-application.component'
import { Subscription } from 'rxjs';
import { DialogService, DialogController, MessageBoxStyle, MessageBoxButton } from '@app/_common/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '@app/_common/loader/loader.service';
import { LeaveApproveService } from '@app/module/leave-management/leave-approve.service';
import { HttpClient } from '@angular/common/http';
import * as res from '@app/module/system-setting/module-resource';
import { apiLink, domain } from '@app/_common/const/apilink'
@Component({
    selector: 'app-leave-approval-confirm',
    templateUrl: './leave-approval-confirm.component.html',
    styleUrls: ['./leave-approval-confirm.component.css']
})
/** leave-approval-confirm component*/
export class LeaveApprovalConfirmComponent implements OnDestroy {
  public index: number;
  public decision: boolean
  public x: Subscription;
  public subscription1: Subscription;
  public subscription2: Subscription;
  public app: LeaveApplication;
  constructor(public infoservice: LeaveApproveService, public dialogService: DialogService,
    public dialog: MatDialog, public loader: LoaderService, public http: HttpClient) {

    this.x = this.infoservice.OnOpenApproveFunction().subscribe(data => {
      this.app = data.app as LeaveApplication
      this.decision = data.decision as boolean
      this.index = data.index as number
    })
  }

  ngOnDestroy() {
    this.infoservice.CloseApproveFunction();
    this.x.unsubscribe();
    if (this.subscription1) this.subscription1.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
  }

  closeEditing() {
    this.infoservice.CloseApproveFunction();
    this.app = null;

  }
  submitDecision(decision: boolean) {
    this.app.approverCommand = decision? '0000': '0001'
    let _obj: LeaveApplication = this.app
    let data = JSON.stringify(_obj);
    this.setEventListenerAfterSubmit();
    this.http.post(apiLink + '/LeaveManagement/LeaveApprovalConfirm', data, res.moduleHttpOptions).subscribe(
      response => {
        let result = JSON.parse(JSON.stringify(response));
        let message1 = result['status'];

        if (message1 == '000') {
          this.dialogService.sendMessage('000' + 'approval', _obj.trackingRef);
          this.infoservice.ApproveFunctionIsDecided(decision, this.index);          
        }

        if (message1 == '002') {
          this.dialogService.sendMessage('002' + 'approval', _obj.trackingRef);
          this.app.approverCommand = null;
        }
      },
      error => {
        this.subscription1.unsubscribe();
        this.app.approverCommand = null;
      }
    )
  }

  setEventListenerAfterSubmit(): void {
    this.subscription1 = this.dialogService.getMessage().subscribe(message => {
      this.subscription2 = this.loader.loaderDeactivated.subscribe(() => {
        var x = DialogController.show(this.dialog, message.text, message.extraInfo, '', '',
          MessageBoxButton.Ok, false, MessageBoxStyle.Simple).subscribe(result => {
            this.subscription1.unsubscribe();
            this.subscription2.unsubscribe();
            if (message.text == '000' + 'approval') this.closeEditing();
          });
      });
    });
  }
}
