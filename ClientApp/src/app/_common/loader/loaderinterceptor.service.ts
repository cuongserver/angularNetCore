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
  
  constructor(private loaderService: LoaderService, private dialog: MatDialog) {

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
    return next.handle(req)
      .pipe(tap(
          (event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              this.onEnd();
            }
          },
        (err: any) => {
            let dialogService: DialogService = new DialogService();
            let response = err;
            console.log(JSON.stringify(response));
            this.showErrorDialog(dialogService);
            this.onEnd();
            let result = JSON.parse(JSON.stringify(response));
            let statusCode = result['status'];
            switch (statusCode) {
              case 403:
                dialogService.sendMessage('unauthorized', '');
                break;
              case 401:
                let message1 = result['error']['validateResult'];
                if (message1 == '401expired') {
                  dialogService.sendMessage(message1, '');
                  break;
                }
                if (message1 == null) {
                  dialogService.sendMessage('unauthorized', '');
                  break;
                }
              default:
                  dialogService.sendMessage('serverError', '');
            }
          dialogService = null;
        }
        )
      );
  }

  private showErrorDialog(dialogService: DialogService): void {
    let subscriber = dialogService.getMessage().subscribe(message => {
      subscriber.unsubscribe();
      if (['unauthorized', '401expired', 'serverError'].indexOf(message.text) >= 0) {
        let subscriber2 = this.loaderService.loaderDeactivated.subscribe(() => {
          subscriber2.unsubscribe();
          var x = DialogController.show(this.dialog, message.text, message.extraInfo, '', '',
            MessageBoxButton.Ok, false, MessageBoxStyle.Simple).subscribe(result => {
            });
        });
      }
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
