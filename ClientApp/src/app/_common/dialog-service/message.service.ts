import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Subject } from "rxjs";


@Injectable()

export class MessageService {
  private message = new Subject<any>();
  constructor() {
  }
  sendMessage(message: string, extraInfo: string, type = 1) {
    this.message.next({ text: message, extraInfo: extraInfo, type: type });
  }
  getMessage(): Observable<any> {
    return this.message.asObservable();
  }
  clearMessage() {
    this.message.next();
  }

}
