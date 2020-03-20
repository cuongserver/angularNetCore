
import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../list-all-user.component'
import { UserInfoService } from '../user-info.service';
import { FormGroup, Validators, FormBuilder, ValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DialogService, DialogController, MessageBoxStyle, MessageBoxButton } from '../../../_common/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../../_common/loader/loader.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-change-user-password',
    templateUrl: './change-user-password.component.html',
    styleUrls: ['./change-user-password.component.css']
})
/** EditUserInfo component*/
export class ChangeUserPasswordComponent implements OnDestroy {
  /** EditUserInfo ctor */
  private user: User;
  private index: number;
  private x: Subscription;

  private thisForm: FormGroup
  private KVpair: { [key: string]: any } = {
    //userNameV: [Validators.pattern(/^[a-zA-Z0-9]{6,20}$/i), Validators.required],
    //userFullNameV: [Validators.pattern(/^[a-zA-Z0-9 ]{1,20}$/i), Validators.required],
    userPassV: [Validators.pattern(/^[a-zA-Z0-9]{6,20}$/i), Validators.required],
    //userDeptCodeV: [Validators.required],
    //userTitleCodeV: [Validators.required],
    //userEmailV: [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9._%+-]{2,}[.][A-Za-z]{2,}$/i)],
    //userFailedLoginCountV: [Validators.required, Validators.pattern(/^([1-9]+\d*)$|^0$/i)],

    //userNameS: false,
    //userFullNameS: false,
    userPassS: false,
    userPassConfirmS: false,
    //userDeptCodeS: false,
    //userTitleCodeS: false,
    //userEmailS: false,
    //userFailedLoginCountS: false
    //userNameDbExist: false
  };
  private subscription1: Subscription;
  private subscription2: Subscription;
  //private titleCodeList: string[];
  //private deptCodeList: string[];

  constructor(private infoservice: UserInfoService, private formBuilder: FormBuilder, private http: HttpClient,
    private router: Router, private jwtHelper: JwtHelperService,
    private dialogService: DialogService,
    private dialog: MatDialog, private loader: LoaderService) {

    this.thisForm = this.formBuilder.group({
      userPass: ['', this.KVpair['userPassV']],
      userPassConfirm: ['', this.KVpair['userPassV']],
      //userTitleCode: ['', this.KVpair['userTitleCodeV']],
      //userEmail: ['', this.KVpair['userEmailV']],
      //userEnabled: [''],
      //userFailedLoginCount: ['', this.KVpair['userFailedLoginCountV']]
    }, {
        validator: comparePassword
    });

    this.x = this.infoservice.OnOpenResetPasswordFunction().subscribe(data => {
      //this.http.get('/User/TitleAndDeptList').subscribe(
      //  response => {
      //    let result = JSON.parse(JSON.stringify(response));
      //    this.titleCodeList = result['titleCodeList'];
      //    this.deptCodeList = result['deptCodeList'];
      //  },
      //  error => {
      //  }
      //)

      this.user = {
        userName: data.user.userName,
        userFullName: data.user.userFullName,
        userDeptCode: data.user.userDeptCode,
        userTitleCode: data.user.userTitleCode,
        userEmail: data.user.userEmail,
        userEnabled: data.user.userEnabled,
        userFailedLoginCount: data.user.userFailedLoginCount
      }
      //this.index = data.index;
      //this.thisForm.controls['userFullName'].setValue(this.user.userFullName);
      //this.thisForm.controls['userDeptCode'].setValue(this.user.userDeptCode);
      //this.thisForm.controls['userTitleCode'].setValue(this.user.userTitleCode);
      //this.thisForm.controls['userEmail'].setValue(this.user.userEmail);
      //this.thisForm.controls['userEnabled'].setValue(this.user.userEnabled);
      //this.thisForm.controls['userFailedLoginCount'].setValue(this.user.userFailedLoginCount);

    })
  }

  resetValidity(key: string) {
    this.KVpair[key + 'S'] = false;
    if (key == 'userName') this.KVpair[key + 'DbExist'] = false;
  }

