import {
  Directive, Component, Input, Output, EventEmitter,
  ElementRef, AfterContentInit, Renderer2, OnChanges, SimpleChanges,
  OnDestroy
} from '@angular/core';
import { SideMenuClosingService } from './sidemenu.service';



@Component({
  selector: 'sub-group',
  templateUrl: './subgroup.component.html',
  styleUrls: ['./sidemenu.component.css']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubGroupComponent implements AfterContentInit, OnDestroy {

  private height;
  private el; el2;
  private func: Function;
  /**
   * If the panel is opened or closed
   */
  @Input() opened = false;
  /**
   * Text to display in the group title bar
   */
  @Input() header: string;

  /**
   * Emitted when user clicks on group titlebar
   * type: {EventEmitter<any>}
   */
  @Output() toggle: EventEmitter<any> = new EventEmitter<any>();
  @Output() sideMenuItemClick: EventEmitter<any> = new EventEmitter<any>();
  constructor(private renderer: Renderer2, private elRef: ElementRef, private sideMenuService: SideMenuClosingService) {
  }
  ngAfterContentInit() {
    this.el = this.elRef.nativeElement.querySelector('.subgroup-content-container');
    this.height = this.el.offsetHeight;
    this.renderer.setStyle(this.el, 'max-height', '0' + 'px');
    this.toggle.subscribe(() => {
      this.opened = !this.opened;
      if (!this.opened) {
        this.renderer.setStyle(this.el, 'max-height', '0' + 'px');
      }
      else {
        this.renderer.setStyle(this.el, 'max-height', this.height + 'px');
      }
    });

    //this.el2 = this.elRef.nativeElement.querySelectorAll('.subgroup-content');
    //for (var i = 0; i < this.el2.length; i += 1) {
    //  this.renderer.listen(this.el2[i], 'click', event => {
    //    this.sideMenuService.execute();
    //  });
    //}
  }
  ngOnDestroy() {

  }
  

}
