import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Subject } from "rxjs";
import { LoaderService } from "../loader-service/loader.service";
import { LoaderState } from "../../loader/loader";


@Injectable()

export class MessageService {
  private message = new Subject<any>();
  constructor(private loaderService: LoaderService) {
  }
  sendMessage(message: string, extraInfo: string, type = 1) {
    //this.loaderService.loaderState.subscribe((state: LoaderState) => {
    //  if (state.show == false) {
        this.message.next({ text: message, extraInfo: extraInfo, type: type });
    //  };
    //});
  }
  getMessage(): Observable<any> {
    return this.message.asObservable();
  }
  clearMessage() {
    this.message.next();
  }

}
