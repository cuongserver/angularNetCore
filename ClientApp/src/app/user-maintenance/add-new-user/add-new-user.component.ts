import { Component } from '@angular/core';
import { fadeAnimation } from '../../_common/const/animation';
import { FormGroup, Validators, FormBuilder, ValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DialogService } from '../../_common/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../_common/loader/loader.service';
@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.scss'],
  animations: fadeAnimation
})
/** add-new-user component*/
export class AddNewUserComponent {
  transitionState: string = 'in';
  private thisForm: FormGroup
  private KVpair: { [key: string]: any } = {
    userNameV: [Validators.pattern(/^[a-zA-Z0-9]{6,20}$/i), Validators.required],
    userFullNameV: [Validators.pattern(/^[a-zA-Z0-9]{1,20}$/i), Validators.required],
    userPassV: [Validators.pattern(/^[a-zA-Z0-9]{6,20}$/i), Validators.required],
    userDeptCodeV: [Validators.required],
    userTitleCodeV: [Validators.required],
    userEmailV: [Validators.email, Validators.required],

    userNameS: false,
    userFullNameS: false,
    userPassS: false,
    userPassConfirmS: false,
    userDeptCodeS: false,
    userTitleCodeS: false,
    userEmailS: false
  };
  constructor(private formBuilder: FormBuilder, private http: HttpClient,
    private router: Router, private jwtHelper: JwtHelperService,
    private dialogService: DialogService,
    private dialog: MatDialog, private loader: LoaderService) {
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
  }

  submitForm() {

  }

  resetValidity(key: string) {
    this.KVpair[key + 'S'] = false;
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
