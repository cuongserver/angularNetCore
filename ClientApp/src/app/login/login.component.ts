import { Component, ViewEncapsulation, OnInit } from '@angular/core';
//import { Router } from '@angular/router';
//import { TranslateService } from '@ngx-translate/core';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppComponent } from 'src/app/app.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    '../../font/fontawesome-free-5.12.1-web/css/all.css',
    './login.component.css',
    '../../font/montserrat/montserrat.css'
  ]
})
/** login component*/

export class LoginComponent extends AppComponent implements OnInit {
  userName: string;
  userPass: string;
  thisForm: FormGroup;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(public formBuilder: FormBuilder, translate: TranslateService,
           cookieService: CookieService,  http: HttpClient ) {
    super(translate, cookieService, http);
    this.thisForm = this.formBuilder.group({
      userName: [''],
      userPass: ['']
    });
  }

  ngOnInit() {

  }
  login() {
    let obj = {};
    obj['userName'] = this.thisForm.get('userName').value;
    obj['userPass'] = this.thisForm.get('userPass').value;
    let data = JSON.stringify(obj);


    this.http.post('/User', data, this.httpOptions).subscribe(
      (response) => alert(JSON.stringify(response)),
      (error) => alert(JSON.stringify(error))
    );
  }
}

