import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class HttpLoggingInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const startedAt = Date.now();

    console.log('[HTTP] -> ' + request.method + ' ' + request.urlWithParams);

    return next.handle(request).do(
      (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('[HTTP] <- ' + event.status + ' ' + request.urlWithParams + ' (' + (Date.now() - startedAt) + ' ms)');
          console.log('[HTTP] response:', event.body);
        }
      },
      (error: HttpErrorResponse) => {
        console.error('[HTTP] xx ' + error.status + ' ' + request.urlWithParams + ' (' + (Date.now() - startedAt) + ' ms)', error.message);
      }
    );
  }
}
