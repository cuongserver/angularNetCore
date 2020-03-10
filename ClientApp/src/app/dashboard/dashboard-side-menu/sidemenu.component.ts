import { Component, ContentChildren, QueryList, AfterContentInit, EventEmitter, forwardRef } from '@angular/core';
import { SubGroupComponent } from './subgroup.component';

@Component({
    selector: 'app-side-menu',
    templateUrl: './sidemenu.component.html',
    styleUrls: ['./sidemenu.component.css']
})
/** dashboard-side-menu component*/
export class SideMenuComponent implements AfterContentInit{
  //@ContentChildren(SubGroupComponent, {descendants: true})
  //groups: QueryList<SubGroupComponent>;
  ///**
  // * Invoked when all children (groups) are ready
  // */
  ngAfterContentInit() {
    //this.groups.toArray().forEach((t) => {
    //  t.sideMenuItemClick.subscribe(() => {
    //    this.showOrHideGroup();
    //  });
    //});
  }
  //  /**
  //* Open an accordion group
  //* param group   Group instance
  //*/
  //showOrHideGroup() {
  //  alert("clicked");
  //}
}
