import { Component, OnInit, OnDestroy, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
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
  constructor(private loaderService: LoaderService) {

  }

  ngOnInit() {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

export interface LoaderState {
  show: boolean;
}
