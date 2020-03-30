import {
  Component, HostListener,
  Directive, Output, EventEmitter,
  ContentChildren, QueryList, AfterViewInit, AfterViewChecked
} from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RootComponent } from '../app.component';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SubGroupComponent } from './dashboard-side-menu/subgroup.component';
import { SideMenuClosingService } from './dashboard-side-menu/sidemenu.service';
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
  public year: string = new Date().getFullYear().toString();
  public givenName: string;
  public userRole: string;
  public pageLanguage: string;
  public languageDropdownShowed: boolean = false;
  public languageDropdownClick: boolean = false;
  sideMenuOpened: boolean = false;
  @ContentChildren(SubGroupComponent, { descendants: true })
  groups!: QueryList<SubGroupComponent>;
  constructor(public jwtHelper: JwtHelperService,
              public thisTranslate: TranslateService, public router: Router,
              public sideMenuService: SideMenuClosingService) {
    super(thisTranslate);
    let token = this.jwtHelper.tokenGetter();
    let decodedInfo = this.jwtHelper.decodeToken(token);
    this.givenName = decodedInfo.given_name;
    this.userRole = decodedInfo.role;
    this.updateDisplayLanguage();
    this.sideMenuService.getCommand().subscribe(sideMenuState => {
      this.hideMenu();
    });
  }



  public hideLanguageSwitcher(event: EventEmitter<any>) {
    this.languageDropdownShowed = false;
  }
  public toggleLanguageSwitcher(event) {
    var x = this.languageDropdownShowed;
    this.languageDropdownShowed = !x;
    event.stopPropagation();
  }
  public updateDisplayLanguage() {
    this.pageLanguage = this.getCachedLanguage();
  }
  public logOut() {
    sessionStorage.removeItem('jwt');
    this.router.navigate(['./']);
  }
  toggleSideMenu() {
    this.sideMenuOpened = !this.sideMenuOpened;
  }

  public hideMenu() {
    this.sideMenuOpened = false;
  }
}


