import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RootComponent } from '@app/app.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Subscription, Observable } from "rxjs";
import { take } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { DialogController, DialogService, MessageBoxButton, MessageBoxStyle } from "../_common/dialog/dialog.component";
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoaderComponent } from '../_common/loader/loader.component';
import { LoaderService } from '../_common/loader/loader.service';
import { LoaderInterceptorService } from '../_common/loader/loaderinterceptor.service';
import { apiLink } from '@app/_common/const/apilink'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css'
  ],

})
/** login component*/

export class LoginComponent extends RootComponent implements OnInit {
  thisForm: FormGroup;
  public httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
  KVpair: { [key: string]: any } = {
    userNameValidator: [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6,20}$/i)],
    userPassValidator: [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{1,20}$/i)],
    userNameSubmitted : false,
    userPassSubmitted : false
  };
  public subscriber: Subscription;
  public subscriber2: Subscription;

  constructor(public formBuilder: FormBuilder, public thisTranslate: TranslateService,
    public http: HttpClient,
    public thisRouter: Router, public jwtHelper: JwtHelperService,
    public dialogService: DialogService,
    public dialog: MatDialog, public loader: LoaderService) {
    super(thisTranslate);
    this.thisForm = this.formBuilder.group({
      userName: ['', this.KVpair['userNameValidator']],
      userPass: ['', this.KVpair['userPassValidator']]
    });
    
  }

  ngOnInit(): void {

  }

  subscribeAfterLogin(): void {
    this.subscriber = this.dialogService.getMessage().subscribe(message => {
      this.subscriber2 = this.loader.loaderDeactivated.subscribe(() => {
        var x = DialogController.show(this.dialog, message.text, message.extraInfo, '', '',
          MessageBoxButton.Ok, false, MessageBoxStyle.Simple).subscribe(result => {
            this.subscriber.unsubscribe();
            this.subscriber2.unsubscribe();
          }); 
      });
    });
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
    this.KVpair['userNameSubmitted'] = false;
    this.KVpair['userPassSubmitted'] = false;
    let obj = {};
    obj['userName'] = this.thisForm.get('userName').value;
    obj['userPass'] = this.thisForm.get('userPass').value;
    let data = JSON.stringify(obj);
    var result, message1, message2;
    this.subscribeAfterLogin();
    
    this.http.post(apiLink + '/User/Login', data, this.httpOptions).subscribe(
      (response) => {
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
            this.dialogService.sendMessage('dbError', message1)
          };
      },
      (error) => {
        this.subscriber.unsubscribe();
      }
    );
  }
}
