import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from "rxjs";
@Injectable()
export class SideMenuClosingService {
  private sideMenuState = new Subject <any>();
  constructor() {

  }
  execute() {
    this.sideMenuState.next();
  }
  getCommand(): Observable<any> {
    return this.sideMenuState.asObservable();
  }
}

