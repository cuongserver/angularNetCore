import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css',
    '../util.css',
    '../font/fontawesome-free-5.12.1-web/css/all.min.css',
    '../font/montserrat/montserrat.css',
    '../font/text-security/text-security.min.css',
],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  constructor(public http: HttpClient, public router: Router) {
  }

  ngOnInit() {
    //this.router.navigate(['']);
  }

}

export class RootComponent {
  public _defaultLanguage: string;
  protected langOptions: string[] = (['vi', 'en']);
  constructor(public translate: TranslateService) {
    this._defaultLanguage = this.getCachedLanguage();
    translate.setDefaultLang(this._defaultLanguage);
    localStorage.setItem("pageLanguage", this._defaultLanguage);
  }

  switchToLanguage(language: string) {
    let newLang: string;
    newLang = this.langOptions.includes(language) ? language : this._defaultLanguage;
    this.translate.use(newLang);
    localStorage.setItem("pageLanguage", newLang);
  }

  getCachedLanguage() {
    let cachedLang = localStorage.getItem('pageLanguage');
    return this.langOptions.includes(cachedLang) && cachedLang !== null ? cachedLang : 'vi';
  }
}
