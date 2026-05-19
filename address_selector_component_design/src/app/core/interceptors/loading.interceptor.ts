import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, delay } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  // =========================
  // Constructor
  // =========================
  constructor(private loadingService: LoadingService) {}

  // =========================
  // Core Interceptor logic
  // =========================
  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('HTTP request started:', request.url);

    this.loadingService.show(request.url);

    return next.handle(request).pipe(
      delay(100),
      finalize(() => {
        console.log('HTTP request completed:', request.url);
        this.loadingService.hide(request.url);
      })
    );
  }
}
