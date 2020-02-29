import { Component, ViewEncapsulation } from '@angular/core';
//import { Router } from '@angular/router';
//import { TranslateService } from '@ngx-translate/core';

import { HttpClient } from '@angular/common/http';
import { AppComponent } from 'src/app/app.component';

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
export class LoginComponent extends AppComponent {
  login() {
    let form: FormData = new FormData();
  }
}
