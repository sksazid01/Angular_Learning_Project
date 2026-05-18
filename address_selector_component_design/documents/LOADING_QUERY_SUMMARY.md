# LoadingService — `activeRequests` explained

This document explains why the `activeRequests` counter (the `activeRequests++` in `show()`) is necessary, why the current `setTimeout` usage is problematic, recommended fixes, and a concise log of your queries and requests during this refactor.

---

## 1) Why `activeRequests++` is needed

- Purpose: `activeRequests` tracks how many HTTP requests are currently in flight. Each time a request starts we call `show()` which increments the counter; each time a request finishes we call `hide()` which decrements it.

- Prevents premature hiding: Without a counter, showing/hiding would be a simple boolean toggle (set `isLoading = true` on start and `isLoading = false` on finish). If multiple requests run concurrently, the first finished request would set `isLoading = false` while other requests are still running — causing the loader to disappear too early.

- Correct behavior example:
  - Request A starts → `activeRequests = 1` → loader shown
  - Request B starts → `activeRequests = 2` → loader stays shown
  - Request A finishes → `activeRequests = 1` → loader remains shown
  - Request B finishes → `activeRequests = 0` → loader hidden

- Implementation detail: increment on start, decrement on finish, only hide loader when counter reaches zero.

- Robust decrement: always ensure the counter never becomes negative, e.g.

```typescript
hide(): void {
  this.activeRequests = Math.max(0, this.activeRequests - 1);
  if (this.activeRequests === 0) {
    this.isLoadingSubject.next(false);
  }
}
```

- `finalize()` in the interceptor ensures `hide()` runs for both success and error, so counter bookkeeping remains consistent.


## 2) Why the current `setTimeout` is problematic

Current `LoadingService` (in your workspace) delays both `show()` and `hide()` by 2 seconds using `setTimeout`. Combined with the interceptor's `delay(2000)`, this produces surprising timing:

- Double-delay effect: interceptor delays the request 2s, and the service delays updating the counter another 2s — user sees a longer delay than intended.
- Ordering / race conditions: delayed increments/decrements may be executed out of order if requests start and finish quickly, causing temporary incorrect counter values.
- Flicker / inconsistent UI: because changes are delayed, the loader may appear/disappear after the data has already arrived.

Therefore, updating the counter immediately is simpler and more predictable.


## 3) Recommended change (simple & safe)

- Remove `setTimeout` from `LoadingService`. Update `show()` and `hide()` to change state immediately.
- Keep `delay(2000)` only in the interceptor for dev-only simulated latency if you want to see the loader visually.
- Use `finalize()` in the interceptor to call `hide()` so `hide()` always runs (success/error/cancel).

Example replacement for `show()` / `hide()`:

```typescript
show(): void {
  if (this.activeRequests === 0) {
    this.isLoadingSubject.next(true);
  }
  this.activeRequests++;
}

hide(): void {
  this.activeRequests = Math.max(0, this.activeRequests - 1);
  if (this.activeRequests === 0) {
    this.isLoadingSubject.next(false);
  }
}
```


## 4) Per-field loading (granular loaders)

You previously asked for per-dropdown (per-field) loading — e.g., when the user selects a new `division`, **only** the `district` field should show `Loading...` while the districts request runs. To achieve this, use a keyed approach:

- Maintain a `Map<string, boolean>` (or map-like structure) in `LoadingService`.
- Provide `isLoading(key: string): Observable<boolean>` and `show(key: string)` / `hide(key: string)`.
- The interceptor extracts a small `key` from the request URL (e.g., `/districts` → `'districts'`) and calls `show(key)` / `hide(key)`.

Per-field example (concept):

```typescript
// loading.service.ts (concept)
isLoading(key: string): Observable<boolean> { ... }
show(key: string) { map.set(key, true); subject.next(map); }
hide(key: string) { map.set(key, false); subject.next(map); }

// interceptor
const key = extractKeyFromUrl(request.url); // 'districts'
this.loadingService.show(key);
return next.handle(request).pipe(
  delay(2000),
  finalize(() => this.loadingService.hide(key))
);
```

Component usage (template binding):

```html
<div>
  <label>District</label>
  <br />
  <div *ngIf="loadingDistricts$ | async" class="loader">Loading...</div>
  <select *ngIf="!(loadingDistricts$ | async)" formControlName="districtId">...
  </select>
</div>
```

This is how the implementation in the repo currently works (or was adjusted to work): only the dependant dropdown shows `Loading...`.


## 5) Edge cases & best practices

- Always protect the counter from going negative: `Math.max(0, ... )`.
- Use `finalize()` to ensure `hide()` is executed for errors/cancellations.
- Avoid combining delayed UI updates in both interceptor and service — keep simulation delays in one place only.
- If you want to avoid any UI delay in production, gate the interceptor `delay()` behind a dev-only flag.


## 6) All user queries / requests (chronological & paraphrased)

- Use an interceptor for loading handling and remove all per-component `isLoading` variables.
- Replace local flags with a central `LoadingService` + `LoadingInterceptor`.
- Create a markdown documenting all changes for the interceptor approach.
- Make the loading visible (use a 2s `setTimeout` or simulated delay) so the loader can be observed during local development.
- Show loading inside each field: when selecting `Division`, the `District` field should display `Loading...` while districts are being loaded.
- Replace dropdowns with loading text in-place while their specific request runs.
- Later asked to simplify to a single global `Loading...` (top of component), then revert to per-field behavior.
- Asked why `activeRequests++` is needed (this file explains why).
- Requested this explanation be added to the README (a short note was added earlier).


## 7) Next steps (I can do these for you)

- Apply the recommended `LoadingService` patch to remove `setTimeout` and fix `hide()` decrement safety.
- Optionally, run a local build and quick test cycle to ensure no runtime issues.

If you want me to apply the patch now, say "apply fix" and I will update `src/app/core/interceptors/loading.service.ts` and run a quick build check.

---

*File created: `LOADING_QUERY_SUMMARY.md`*
