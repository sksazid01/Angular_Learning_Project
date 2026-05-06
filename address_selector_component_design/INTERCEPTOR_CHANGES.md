# Loading Interceptor Refactoring

This document documents the current granular, per-field loading UI that uses an HTTP interceptor plus a `LoadingService` to show localized "Loading..." text for only the dependent dropdown that is being updated.

Paths referenced below assume the current project layout.

## 1. `LoadingService` (per-target tracking)
File: `src/app/core/interceptors/loading.service.ts`

This service stores a small map of keys (countries/divisions/districts/upazilas/postCodes) and exposes `isLoading(key: string): Observable<boolean>` so components can bind to a specific field's loading state.

Example (concept):

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadingService {
	private loadingMap = new Map<string, boolean>();
	private subject = new BehaviorSubject<Map<string, boolean>>(this.loadingMap);

	isLoading(key: string): Observable<boolean> {
		return this.subject.asObservable().pipe(map(m => !!m.get(key)));
	}

	show(key: string) {
		this.loadingMap.set(key, true);
		this.subject.next(this.loadingMap);
	}

	hide(key: string) {
		this.loadingMap.set(key, false);
		this.subject.next(this.loadingMap);
	}
}
```

## 2. `LoadingInterceptor`
File: `src/app/core/interceptors/loading.interceptor.ts`

The interceptor inspects `request.url` (or another aspect of the request) to derive a small key for which field is affected, calls `loadingService.show(key)` before the request and `loadingService.hide(key)` in `finalize()`. A small `delay(2000)` is used in dev to make the loading visible.

Example (concept):

```typescript
intercept(request: HttpRequest<any>, next: HttpHandler) {
	const key = extractKeyFromUrl(request.url); // e.g. 'districts'
	this.loadingService.show(key);
	return next.handle(request).pipe(
		delay(2000),
		finalize(() => this.loadingService.hide(key))
	);
}
```

Note: `extractKeyFromUrl` is a small helper that maps `/districts` → `'districts'`, `/upazilas` → `'upazilas'`, etc.

## 3. Interceptor Registration
File: `src/app/app.module.ts`

Register the interceptor the usual way using `HTTP_INTERCEPTORS` so all `HttpClient` calls are observed.

## 4. Component usage (`LocationSelectorComponent`)
File: `src/app/location-selector/location-selector.component.ts`

Expose per-field loading observables derived from the `LoadingService` so the template can bind each dropdown to its own loading state:

```typescript
loadingCountries$ = this.loadingService.isLoading('countries');
loadingDivisions$ = this.loadingService.isLoading('divisions');
loadingDistricts$ = this.loadingService.isLoading('districts');
loadingUpazilas$ = this.loadingService.isLoading('upazilas');
loadingPostCodes$ = this.loadingService.isLoading('postCodes');
```

These are reactive and require no manual toggling in `subscribe()` callbacks.

## 5. Template (inline localized loader)
File: `src/app/location-selector/location-selector.component.html`

Each field hides its `<select>` while the corresponding loading observable is true, and shows a simple `Loading...` text in the same place. Example for `district`:

```html
<div>
	<label>District</label>
	<br />
	<div *ngIf="loadingDistricts$ | async" class="loader">Loading...</div>
	<select *ngIf="!(loadingDistricts$ | async)" formControlName="districtId">
		<option [ngValue]="null">Select District</option>
		<option *ngFor="let d of districts" [ngValue]="d.id">{{ d.name }}</option>
	</select>
</div>
```

Behavior: when user changes `division`, only `district` is requested and shows `Loading...` inline until the response arrives; other fields remain visible.

---
This file documents the current design and how the interceptor, service and template cooperate to provide a small, localized loading UI for chained dropdowns.
