import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css',
    '../util.css',
    '../font/fontawesome-free-5.12.1-web/css/all.css',
    '../font/montserrat/montserrat.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  private _defaultLanguage: string;
  private langOptions: string[] = (['vi', 'en']);
  constructor(private translate: TranslateService, private cookieService: CookieService, public http: HttpClient) {
    this._defaultLanguage = this.cookieService.check('pageLanguage') ? this.cookieService.get('pageLanguage') : 'vi';
    translate.setDefaultLang(this._defaultLanguage);
  }

  private switchToLanguage(language: string) {
    let newLang: string;
    newLang = this.langOptions.includes(language) ? language : this._defaultLanguage;
    this.translate.use(newLang);
    this.cookieService.set('pageLanguage', newLang, 99999);
  }
}
