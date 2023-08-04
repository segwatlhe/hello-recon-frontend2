import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
@Injectable()
export class InterceptorService {
  constructor(
    private _auth: AuthService
  ) {
  }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!request.url.includes(environment.s3URL)) {
      request = request.clone({headers: request.headers.set('Accept', 'application/json')}).clone({
        setHeaders: {
          Authorization: `Bearer ${this._auth.getToken()}`
        }
      });
    }
    return next.handle(request);
  }
}
