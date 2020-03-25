import { Component, OnDestroy } from '@angular/core';
import * as res from '@app/module/system-setting/module-resource';
import { Observable, Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-user-leave-application',
  templateUrl: './user-leave-application.component.html',
  styleUrls: ['./user-leave-application.component.css'],
  animations: res.fadeAnimation
})
/** user-leave-application component*/
export class UserLeaveApplicationComponent implements OnDestroy {
  private transitionState: string = 'in';
  private dataLoading = new Subject<any>();
  private subscription1: Subscription; private subscription2: Subscription;
  private subscription3: Subscription; private subscription4: Subscription;
  constructor(private http: HttpClient) {

  }

  ngOnDestroy() {

  }

}
