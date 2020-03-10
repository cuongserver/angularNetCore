import { Component, OnInit, OnDestroy, Injectable, EventEmitter, Output } from '@angular/core';
import { Subscription, ReplaySubject, Subject } from 'rxjs';
import { LoaderService } from './loader.service';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.css']
})
/** loader component*/
@Injectable({
    providedIn: 'root'
})
export class LoaderComponent implements OnInit, OnDestroy {
  show = false;
  private subscription: Subscription;
  subject: Subject<boolean> = new Subject<boolean>();
  constructor(private loaderService: LoaderService) {

  }

  ngOnInit() {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
        if (state.show == false) this.subject.next();
      });
  }

  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

export interface LoaderState {
  show: boolean;
}