  submitForm() {
    let ctls = this.thisForm.controls;
    if (ctls['userPass'].invalid) this.KVpair['userPass' + 'S'] = true;
    if (ctls['userPassConfirm'].invalid || this.thisForm?.errors?.passwordMisMatch) this.KVpair['userPassConfirm' + 'S'] = true;
    //if (ctls['userTitleCode'].invalid) this.KVpair['userTitleCode' + 'S'] = true;
    //if (ctls['userEmail'].invalid) this.KVpair['userEmail' + 'S'] = true;
    //if (ctls['userFailedLoginCount'].invalid) this.KVpair['userFailedLoginCount' + 'S'] = true;
    if (this.thisForm.invalid) return;

    let _obj = {
      userName: this.user.userName,
      userPass: ctls['userPass'].value,
      userPassConfirm: ctls['userPassConfirm'].value
    }

    //this.user = {
    //  userName: _obj.userName,
    //  userFullName: _obj.userFullName,
    //  userDeptCode: _obj.userDeptCode,
    //  userTitleCode: _obj.userTitleCode,
    //  userEmail: _obj.userEmail,
    //  userEnabled: _obj.userEnabled,
    //  userFailedLoginCount: _obj.userFailedLoginCount
    //}

    let data = JSON.stringify(_obj);
    this.setEventListenerAfterSubmit();
    this.http.post('/User/ResetPassword', data, httpOptions).subscribe(
      response => {
        let result = JSON.parse(JSON.stringify(response));
        let message1 = result['status'];

        if (message1 == '000') {
          this.dialogService.sendMessage('000' + 'resetpassword', _obj.userName);
        }
        if (message1 == '002') {
          this.dialogService.sendMessage('002' + 'edituserinfo', _obj.userName);
        }
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

  getModelError(key: string): boolean {
    let ctls = this.thisForm.controls;
    //if (key == 'userName' + 'Required') return ctls['userName']?.errors?.required && this.KVpair['userName' + 'S']
    //if (key == 'userName' + 'Pattern') return !ctls['userName']?.errors?.required && this.KVpair['userName' + 'S'] && ctls['userName']?.errors?.pattern
    //if (key == 'userName' + 'DbExist') return !ctls['userName']?.errors?.required && this.KVpair['userName' + 'S']
    //  && !ctls['userName']?.errors?.pattern && this.KVpair['userName' + 'DbExist']
    //if (key == 'userFullName' + 'Required') return ctls['userFullName']?.errors?.required && this.KVpair['userFullName' + 'S']
    //if (key == 'userFullName' + 'Pattern') return !ctls['userFullName']?.errors?.required && this.KVpair['userFullName' + 'S'] && ctls['userFullName']?.errors?.pattern

    if (key == 'userPass' + 'Required') return ctls['userPass']?.errors?.required && this.KVpair['userPass' + 'S']
    if (key == 'userPass' + 'Pattern') return !ctls['userPass']?.errors?.required && this.KVpair['userPass' + 'S'] && ctls['userPass']?.errors?.pattern

    if (key == 'userPassConfirm' + 'Required') return ctls['userPassConfirm']?.errors?.required && this.KVpair['userPassConfirm' + 'S']
      && !this.thisForm?.errors?.passwordMisMatch
    if (key == 'userPassConfirm' + 'Pattern') return !ctls['userPassConfirm']?.errors?.required && this.KVpair['userPassConfirm' + 'S']
      && ctls['userPassConfirm']?.errors?.pattern && !this.thisForm?.errors?.passwordMisMatch
    if (key == 'userPassConfirm' + 'Mismatch') return this.KVpair['userPassConfirm' + 'S'] && this.thisForm?.errors?.passwordMisMatch

    //if (key == 'userDeptCode' + 'Required') return ctls['userDeptCode']?.errors?.required && this.KVpair['userDeptCode' + 'S']
    //if (key == 'userTitleCode' + 'Required') return ctls['userTitleCode']?.errors?.required && this.KVpair['userTitleCode' + 'S']

    //if (key == 'userEmail' + 'Required') return ctls['userEmail']?.errors?.required && this.KVpair['userEmail' + 'S']
    //if (key == 'userEmail' + 'Pattern') return !ctls['userEmail']?.errors?.required && this.KVpair['userEmail' + 'S'] && ctls['userEmail']?.errors?.pattern

    //if (key == 'userFailedLoginCount' + 'Required') return ctls['userFailedLoginCount']?.errors?.required && this.KVpair['userFailedLoginCount' + 'S']
    //if (key == 'userFailedLoginCount' + 'Pattern') return !ctls['userFailedLoginCount']?.errors?.required && this.KVpair['userFailedLoginCount' + 'S']
    //  && ctls['userFailedLoginCount']?.errors?.pattern

  }


  ngOnDestroy() {
    this.infoservice.CloseResetPasswordFunction();
    this.x.unsubscribe();
    if (this.subscription1) this.subscription1.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();

  }
  closeEditing() {
    this.infoservice.CloseResetPasswordFunction();
    this.user = null;

  }
}

export const comparePassword: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('userPass');
  const repeatPassword = control.get('userPassConfirm');
  return password.value != repeatPassword.value ? { 'passwordMisMatch': true } : null;
};
export const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}
