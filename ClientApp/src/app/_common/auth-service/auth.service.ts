//import { Injectable, Injector } from "@angular/core";
//import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
//import { OAuthService } from "angular-oauth2-oidc";
//import { Observable } from "rxjs";

//@Injectable()
//export class TokenInterceptor implements HttpInterceptor {

//  private authService: OAuthService;
//  constructor(private injector: Injector) { }

//  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

//    if (this.getAuthService().hasValidAccessToken()) {
//      request = request.clone({
//        setHeaders: {
//          Authorization: 'Bearer ' + this.getAuthService().getAccessToken()
//        }
//      });
//    }

//    return next.handle(request);
//  }

//  getAuthService(): OAuthService {
//    if (typeof this.authService === 'undefined') {
//      this.authService = this.injector.get(OAuthService);
//    }
//    return this.authService;
//  }
//}
