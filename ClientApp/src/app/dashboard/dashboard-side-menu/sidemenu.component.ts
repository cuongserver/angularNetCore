import { Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { SubGroupComponent } from './subgroup.component';

@Component({
    selector: 'app-side-menu',
    templateUrl: './sidemenu.component.html',
    styleUrls: ['./sidemenu.component.css']
})
/** dashboard-side-menu component*/
export class SideMenuComponent implements AfterContentInit{
  @ContentChildren(SubGroupComponent)
  groups: QueryList<SubGroupComponent>;

  /**
   * Invoked when all children (groups) are ready
   */
  ngAfterContentInit() {
    this.groups.toArray()[0].opened = true;
    console.log("k");
    this.groups.toArray().forEach((t) => {
      t.toggle.subscribe(() => {
        this.openGroup(t);
      });
    });
  }
    /**
  * Open an accordion group
  * param group   Group instance
  */
  openGroup(group: SubGroupComponent) {
    // close other groups
    // open current group
    group.opened = !group.opened;
  }
}
