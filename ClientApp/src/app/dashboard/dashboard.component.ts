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
  heroes: any[] = [
    { id: 1, name: 'Superman' },
    { id: 2, name: 'Batman' },
    { id: 5, name: 'BatGirl' },
    { id: 3, name: 'Robin' },
    { id: 4, name: 'Flash' },
    { id: 6, name: 'Aquaman' },
    { id: 7, name: 'Green Lantern' },
    { id: 8, name: 'Shazam' },
    { id: 9, name: 'Thor' },
    { id: 10, name: 'Hulk' },
    { id: 11, name: 'Captain America' },
    { id: 13, name: 'Iron Man' },
  ];

  villains: any[] = [
    { id: 1, name: 'Superman' },
    { id: 2, name: 'Batman' },
    { id: 5, name: 'BatGirl' },
    { id: 3, name: 'Robin' },
    { id: 4, name: 'Flash' },
    { id: 6, name: 'Aquaman' },
    { id: 7, name: 'Green Lantern' },
    { id: 8, name: 'Shazam' },
    { id: 9, name: 'Thor' },
    { id: 10, name: 'Hulk' },
    { id: 11, name: 'Captain America' },
    { id: 13, name: 'Iron Man' },
  ];

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


