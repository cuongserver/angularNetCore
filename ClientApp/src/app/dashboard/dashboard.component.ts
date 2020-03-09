import { Component, HostListener, Directive, Output, EventEmitter } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RootComponent } from '../app.component';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
@Directive(
  {
    selector: '[appRootElement]'
  }
)
export class HideDropDownWhenClickAwayDirective {
  @Output() hideDropDown: EventEmitter<any> = new EventEmitter();
  @HostListener('click', ['$event.target'])
  closeDropDown() {
    this.hideDropDown.emit();
  }
}


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: [
      './dashboard.component.css'
    ]
})
/** dashboard component*/
export class DashboardComponent extends RootComponent {
  private year: string = new Date().getFullYear().toString();
  private givenName: string;
  private pageLanguage: string;
  private languageDropdownShowed: boolean = false;
  private languageDropdownClick: boolean = false;
  private sideMenuOpened: boolean = false;
  constructor(private jwtHelper: JwtHelperService, private thisTranslate: TranslateService, private router: Router) {
    super(thisTranslate);
    let token = this.jwtHelper.tokenGetter();
    let decodedInfo = this.jwtHelper.decodeToken(token);
    this.givenName = decodedInfo.given_name;
    this.updateDisplayLanguage();
  }

  private hideLanguageSwitcher(event: EventEmitter<any>) {
    this.languageDropdownShowed = false;
  }
  private toggleLanguageSwitcher(event) {
    var x = this.languageDropdownShowed;
    this.languageDropdownShowed = !x;
    event.stopPropagation();
  }
  private updateDisplayLanguage() {
    this.pageLanguage = this.getCachedLanguage();
  }
  private logOut() {
    sessionStorage.removeItem('jwt');
    this.router.navigate(['./']);
  }
  private toggleSideMenu() {
    this.sideMenuOpened = !this.sideMenuOpened;
  }
}


