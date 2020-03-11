import {
  Component, ContentChildren, QueryList,
  AfterContentInit, EventEmitter, forwardRef,
  ElementRef, Renderer2
} from '@angular/core';
import { SubGroupComponent } from './subgroup.component';
import { SideMenuClosingService } from './sidemenu.service';

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
  private el; el2;
  constructor(private elRef: ElementRef, private renderer: Renderer2, private sideMenuService: SideMenuClosingService ) {
  }

  ngAfterContentInit() {
    this.el2 = this.elRef.nativeElement.querySelectorAll('.subgroup-content');
    for (var i = 0; i < this.el2.length; i += 1) {
      this.renderer.listen(this.el2[i], 'click', (event) => {
        let className: string = 'subgroup-content-active';
        this.removeClassForAll(className);
        this.sideMenuService.execute();
        this.renderer.addClass(event.currentTarget, className);
      });
    }
  }

  private removeClassForAll(className: string) {
    for (var i = 0; i < this.el2.length; i += 1) {
        this.renderer.removeClass(this.el2[i], className)
    };
  }

  //  /**
  //* Open an accordion group
  //* param group   Group instance
  //*/
  //showOrHideGroup() {
  //  alert("clicked");
  //}
}
