import { Component, OnInit, OnDestroy } from '@angular/core';
import { fadeAnimation } from '../../_common/const/animation';
import { FormGroup, FormBuilder, Validators, ValidatorFn, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DialogService, DialogController, MessageBoxButton, MessageBoxStyle } from '../../_common/dialog/dialog.component';
import { LoaderService } from '../../_common/loader/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { apiLink } from '@app/_common/const/apilink'

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  animations: fadeAnimation
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  public thisForm: FormGroup;
  public KVpair: { [key: string]: any } = {
    userPassValidator: [Validators.pattern(/^[a-zA-Z0-9]{6,20}$/i), Validators.required],
    userPassOldSubmitted: false,
    userPassNewSubmitted: false,
    userPassConfirmSubmitted: false,
  };
  transitionState: string = 'in';

  public subscription1: Subscription;
  public subscription2: Subscription;

  constructor(public formBuilder: FormBuilder, public http: HttpClient,
    public router: Router, public jwtHelper: JwtHelperService,
    public dialogService: DialogService,
    public dialog: MatDialog, public loader: LoaderService) {
    this.thisForm = this.formBuilder.group({
      userPassOld: [''],
      userPassNew: ['', this.KVpair['userPassValidator']],
      userPassConfirm: ['', this.KVpair['userPassValidator']]
    }, {
      validator: comparePassword
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {

  }
  get f() {
    return this.thisForm.controls;
  }

  submitForm() {
    if (this.thisForm.controls['userPassOld'].invalid) this.KVpair['userPassOldSubmitted'] = true;
    if (this.thisForm.controls['userPassNew'].invalid) this.KVpair['userPassNewSubmitted'] = true;
    if (this.thisForm.controls['userPassConfirm'].invalid ||
      this.thisForm?.errors?.passwordMisMatch) this.KVpair['userPassConfirmSubmitted'] = true;

    if (this.thisForm.invalid) return;
    let obj: object = {
      userName: extractFromToken('unique_name', this.jwtHelper),
      userPassOld: this.thisForm.get('userPassOld').value,
      userPassNew: this.thisForm.get('userPassNew').value,
      userPassConfirm: this.thisForm.get('userPassConfirm').value
    }

    let data = JSON.stringify(obj);
    this.setEventListenerAfterSubmit();
    this.http.post(apiLink + '/User/ChangePassword', data, httpOptions).subscribe(
      (response) => {
        let result = JSON.parse(JSON.stringify(response));
        let message1 = result['validateResult'];
        let message2 = result['validateMessage'];
        if (['000', '001', '002'].indexOf(message1) >= 0)
          this.dialogService.sendMessage(message1 + 'changepassword', message2);
      },
      (error) => {
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
            if (message.text == '000changepassword') this.logOutAfterSuccess();
          });
      });
    });
  }

  resetValidity(key: string) {
    this.KVpair[key] = false;
  }

  logOutAfterSuccess() {
    sessionStorage.removeItem('jwt');
    this.router.navigate(['./']);
  }
}

export const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

export function extractFromToken(segment: string, jwtHelper: JwtHelperService): string {
  let token = jwtHelper.tokenGetter();
  let decodedInfo = jwtHelper.decodeToken(token);
  return decodedInfo[segment];
}
export const comparePassword: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('userPassNew');
  const repeatPassword = control.get('userPassConfirm');
  return password.value != repeatPassword.value ? { 'passwordMisMatch': true } : null;
};
