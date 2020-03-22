import { Component } from '@angular/core';
import * as res from '@app/module/system-setting/module-resource';

@Component({
  selector: 'app-public-holiday-list',
  templateUrl: './public-holiday-list.component.html',
  styleUrls: ['./public-holiday-list.component.css'],
  animations: res.fadeAnimation
})
/** PublicHolidayList component*/
export class PublicHolidayListComponent {
  private transitionState: string = 'in';

}
