import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RootComponent } from 'src/app/app.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { DialogController, DialogService, MessageBoxButton, MessageBoxStyle } from "../_common/dialog/dialog.component";
import { JwtHelperService } from '@auth0/angular-jwt';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css'
  ],

})
/** login component*/

export class LoginComponent extends RootComponent implements OnInit {
  private thisForm: FormGroup;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
  private KVpair: { [key: string]: any } = {
    userNameValidator: [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6,20}$/i)],
    userPassValidator: [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{1,20}$/i)],
    userNameSubmitted : false,
    userPassSubmitted : false
  };
  private subscriber: Subscription;

  constructor(private formBuilder: FormBuilder, private thisTranslate: TranslateService,
    private http: HttpClient,
    private thisRouter: Router, private jwtHelper: JwtHelperService,
    private dialogService: DialogService,
    private dialog: MatDialog) {
    super(thisTranslate);
    this.thisForm = this.formBuilder.group({
      userName: ['', this.KVpair['userNameValidator']],
      userPass: ['', this.KVpair['userPassValidator']]
    });

    this.subscriber = this.dialogService.getMessage().subscribe(message => {
      DialogController.show(this.dialog, message.text, message.extraInfo, '', '',
                    MessageBoxButton.Ok, false, MessageBoxStyle.Simple)
    });
  }

  ngOnInit() {

  }

  get f() {
    return this.thisForm.controls;
  }

  clearAllValidationError(key:string) {
    this.KVpair[key + 'Submitted'] = false;
  }

  login() {
    this.KVpair['userNameSubmitted'] = true;
    this.KVpair['userPassSubmitted'] = true;
    if (this.thisForm.invalid) return;
    let obj = {};
    obj['userName'] = this.thisForm.get('userName').value;
    obj['userPass'] = this.thisForm.get('userPass').value;
    let data = JSON.stringify(obj);
    var result, message1, message2;

    this.http.post('/User/Login', data, this.httpOptions).subscribe(
      (response) => {
        setTimeout(() => {
          result = JSON.parse(JSON.stringify(response));
          message1 = result['validateResult'];
          message2 = result['validateMessage'];
          if (message1 === '000') {
            let token = result['securityToken'];
            sessionStorage.setItem("jwt", token);
            this.thisRouter.navigate(['./dashboard']);
            this.subscriber.unsubscribe();
          };

          if (message1 === '001' || message1 === '002' || message1 === '003') {
            this.dialogService.sendMessage(message1, message2)
          };

          if (['000', '001', '002', '003'].indexOf(message1) < 0) {
            this.dialogService.sendMessage('serverError', message1)
          };
        }, 750);
      },
      (error) => {
        console.log(JSON.stringify(error));
        setTimeout(() => {
          this.dialogService.sendMessage('serverError', '');
        }, 750);
      }
    );
  }
}
