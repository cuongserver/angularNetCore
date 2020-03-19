import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {User} from'../list-all-user.component'
import { UserInfoService } from '../user-info.service';
import { FormGroup, Validators, FormBuilder, ValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DialogService, DialogController, MessageBoxStyle, MessageBoxButton } from '../../../_common/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../../_common/loader/loader.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-edit-user-info',
    templateUrl: './edit-user-info.component.html',
    styleUrls: ['./edit-user-info.component.css']
})
/** EditUserInfo component*/
export class EditUserInfoComponent implements OnDestroy{
/** EditUserInfo ctor */
  private user: User;
  private index: number;
  private x: Subscription;

  private thisForm: FormGroup
  private KVpair: { [key: string]: any } = {
    //userNameV: [Validators.pattern(/^[a-zA-Z0-9]{6,20}$/i), Validators.required],
    userFullNameV: [Validators.pattern(/^[a-zA-Z0-9 ]{1,20}$/i), Validators.required],
    //userPassV: [Validators.pattern(/^[a-zA-Z0-9]{6,20}$/i), Validators.required],
    userDeptCodeV: [Validators.required],
    userTitleCodeV: [Validators.required],
    userEmailV: [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9._%+-]{2,}[.][A-Za-z]{2,}$/i)],

    userNameS: false,
    userFullNameS: false,
    //userPassS: false,
    //userPassConfirmS: false,
    userDeptCodeS: false,
    userTitleCodeS: false,
    userEmailS: false,

    //userNameDbExist: false
  };
  private subscription1: Subscription;
  private subscription2: Subscription;
  private titleCodeList: string[];
  private deptCodeList: string[];

  constructor(private infoservice: UserInfoService, private formBuilder: FormBuilder, private http: HttpClient,
    private router: Router, private jwtHelper: JwtHelperService,
    private dialogService: DialogService,
    private dialog: MatDialog, private loader: LoaderService) {

    this.thisForm = this.formBuilder.group({
      userFullName: ['', this.KVpair['userFullNameV']],
      userDeptCode: ['', this.KVpair['userDeptCodeV']],
      userTitleCode: ['', this.KVpair['userTitleCodeV']],
      userEmail: ['', this.KVpair['userEmailV']],
      userEnabled: [''],
      userFailedLoginCount: ['']
    });

    this.x = this.infoservice.getOpenMessage().subscribe(data => {
      this.http.get('/User/TitleAndDeptList').subscribe(
        response => {
          let result = JSON.parse(JSON.stringify(response));
          this.titleCodeList = result['titleCodeList'];
          this.deptCodeList = result['deptCodeList'];
        },
        error => {
        }
      )

      this.user = {
        userName: data.user.userName,
        userFullName: data.user.userFullName,
        userDeptCode: data.user.userDeptCode,
        userTitleCode: data.user.userTitleCode,
        userEmail: data.user.userEmail,
        userEnabled: data.user.userEnabled,
        userFailedLoginCount: data.user.userFailedLoginCount
      }
      this.index = data.index;
      this.thisForm.controls['userEnabled'].setValue(this.user.userEnabled);
    })
  }

  resetValidity(key: string) {
    this.KVpair[key + 'S'] = false;
    if (key == 'userName') this.KVpair[key + 'DbExist'] = false;
  }

  submitForm() {

  }

   
  getModelError(key: string): boolean {
    let ctls = this.thisForm.controls;
    if (key == 'userName' + 'Required') return ctls['userName']?.errors?.required && this.KVpair['userName' + 'S']
    if (key == 'userName' + 'Pattern') return !ctls['userName']?.errors?.required && this.KVpair['userName' + 'S'] && ctls['userName']?.errors?.pattern
    if (key == 'userName' + 'DbExist') return !ctls['userName']?.errors?.required && this.KVpair['userName' + 'S']
      && !ctls['userName']?.errors?.pattern && this.KVpair['userName' + 'DbExist']
    if (key == 'userFullName' + 'Required') return ctls['userFullName']?.errors?.required && this.KVpair['userFullName' + 'S']
    if (key == 'userFullName' + 'Pattern') return !ctls['userFullName']?.errors?.required && this.KVpair['userFullName' + 'S'] && ctls['userFullName']?.errors?.pattern

    if (key == 'userPass' + 'Required') return ctls['userPass']?.errors?.required && this.KVpair['userPass' + 'S']
    if (key == 'userPass' + 'Pattern') return !ctls['userPass']?.errors?.required && this.KVpair['userPass' + 'S'] && ctls['userPass']?.errors?.pattern

    if (key == 'userPassConfirm' + 'Required') return ctls['userPassConfirm']?.errors?.required && this.KVpair['userPassConfirm' + 'S']
      && !this.thisForm?.errors?.passwordMisMatch
    if (key == 'userPassConfirm' + 'Pattern') return !ctls['userPassConfirm']?.errors?.required && this.KVpair['userPassConfirm' + 'S']
      && ctls['userPassConfirm']?.errors?.pattern && !this.thisForm?.errors?.passwordMisMatch
    if (key == 'userPassConfirm' + 'Mismatch') return this.KVpair['userPassConfirm' + 'S'] && this.thisForm?.errors?.passwordMisMatch

    if (key == 'userDeptCode' + 'Required') return ctls['userDeptCode']?.errors?.required && this.KVpair['userDeptCode' + 'S']
    if (key == 'userTitleCode' + 'Required') return ctls['userTitleCode']?.errors?.required && this.KVpair['userTitleCode' + 'S']

    if (key == 'userEmail' + 'Required') return ctls['userEmail']?.errors?.required && this.KVpair['userEmail' + 'S']
    if (key == 'userEmail' + 'Pattern') return !ctls['userEmail']?.errors?.required && this.KVpair['userEmail' + 'S'] && ctls['userEmail']?.errors?.pattern
  }


  ngOnDestroy() {
    this.infoservice.sendCloseCommand();
    this.x.unsubscribe();

  }
  closeEditing() {
    this.infoservice.sendCloseCommand();
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
