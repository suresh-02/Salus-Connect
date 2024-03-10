import { AuthService } from './../_services/auth.service';
import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private message: NzNotificationService,
    private auth: AuthService
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(0),
      catchError((error: HttpErrorResponse) => {
        let err = error.error;
        let errorMessage: string = '';
        if (error.status == 401) {
          this.auth.logout();
        }
        if (error.status >= 400 && error.status !== 401) {
          if (err.errors) {
            err.errors.map((e: any) => {
              errorMessage += e.message + '</br>';
            });
          } else {
            errorMessage = err.message;
          }
          this.message.warning('Warning', errorMessage);
        }
        return throwError(errorMessage);
      })
    );
  }
}

export const ErrorInterceptorProvider = [
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
];
