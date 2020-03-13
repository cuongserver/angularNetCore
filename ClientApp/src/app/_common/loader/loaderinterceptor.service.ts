import { Injectable, Injector, Output, EventEmitter } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoaderService } from './loader.service';
import { DialogController, DialogService, MessageBoxButton, MessageBoxStyle } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptorService implements HttpInterceptor {
  constructor(private loaderService: LoaderService, private dialogService: DialogService, private dialog: MatDialog) {

  }
  
  //intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //  this.showLoader();
  //  let x: Observable<HttpEvent<any>>;
  //  x = next.handle(req)
  //    .pipe(
  //    tap(
  //      (event: HttpEvent<any>) => { if (event instanceof HttpResponse) this.onEnd(); },
  //      (err: any) => { this.onEnd(); }
  //    )
  //  );
  //  return x;
  //}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.showLoader();
    let x: Observable<HttpEvent<any>>;
    x = next.handle(req)
      .pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            
            this.onEnd();
          }
        },
        (err: any) => {
          let response = err;
          console.log(JSON.stringify(response));
          this.showErrorDialog();
          this.onEnd();
          let result = JSON.parse(JSON.stringify(response));          
          let statusCode = result['status'];
          switch (statusCode) {
            case 403:
              this.dialogService.sendMessage('unauthorized', '');
              break;
            case 401:
              let message1 = result['error']['validateResult'];
              if (message1 == '401expired') {
                this.dialogService.sendMessage(message1, '');
                break;
              }
              if (message1 == null) {
                this.dialogService.sendMessage('unauthorized', '');
                break;
              }            
            default:
              this.dialogService.sendMessage('serverError', '');              
          }
        }
      )
    );
    return x;
  }

  private showErrorDialog(): void {
    let subscriber = this.dialogService.getMessage().subscribe(message => {
      let subscriber2 = this.loaderService.loaderDeactivated.subscribe(() => {
        var x = DialogController.show(this.dialog, message.text, message.extraInfo, '', '',
          MessageBoxButton.Ok, false, MessageBoxStyle.Simple).subscribe(result => {
            subscriber.unsubscribe();
            subscriber2.unsubscribe();
          });
      });
    });
  }

  private onEnd(): void {
      this.hideLoader();
  }
  private showLoader(): void {
    this.loaderService.show();
  }
  private hideLoader(): void {
    this.loaderService.hide();
  }
}
