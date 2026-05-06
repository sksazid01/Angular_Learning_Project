# AddressSelectorComponentDesign

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.17.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Note: LoadingService `setTimeout` behavior

During development the project used a `setTimeout` inside `LoadingService.show()` and `LoadingService.hide()` which delays updating the global loading state by 2 seconds. This means the loader state and the HTTP interceptor delay combine and can produce unexpected timing (double delays, out-of-order increments/decrements) when multiple requests run quickly.

Recommended change for predictable behavior:

- Remove `setTimeout` from `LoadingService` so `show()` and `hide()` update immediately.
- If you still want to simulate latency during development, keep `delay(2000)` only in `LoadingInterceptor` (dev-only).

Example replacement (in `src/app/core/interceptors/loading.service.ts`):

```typescript
show(): void {
	if (this.activeRequests === 0) {
		this.isLoadingSubject.next(true);
	}
	this.activeRequests++;
}

hide(): void {
	this.activeRequests--;
	if (this.activeRequests <= 0) {
		this.activeRequests = 0;
		this.isLoadingSubject.next(false);
	}
}
```

This keeps the loading state updates immediate and predictable while letting the interceptor simulate network latency when needed.
