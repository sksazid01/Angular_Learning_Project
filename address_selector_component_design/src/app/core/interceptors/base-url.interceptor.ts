// core/interceptors/base-url.interceptor.ts
import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // skip if already an absolute URL (like external API calls)
        if (req.url.startsWith('http')) {
            return next.handle(req);
        }

        const apiUrl = req.clone({
            url: `${environment.baseUrl}${req.url}`
        });
        // console.log('BaseUrlInterceptor modified request URL:', apiUrl.url);

        return next.handle(apiUrl);
    }
}