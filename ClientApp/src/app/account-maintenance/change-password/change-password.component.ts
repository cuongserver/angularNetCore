import { Component, OnInit, OnDestroy } from '@angular/core';
import { fadeAnimation } from '../../_common/const/animation';
import { FormGroup, FormBuilder, Validators, ValidatorFn, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DialogService } from '../../_common/dialog/dialog.component';
import { LoaderService } from '../../_common/loader/loader.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  animations: fadeAnimation
})

export class ChangePasswordComponent implements OnInit, OnDestroy {
  private thisForm: FormGroup;
  private KVpair: { [key: string]: any } = {
    userPassValidator: [Validators.pattern(/^[a-zA-Z0-9]{6,20}$/i), Validators.required],
    userPassOldSubmitted: false,
    userPassNewSubmitted: false,
    userPassConfirmSubmitted: false,
  };
  transitionState: string = 'in';
  constructor(private formBuilder: FormBuilder, private http: HttpClient,
    private thisRouter: Router, private jwtHelper: JwtHelperService,
    private dialogService: DialogService,
    private dialog: MatDialog, private loader: LoaderService) {
    this.thisForm = this.formBuilder.group({
      userPassOld: ['', this.KVpair['userPassValidator']],
      userPassNew: ['', this.KVpair['userPassValidator']],
      userPassConfirm: ['', this.KVpair['userPassValidator']]
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
    console.log("xxx");
    if (this.thisForm.controls['userPassOld'].invalid) this.KVpair['userPassOldSubmitted'] = true;
    if (this.thisForm.controls['userPassNew'].invalid) this.KVpair['userPassNewSubmitted'] = true;
    if (this.thisForm.controls['userPassConfirm'].invalid) this.KVpair['userPassConfirmSubmitted'] = true;
  }

  resetValidity(key: string) {
    this.KVpair[key] = false;
  }
}
//export const comparePassword: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
//  const password = control.get('userPassNew');
//  const repeatPassword = control.get('userPassConfirm');
//  return password.value != repeatPassword.value ? { 'passwordMisMatch': true } : null;
//};
