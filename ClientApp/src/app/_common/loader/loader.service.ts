import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { LoaderState } from './loader.component';

@Injectable({
  providedIn: 'root'
})

export class LoaderService {
  private loaderSubject = new Subject<LoaderState>();
  loaderState = this.loaderSubject.asObservable();
  private loaderSubject2 = new Subject<any>();
  loaderState2 = this.loaderSubject2.asObservable();
  constructor() {

  }
  show() {
    this.loaderSubject.next(<LoaderState>{ show: true });
  }
  hide() {
    setTimeout(() => {
      this.loaderSubject.next(<LoaderState>{ show: false });
      this.loaderSubject2.next();
    }, 750);
  }
}
