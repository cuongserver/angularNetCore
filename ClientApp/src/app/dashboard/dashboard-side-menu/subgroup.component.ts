import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sub-group',
  templateUrl: './subgroup.component.html',
  styleUrls: ['./sidemenu.component.css']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubGroupComponent {

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
}
