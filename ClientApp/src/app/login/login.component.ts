import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppComponent } from 'src/app/app.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Subscription } from "rxjs";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogComponent } from "../dialog/dialog.component";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../_common/dialog-service/message-box";
import { MessageService } from "../_common/dialog-service/message.service";
//import { LoaderState } from '../loader/loader';
//import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css'
  ]
})
/** login component*/

export class LoginComponent extends AppComponent implements OnInit {
  thisForm: FormGroup;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
  subscriber: Subscription;
  constructor(public formBuilder: FormBuilder, translate: TranslateService,
    cookieService: CookieService, http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private dialog: MatDialog) {
    super(translate, cookieService, http);
    this.thisForm = this.formBuilder.group({
      userName: [''],
      userPass: ['']
    });


    this.subscriber = this.messageService.getMessage().subscribe(message => {
      MessageBox.show(this.dialog, message.text, message.extraInfo, '', '', MessageBoxButton.Ok, false, MessageBoxStyle.Simple)
            .subscribe(x => this.dialog.closeAll());
    });
  }

  ngOnInit() {

  }
  login() {
    let obj = {};
    obj['userName'] = this.thisForm.get('userName').value;
    obj['userPass'] = this.thisForm.get('userPass').value;
    let data = JSON.stringify(obj);

    var result, message1, message2;

    this.http.post('/User', data, this.httpOptions).subscribe(
      (response) => {
        setTimeout(() => {
          result = JSON.parse(JSON.stringify(response));
          message1 = result['validateResult'];
          message2 = result['validateMessage'];
          if (message1 === '000') {
            this.router.navigate(['./dashboard']);
          };

          if (message1 === '001' || message1 === '002' || message1 === '003') {
            this.messageService.sendMessage(message1, message2)
          };

          if (['000', '001', '002', '003'].indexOf(message1) < 0) {
            this.messageService.sendMessage('serverError', message1)
          };
        }, 750);
      },

      (error) => alert(JSON.stringify(error))
    );


  }
}

