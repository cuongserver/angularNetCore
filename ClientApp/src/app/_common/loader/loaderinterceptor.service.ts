import { Injectable, Injector, Output, EventEmitter } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoaderService } from './loader.service';
@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptorService implements HttpInterceptor {
  constructor(private loaderService: LoaderService) {

  }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.showLoader();
    let x: Observable<HttpEvent<any>>;
    x = next.handle(req)
      .pipe(
      tap(
        (event: HttpEvent<any>) => { if (event instanceof HttpResponse) this.onEnd(); },
        (err: any) => { this.onEnd(); }
      )
    );
    return x;
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
