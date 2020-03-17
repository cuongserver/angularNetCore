import { Component } from '@angular/core';
import { fadeAnimation } from '../../_common/const/animation';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-list-all-user',
  templateUrl: './list-all-user.component.html',
  styleUrls: ['./list-all-user.component.css'],
  animations: fadeAnimation
})
/** list-all-user component*/
export class ListAllUserComponent {
  transitionState: string = 'in';

/** list-all-user ctor */
  
  constructor(private http: HttpClient) {

  }
}
