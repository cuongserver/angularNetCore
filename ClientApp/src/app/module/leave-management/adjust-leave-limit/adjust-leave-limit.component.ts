
import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder, ValidatorFn, ValidationErrors, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DialogService, DialogController, MessageBoxStyle, MessageBoxButton } from '@app/_common/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '@app/_common/loader/loader.service';
import { Subscription } from 'rxjs';
import { LeaveLimitService } from '@app/module/leave-management/leave-limit.service';
import { LeaveBalance, LeaveType, User } from '../leave-limit-summary/leave-limit-summary.component';

@Component({
  selector: 'app-adjust-leave-limit',
  templateUrl: './adjust-leave-limit.component.html',
  styleUrls: ['./adjust-leave-limit.component.css']
})
/** EditUserInfo component*/
export class AdjustLeaveLimitComponent implements OnDestroy {
  /** EditUserInfo ctor */
  //private user: User;
  private index: number;
  private x: Subscription;
  private detail: LeaveBalance;


  private thisForm: FormGroup
  private KVpair: { [key: string]: any } = {
    //userNameV: [Validators.pattern(/^[a-zA-Z0-9]{6,20}$/i), Validators.required],
    //userFullNameV: [Validators.pattern(/^[a-zA-Z0-9 ]{1,20}$/i), Validators.required],
    limitV: [Validators.pattern(/(^[1-9]$|[1-9][0-9]+$|^$)/m)],
    //userDeptCodeV: [Validators.required],
    //userTitleCodeV: [Validators.required],
    //userEmailV: [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9._%+-]{2,}[.][A-Za-z]{2,}$/i)],
    //userFailedLoginCountV: [Validators.required, Validators.pattern(/^([1-9]+\d*)$|^0$/i)],

    //userNameS: false,
    //userFullNameS: false,

    //userDeptCodeS: false,
    //userTitleCodeS: false,
    //userEmailS: false,
    //userFailedLoginCountS: false
    //userNameDbExist: false
  };
  private limitS: boolean[] = []
  private subscription1: Subscription;
  private subscription2: Subscription;
  //private titleCodeList: string[];
  //private deptCodeList: string[];

  constructor(private infoservice: LeaveLimitService, private formBuilder: FormBuilder, private http: HttpClient,
    private router: Router, private jwtHelper: JwtHelperService,
    private dialogService: DialogService,
    private dialog: MatDialog, private loader: LoaderService) {

    this.thisForm = this.formBuilder.group({
      leaveTypes: this.formBuilder.array([])
      //userTitleCode: ['', this.KVpair['userTitleCodeV']],
      //userEmail: ['', this.KVpair['userEmailV']],
      //userEnabled: [''],
      //userFailedLoginCount: ['', this.KVpair['userFailedLoginCountV']]
    }, {

    });


    this.x = this.infoservice.OnOpenAdjustLimitFunction().subscribe(data => {
      //this.http.get('/User/TitleAndDeptList').subscribe(
      //  response => {
      //    let result = JSON.parse(JSON.stringify(response));
      //    this.titleCodeList = result['titleCodeList'];
      //    this.deptCodeList = result['deptCodeList'];
      //  },
      //  error => {
      //  }
      //)

      //this.user = {
      //  userName: data.user.userName,
      //  userFullName: data.user.userFullName,
      //  userDeptCode: data.user.userDeptCode,
      //  userTitleCode: data.user.userTitleCode,
      //  userEmail: data.user.userEmail,
      //  userEnabled: data.user.userEnabled,
      //  userFailedLoginCount: data.user.userFailedLoginCount
      //}
      this.index = data.index;
      this.detail = {
        user: data.detail.user,
        leaveTypes: data.detail.leaveTypes
      }
      this.leaveTypesCollection.clear();
      while (this.limitS.length > 0) this.limitS.pop();

      this.detail.leaveTypes.forEach(x => {
        this.leaveTypesCollection.push(
          this.formBuilder.group({
            leaveCode: [x.leaveCode],
            limit: [x.limit, this.KVpair['limitV']]
          })
        )
        this.limitS.push(false);
      })
      //this.thisForm.controls['userFullName'].setValue(this.user.userFullName);
      //this.thisForm.controls['userDeptCode'].setValue(this.user.userDeptCode);
      //this.thisForm.controls['userTitleCode'].setValue(this.user.userTitleCode);
      //this.thisForm.controls['userEmail'].setValue(this.user.userEmail);
      //this.thisForm.controls['userEnabled'].setValue(this.user.userEnabled);
      //this.thisForm.controls['userFailedLoginCount'].setValue(this.user.userFailedLoginCount);

    })
  }

  get leaveTypesCollection() {
    return this.thisForm.get('leaveTypes') as FormArray;
  }

  resetValidity(key: string, index: string) {
    if(key == 'limit') this.limitS[index] = false;
  }

