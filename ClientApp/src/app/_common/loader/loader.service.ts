import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { LoaderState } from './loader.component';

@Injectable({
  providedIn: 'root'
})

export class LoaderService {
  private loaderSubject = new Subject<LoaderState>();
  loaderState: Observable<any> = this.loaderSubject.asObservable();
  private loaderInactive = new Subject<any>();
  loaderDeactivated: Observable<any> = this.loaderInactive.asObservable();
  constructor() {

  }
  show() {
    this.loaderSubject.next(<LoaderState>{ show: true });
  }
  hide() {
    setTimeout(() => {
      this.loaderSubject.next(<LoaderState>{ show: false });
      this.loaderInactive.next();
    }, 750);
  }
}
