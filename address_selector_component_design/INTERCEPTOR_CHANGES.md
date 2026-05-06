# Loading Interceptor Refactoring

This document reflects the current loading behavior in the app: each dependent dropdown shows its own inline loading message while the request is in flight, and the interceptor adds a 2-second delay so the loading state is visible during local development.

## 1. `LoadingService`
**File:** `src/app/core/interceptors/loading.service.ts`

The loading service still uses a `BehaviorSubject`, but it now tracks a request counter and exposes `isLoading$` for template bindings.

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private activeRequests = 0;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  show(): void {
    setTimeout(() => {
      if (this.activeRequests === 0) {
        this.isLoadingSubject.next(true);
      }
      this.activeRequests++;
      console.log('Active Requests in show():', this.activeRequests);
    }, 2000);
  }

  hide(): void {
    setTimeout(() => {
      this.activeRequests--;
      console.log('Active Requests in hide():', this.activeRequests);
      if (this.activeRequests <= 0) {
        this.activeRequests = 0;
        this.isLoadingSubject.next(false);
      }
    }, 2000);
  }
}
```

## 2. `LoadingInterceptor`
**File:** `src/app/core/interceptors/loading.interceptor.ts`

The interceptor now calls `LoadingService.show(request.url)` before the request and `LoadingService.hide(request.url)` in `finalize()`. It also applies `delay(2000)` so the loading state remains visible long enough to notice.

```typescript
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, delay } from 'rxjs/operators';
import { LoadingService } from './loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.show(request.url);

    return next.handle(request).pipe(
      delay(2000),
      finalize(() => this.loadingService.hide(request.url))
    );
  }
}
```

## 3. Interceptor Registration
**File:** `src/app/app.module.ts`

The interceptor is registered with `HTTP_INTERCEPTORS` so Angular applies it to all `HttpClient` requests.

```typescript
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';

providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LoadingInterceptor,
    multi: true
  }
]
```

## 4. Component Logic
**File:** `src/app/location-selector/location-selector.component.ts`

The component no longer manually toggles loading flags. Instead, it exposes request-specific observables from the loading service:

```typescript
loadingCountries$ = this.loadingService.isLoading('countries');
loadingDivisions$ = this.loadingService.isLoading('divisions');
loadingDistricts$ = this.loadingService.isLoading('districts');
loadingUpazilas$ = this.loadingService.isLoading('upazilas');
loadingPostCodes$ = this.loadingService.isLoading('postCodes');
```

This keeps the component free from `true/false` loading state toggles around each `subscribe()` block.

## 5. Template Layout
**File:** `src/app/location-selector/location-selector.component.html`

The loading message now appears in the same field area as each dropdown, under the label and in place of the dropdown while the request is pending.

```html
<div>
  <label>District</label>
  <br />
  <div *ngIf="loadingDistricts$ | async" style="color: blue;">Loading districts...</div>
  <select *ngIf="!(loadingDistricts$ | async)" formControlName="districtId">
    <option [ngValue]="null">Select District</option>
    <option *ngFor="let district of districts" [ngValue]="district.id">
      {{ district.name }} - {{ district.bn_name }}
    </option>
  </select>
</div>
```

The same pattern is used for country, division, upazila, and post office fields.