  submitForm() {
    for (var i = 0; i < this.leaveTypesCollection.length; i += 1) {
      let ctls = this.leaveTypesCollection.controls[i] as FormGroup;
      let ctls2 = ctls.controls;
      if (ctls2['limit']?.errors?.pattern) this.limitS[i] = true;
    }
    if (this.thisForm.invalid) return;

    //let _obj = {
    //  userName: this.user.userName,
    //  userPass: ctls['userPass'].value,
    //  userPassConfirm: ctls['userPassConfirm'].value
    //}

    let user: User = this.detail.user;
    let collection: Array<LeaveType> = new Array<LeaveType>();
    for (var i = 0; i < this.leaveTypesCollection.length; i += 1) {
      let ctls = this.leaveTypesCollection.controls[i] as FormGroup;
      let obj2: LeaveType = {
        leaveCode: ctls.controls['leaveCode'].value,
        limit: ctls.controls['limit'].value,
        balance: ''
      }
      collection.push(obj2);
    }
    let obj: LeaveBalance = {
      user: user,
      leaveTypes: collection
    }






    let data = JSON.stringify(obj);
    this.setEventListenerAfterSubmit();
    this.http.post('/LeaveManagement/AdjustLimit', data, httpOptions).subscribe(
      response => {
        let result = JSON.parse(JSON.stringify(response));
        let message1 = result['status'];

        if (message1 == '000') {
          this.dialogService.sendMessage('000' + 'adjustleavelimit', obj.user.userName);
          this.infoservice.ConfirmAdjustLimitFunction(obj, this.index);
        }

        //if (message1 == '002') {
        //  this.dialogService.sendMessage('002' + 'edituserinfo', _obj.userName);
        //}
      },
      error => {
        this.subscription1.unsubscribe();
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
            this.closeEditing();
          });
      });
    });
  }

  //getModelError(key: string): boolean {
  //  let ctls = this.thisForm.controls;
  //  //if (key == 'userName' + 'Required') return ctls['userName']?.errors?.required && this.KVpair['userName' + 'S']
  //  //if (key == 'userName' + 'Pattern') return !ctls['userName']?.errors?.required && this.KVpair['userName' + 'S'] && ctls['userName']?.errors?.pattern
  //  //if (key == 'userName' + 'DbExist') return !ctls['userName']?.errors?.required && this.KVpair['userName' + 'S']
  //  //  && !ctls['userName']?.errors?.pattern && this.KVpair['userName' + 'DbExist']
  //  //if (key == 'userFullName' + 'Required') return ctls['userFullName']?.errors?.required && this.KVpair['userFullName' + 'S']
  //  //if (key == 'userFullName' + 'Pattern') return !ctls['userFullName']?.errors?.required && this.KVpair['userFullName' + 'S'] && ctls['userFullName']?.errors?.pattern

  //  if (key == 'userPass' + 'Required') return ctls['userPass']?.errors?.required && this.KVpair['userPass' + 'S']
  //  if (key == 'userPass' + 'Pattern') return !ctls['userPass']?.errors?.required && this.KVpair['userPass' + 'S'] && ctls['userPass']?.errors?.pattern

  //  if (key == 'userPassConfirm' + 'Required') return ctls['userPassConfirm']?.errors?.required && this.KVpair['userPassConfirm' + 'S']
  //    && !this.thisForm?.errors?.passwordMisMatch
  //  if (key == 'userPassConfirm' + 'Pattern') return !ctls['userPassConfirm']?.errors?.required && this.KVpair['userPassConfirm' + 'S']
  //    && ctls['userPassConfirm']?.errors?.pattern && !this.thisForm?.errors?.passwordMisMatch
  //  if (key == 'userPassConfirm' + 'Mismatch') return this.KVpair['userPassConfirm' + 'S'] && this.thisForm?.errors?.passwordMisMatch

  //  //if (key == 'userDeptCode' + 'Required') return ctls['userDeptCode']?.errors?.required && this.KVpair['userDeptCode' + 'S']
  //  //if (key == 'userTitleCode' + 'Required') return ctls['userTitleCode']?.errors?.required && this.KVpair['userTitleCode' + 'S']

  //  //if (key == 'userEmail' + 'Required') return ctls['userEmail']?.errors?.required && this.KVpair['userEmail' + 'S']
  //  //if (key == 'userEmail' + 'Pattern') return !ctls['userEmail']?.errors?.required && this.KVpair['userEmail' + 'S'] && ctls['userEmail']?.errors?.pattern

  //  //if (key == 'userFailedLoginCount' + 'Required') return ctls['userFailedLoginCount']?.errors?.required && this.KVpair['userFailedLoginCount' + 'S']
  //  //if (key == 'userFailedLoginCount' + 'Pattern') return !ctls['userFailedLoginCount']?.errors?.required && this.KVpair['userFailedLoginCount' + 'S']
  //  //  && ctls['userFailedLoginCount']?.errors?.pattern

  //}
  getModelError(key: string, index: number) {
    let ctls = this.leaveTypesCollection.controls[index] as FormGroup;
    if (key == 'limit' + 'Pattern') return ctls.controls['limit']?.errors?.pattern && this.limitS[index];
  }


  ngOnDestroy() {
    this.infoservice.CloseAdjustLimitFunction();
    this.x.unsubscribe();
    if (this.subscription1) this.subscription1.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
  }

  closeEditing() {
    this.infoservice.CloseAdjustLimitFunction();
    this.detail = null;

  }
}

export const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}
