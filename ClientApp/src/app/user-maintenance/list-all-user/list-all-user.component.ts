import { Component } from '@angular/core';
import { fadeAnimation } from '../../_common/const/animation';
@Component({
  selector: 'app-list-all-user',
  templateUrl: './list-all-user.component.html',
  styleUrls: ['./list-all-user.component.scss'],
  animations: fadeAnimation
})
/** list-all-user component*/
export class ListAllUserComponent {
  transitionState: string = 'in';

  /** list-all-user ctor */
  constructor() {

  }
}
