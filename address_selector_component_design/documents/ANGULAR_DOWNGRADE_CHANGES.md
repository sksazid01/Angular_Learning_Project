# Angular 17 to Angular 6 Downgrade Changes

This document outlines the modifications made to this project to successfully downgrade it from Angular 17 to Angular 6 while preserving all logic and features with minimal changes.

## 1. Standalone Components to NgModule
**What changed:** Angular 14 introduced standalone components, which became the default in Angular 17. Angular 6 requires all components to be declared in an `@NgModule`.
*   Removed `standalone: true` from both `AppComponent` and `LocationSelectorComponent`.
*   Removed the `imports` array inside the `@Component` decorators.
*   Ensured both components are properly declared inside the `declarations` array of `AppModule` (`src/app/app.module.ts`).

## 2. Dependency Injection Strategy
**What changed:** Angular 14+ introduced the `inject()` function as an alternative to constructor-based dependency injection. Angular 6 only supports constructor injection.
*   **LocationService (`src/app/location-selector/location.service.ts`):** 
    *   Removed `import { inject } from '@angular/core'`.
    *   Changed `private http = inject(HttpClient);` to `constructor(private http: HttpClient) {}`.
*   **LocationSelectorComponent (`src/app/location-selector/location-selector.component.ts`):**
    *   Removed `private fb = inject(FormBuilder);` and `private locationService = inject(LocationService);`.
    *   Added `constructor(private fb: FormBuilder, private locationService: LocationService) {}`.

## 3. Template Control Flow Syntax
**What changed:** Angular 17 introduced a new built-in control flow syntax (`@if`, `@for`). Angular 6 uses structural directives (`*ngIf`, `*ngFor`).
*   Changed `@if (condition) { ... } @else { ... }` blocks to `<div *ngIf="condition; else templateName">...</div>` and `<ng-template #templateName>...</ng-template>`.
*   Changed `@for (item of items; track item.id)` blocks to `<option *ngFor="let item of items" ...>`.
*   Applied these template syntax changes to both `app.component.html` and `location-selector.component.html`.

## 4. Application Bootstrapping
**What changed:** Standalone Angular 17 applications bootstrap differently than module-based Angular 6 applications.
*   **`main.ts`**: Replaced the Angular 17 standalone bootstrap (`bootstrapApplication(AppComponent, appConfig)`) with the traditional module-based bootstrap:
    ```typescript
    import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
    import { AppModule } from './app/app.module';

    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.log(err));
    ```

## 5. File Cleanup
**What changed:** Standalone apps use specific config files that have no purpose in an older module-based app.
*   Deleted `src/app/app.config.ts`.
*   Deleted `src/app/app.routes.ts`.
*   Removed the non-existent `AppRoutingModule` from `app.module.ts` as routing was not strictly defined or needed for the single view component.

## 6. Package Dependencies (Mental Note)
To fully compile and run an Angular 6 application, `package.json` needs its dependencies heavily downgraded to `~6.1.0` syntax, requiring an older Node.js runtime (Node 8 or 10). The current source code is fully compatible with Angular 6 syntax and constraints.
