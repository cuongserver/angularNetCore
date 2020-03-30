import { Component } from '@angular/core';
import { fadeAnimation } from '../../_common/const/animation';
import { FormGroup, Validators, FormBuilder, ValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DialogService, DialogController, MessageBoxStyle, MessageBoxButton } from '../../_common/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../_common/loader/loader.service';
import { Subscription } from 'rxjs';
import { apiLink, domain } from '@app/_common/const/apilink'
@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.css'],
  animations: fadeAnimation
})
/** add-new-user component*/
export class AddNewUserComponent {
  transitionState: string = 'in';
  public thisForm: FormGroup
  public KVpair: { [key: string]: any } = {
    userNameV: [Validators.pattern(/^[a-zA-Z0-9]{6,20}$/i), Validators.required],
    userFullNameV: [Validators.pattern(/^[a-zA-Z0-9 ]{1,20}$/i), Validators.required],
    userPassV: [Validators.pattern(/^[a-zA-Z0-9]{6,20}$/i), Validators.required],
    userDeptCodeV: [Validators.required],
    userTitleCodeV: [Validators.required],
    userEmailV: [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9._%+-]{2,}[.][A-Za-z]{2,}$/i)],

    userNameS: false,
    userFullNameS: false,
    userPassS: false,
    userPassConfirmS: false,
    userDeptCodeS: false,
    userTitleCodeS: false,
    userEmailS: false,

    userNameDbExist: false
  };

  public subscription1: Subscription;
  public subscription2: Subscription;
  public titleCodeList: string[];
  public deptCodeList: string[];

  constructor(public formBuilder: FormBuilder, public http: HttpClient,
    public router: Router, public jwtHelper: JwtHelperService,
    public dialogService: DialogService,
    public dialog: MatDialog, public loader: LoaderService) {
    this.thisForm = this.formBuilder.group({
      userName: ['', this.KVpair['userNameV']],
      userFullName: ['', this.KVpair['userFullNameV']],
      userPass: ['', this.KVpair['userPassV']],
      userPassConfirm: ['', this.KVpair['userPassV']],
      userDeptCode: ['', this.KVpair['userDeptCodeV']],
      userTitleCode: ['', this.KVpair['userTitleCodeV']],
      userEmail: ['', this.KVpair['userEmailV']],
    }, {
      validator: comparePassword
    });

    this.http.get(apiLink + '/User/TitleAndDeptList').subscribe(
      response => {
        let result = JSON.parse(JSON.stringify(response));
        this.titleCodeList = result['titleCodeList'];
        this.deptCodeList = result['deptCodeList'];
      },
      error => {

      }
    )
  }

  submitForm() {
    let ctls = this.thisForm.controls;
    if (ctls['userName'].invalid) this.KVpair['userName' + 'S'] = true;
    if (ctls['userFullName'].invalid) this.KVpair['userFullName' + 'S'] = true;
    if (ctls['userPass'].invalid) this.KVpair['userPass' + 'S'] = true;
    if (ctls['userPassConfirm'].invalid || this.thisForm?.errors?.passwordMisMatch) this.KVpair['userPassConfirm' + 'S'] = true;
    if (ctls['userDeptCode'].invalid) this.KVpair['userDeptCode' + 'S'] = true;
    if (ctls['userTitleCode'].invalid) this.KVpair['userTitleCode' + 'S'] = true;
    if (ctls['userEmail'].invalid) this.KVpair['userEmail' + 'S'] = true;

    if (this.thisForm.invalid) return;

    let _obj = {
      userName: ctls['userName'].value,
      userFullName: ctls['userFullName'].value,
      userPass: ctls['userPass'].value,
      userPassConfirm: ctls['userPassConfirm'].value,
      userDeptCode: ctls['userDeptCode'].value,
      userTitleCode: ctls['userTitleCode'].value,
      userEmail: ctls['userEmail'].value
    }
    let data = JSON.stringify(_obj);
    this.setEventListenerAfterSubmit();

    this.http.post(apiLink + '/User/AddNewUser', data, httpOptions).subscribe(
      response => {
        let result = JSON.parse(JSON.stringify(response));
        let message1 = result['status'];
        
        if (message1 == '000') {
          this.dialogService.sendMessage('000' + 'addnewuser', ctls['userName'].value);
          this.thisForm.reset();
        }
        if (message1 == '2627') {
          this.subscription1.unsubscribe();
          this.KVpair['userName' + 'S'] = true;
          this.KVpair['userName' + 'DbExist'] = true;
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
          });
      });
    });
  }

  resetValidity(key: string) {
    this.KVpair[key + 'S'] = false;
    if (key == 'userName') this.KVpair[key + 'DbExist'] = false;
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
}
export function extractFromToken(segment: string, jwtHelper: JwtHelperService): string {
  let token = jwtHelper.tokenGetter();
  let decodedInfo = jwtHelper.decodeToken(token);
  return decodedInfo[segment];
}
export const comparePassword: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('userPass');
  const repeatPassword = control.get('userPassConfirm');
  return password.value != repeatPassword.value ? { 'passwordMisMatch': true } : null;
};
export const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}
