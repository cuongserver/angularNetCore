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
      MessageBox.show(this.dialog, message.text,'','',MessageBoxButton.OkCancel,false,MessageBoxStyle.Simple);
    });
  }

  ngOnInit() {

  }
  login() {
    let obj = {};
    obj['userName'] = this.thisForm.get('userName').value;
    obj['userPass'] = this.thisForm.get('userPass').value;
    let data = JSON.stringify(obj);

    var result;

    this.http.post('/User', data, this.httpOptions).subscribe(
      (response) => {
        result = JSON.parse(JSON.stringify(response));
        if (result['validateResult'] === '000') this.router.navigate(['./dashboard']);
        if (result['validateResult'] != '000') this.messageService.sendMessage(result['validateResult']);
      },

      (error) => alert(JSON.stringify(error))
    );


  }
}

