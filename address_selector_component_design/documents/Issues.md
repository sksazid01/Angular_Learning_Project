# Angular Address Selector — Code Review & Improvement Suggestions

> **Scope:** `address-form`, `address-lists`, `supplier-*`, `confirmation-popup`, `notification`, `loading`, `address-preview`, and shared services.
> **Note:** These are *suggestions only* — no code has been changed.

---

## 1. 🐛 Potential Issues

### 1.1 Memory Leaks — Unsubscribed Observables

**Files:** `address-form.component.ts`, `address-lists.component.ts`

```ts
// address-form.component.ts — ngOnInit
this.addressFormService.editAddress$.subscribe(address => { ... });

// address-lists.component.ts — ngOnInit
this.addressFormService.addressFormSubmit$.subscribe(() => { ... });
```

Neither subscription is stored and unsubscribed in `ngOnDestroy`. If the component is destroyed and re-created (e.g. via routing), the old subscriptions keep running, causing **memory leaks** and duplicate executions.

**Suggestion:** Store subscriptions in a `Subscription` object and call `.unsubscribe()` in `ngOnDestroy`, or use the `takeUntilDestroyed()` operator (Angular 16+) / `takeUntil(destroy$)` pattern.

---

### 1.2 `valueChanges` Subscriptions Also Leak

**File:** `address-form.component.ts` lines 168–200

```ts
private onCountryChange(): void {
  this.getControl('countryId').valueChanges.subscribe(...);
}
```

All four `onXxxChange()` methods subscribe to `valueChanges` but never unsubscribe. These are recreated every time `ngOnInit` runs.

---

### 1.3 Race Condition in `loadRelatedAddresssForOptionsPreview`

**File:** `address-form.component.ts` lines 124–150

When editing an address, countries and divisions are fetched **again** even though `loadCountries()` and `loadDivisions()` already fetched them in `ngOnInit`. If both calls finish in different orders, the dropdown arrays can be overwritten inconsistently.

**Suggestion:** Only reload data that is missing; skip if already loaded.

---

### 1.4 `patchAddressValues` Calls `{ emitEvent: false }` But `loadRelatedAddresssForOptionsPreview` Depends on the Same Subscriptions

**File:** `address-form.component.ts` lines 115–163

`patchAddressValues` correctly uses `{ emitEvent: false }` to avoid triggering the `valueChanges` cascade. However, it means downstream dropdowns (districts, upazilas, post offices) are populated manually via `loadRelatedAddresssForOptionsPreview`. If the patch finishes **before** the HTTP calls return, the form shows valid IDs but empty dropdowns, and the user sees no options selected.

**Suggestion:** Chain the HTTP calls sequentially using `switchMap` or `forkJoin`, then patch the form after all data is available.

---

### 1.5 Unsafe Property Access — `deleteConfirmed` in `supplier-details`

**File:** `supplier-details.component.ts` line 29

```ts
deleteConfirmed() {
  this.supplierService.deleteSupplier(this.supplier.id).subscribe(...);
}
```

`this.supplier` is typed `Supplier | undefined`. If somehow `deleteConfirmed` is called before the supplier loads, this throws a runtime error.

**Suggestion:** Add a null guard: `if (!this.supplier) return;`

---

### 1.6 `ConfirmationPopupService` Stores Raw Callback Functions

**File:** `confirmation-popup.service.ts` lines 12–13

```ts
private confirmCallback: Function | null = null;
private declineCallback: Function | null = null;
```

Using the broad `Function` type is unsafe and bypasses TypeScript's type system. If two dialogs are triggered quickly (e.g., double-click), the second call **overwrites** `confirmCallback` before the first resolves, and the first callback is silently lost.

**Suggestion:** Use a typed callback `(() => void) | null` and add a guard to prevent opening a second dialog while one is already open (e.g., check `this.configSubject.getValue() !== null`).

---

### 1.7 `Supplier` Class Missing Property Initializers

**File:** `supplier.service.ts` lines 6–10

```ts
export class Supplier {
  id: number;
  name: string;
  address: Address;
}
```

Class properties have no default values and no `!` non-null assertion, causing TypeScript strict mode to complain. Also, `address` should be `Address | undefined` since a supplier can be created without one.

**Suggestion:** Use an `interface` instead of a `class`, or add proper initializers/optionals.

---

### 1.8 `currentAddressIdForEditing` is Marked `// remove` But Still Used

**File:** `address-form.component.ts` line 26

```ts
private currentAddressIdForEditing: number | null = null; // remove
```

This property is actively used in `submit()` and `updateAddress()`. The comment is misleading and may confuse future developers.

**Suggestion:** Either remove the comment or refactor the code to remove actual dependency on this field.

---

### 1.9 `NotificationComponent` Has Hardcoded Default State

**File:** `notification.component.ts` lines 14–17

```ts
public isNotificationVisible = true;
public title: string = 'Welcome';
public message: string = 'Thank you for visiting our website!';
```

The notification is **visible on page load** with a welcome message, even though it's never explicitly triggered. This is likely unintentional and shows stale state before the service fires.

**Suggestion:** Initialize `isNotificationVisible = false` and clear default `title`/`message`.

---

### 1.10 `loadAddresses()` Reassigns Observable on Every Submit

**File:** `address-lists.component.ts` lines 22–28

```ts
this.addressFormService.addressFormSubmit$.subscribe(() => {
  this.loadAddresses(); // reassigns savedAddresses$ every time
});

private loadAddresses(): void {
  this.savedAddresses$ = this.addressListService.getAddresses();
}
```

This pattern creates a **new Observable** reference on every form submit. The `async` pipe in the template will unsubscribe from the old one and subscribe to the new one, triggering a fresh HTTP call — which is fine functionally, but architecturally fragile.

**Suggestion:** Use a `BehaviorSubject` or `ReplaySubject` to manage the list reactively, or use `switchMap` to chain the submit event directly to the data reload.

---

### 1.11 Route Ordering Issue — `suppliers/new` vs `suppliers/:id`

**File:** `app-routing.module.ts` lines 10–11

```ts
{ path: 'suppliers/new', component: SupplierInfoUpdateComponent },
{ path: 'suppliers/:id', component: SupplierDetailsComponent },
```

Angular's router matches routes top-to-bottom. `suppliers/new` is correctly placed **before** `suppliers/:id`. However, inside `SupplierInfoUpdateComponent`, the check `if (id && id !== 'new')` is a code smell — the `new` route should ideally be a completely separate route or the check should not be needed at all if routing is structured correctly.

---

## 2. 🖊️ Code Formatting Issues

### 2.1 Inconsistent Indentation in `notification.service.ts`

**File:** `notification.service.ts`

The service body uses **4-space indentation** while the rest of the project uses **2-space indentation**. This is inconsistent and suggests the file was written or pasted with different editor settings.

---

### 2.2 Missing Semicolons in Model

**File:** `address-form.domain.ts` lines 44–45

```ts
upazila: Upazila;  
postOffice : PostOffice   // ← missing semicolon, trailing space before colon
```

`postOffice` is missing its closing semicolon and has an extra space before the `:`. This violates consistent TypeScript formatting.

---

### 2.3 Inline Styles in Templates

**Files:** `supplier-details.component.html`, `supplier-info-update.component.html`, `supplier-list.component.html`

```html
<div style="display: flex; justify-content: space-between; ...">
```

Multiple templates use inline `style=""` attributes rather than CSS classes. This makes styling hard to maintain, override, and theme.

**Suggestion:** Move all inline styles to the corresponding `.css` file using descriptive class names.

---

### 2.4 Deprecated HTML Attributes

**Files:** `address-lists.component.html`, `address-preview.component.html`, `supplier-details.component.html`

```html
<table border="1" cellpadding="10" cellspacing="2" align="center">
```

`border`, `cellpadding`, `cellspacing`, and `align` are **deprecated HTML4 attributes**. They should be replaced with CSS.

---

### 2.5 Commented-Out Code Left in Template

**File:** `address-form.component.html` line 1

```html
<!-- <hr /> -->
```

Dead commented-out code should be removed before committing.

---

### 2.6 `console.log` Statements Left in Production Code

**Files:** `confirmation-popup.component.ts` lines 47, 49; `loading.interceptor.ts` lines 27, 34

```ts
console.log('ConfirmationPopupComponent initialized!');
console.log('Popup received config:', config);
console.log('HTTP request started:', request.url);
```

Debug `console.log` calls should be removed from production code. Use a proper logging abstraction if needed.

---

## 3. 🏷️ Function & Variable Naming Issues

| Address | Current Name | Issue | Suggested Name |
|---|---|---|---|
| `address-form.component.ts:22` | `postOffice: PostOffice[]` | Array named as singular concept; confusing | `postOffices: PostOffice[]` |
| `address-form.component.ts:393` | `showLoadError()` | Misleading — used for both errors AND success messages | `showNotification()` |
| `supplier-info-update.component.ts:49` | `getSupplierAddress()` | Sounds like it *returns* something, but it mutates `supplier.address` as a side-effect | `assignSupplierAddress()` |
| `supplier-info-update.component.ts:74` | `onSupplierSave()` | Inconsistent with Angular convention where `on` prefix is for event handlers from template | `handleSaveClick()` or `saveSupplier()` (and rename the private one) |
| `address-form.component.ts:115` | `loadAddressForEdit()` | Ambiguous — "load" suggests HTTP, but it also patches the form | `populateFormForEdit()` |
| `address-form.component.ts:124` | `loadRelatedAddresssForOptionsPreview()` | Too long and awkward | `preloadDropdownOptions()` |
| `address-lists.component.ts (class)` | `AddressListComponent` | File is named `address-lists` (plural) but class is `AddressListComponent` (singular) | `AddressListsComponent` — keep consistent |
| `confirmation-popup.service.ts:12–13` | `confirmCallback`, `declineCallback` | Using broad `Function` type | Type as `(() => void) \| null` |
| `loading.service.ts:12` | `activeRequests` | Private field, OK, but naming doesn't follow the `_` prefix convention used nowhere else | Keep consistent, just ensure it's always private |
| `supplier-details.component.ts:28` | `deleteConfirmed()` | Sounds like it's a callback name, not a method name | `onDeleteConfirmed()` or `executeDelete()` |

---

## 4. ✂️ Function Splitting by Responsibility

### 4.1 `ngOnInit` in `AddressFormComponent` Does Too Much

**File:** `address-form.component.ts` lines 36–48

```ts
ngOnInit(): void {
  this.buildForm();
  this.loadCountries();
  this.loadDivisions();
  this.onCountryChange();  // sets up subscription
  this.onDivisionChange(); // sets up subscription
  this.onDistrictChange(); // sets up subscription
  this.onUpazilaChange();  // sets up subscription
  this.addressFormService.editAddress$.subscribe(...); // another subscription
}
```

`ngOnInit` mixes **data loading**, **form initialization**, and **event subscription wiring**. Consider splitting into:
- `initializeForm()` — calls `buildForm()`
- `loadInitialData()` — calls `loadCountries()`, `loadDivisions()`
- `setupChangeListeners()` — calls all four `onXxxChange()` methods + the editAddress subscription

---

### 4.2 `submit()` Has Branching Responsibilities

**File:** `address-form.component.ts` lines 307–327

```ts
public submit(): void {
  const address = this.buildAddressForSubmit();

  if (this.isEditMode && this.currentAddressIdForEditing) {
    address.id = this.currentAddressIdForEditing;
    if (this.standalone) { this.updateAddress(address); }
    else { this.addressFormService.onAddressFormSubmit(); }
    this.disableEditMode();
  } else {
    if (this.standalone) { this.createAddress(address); }
    else { this.addressFormService.onAddressFormSubmit(); }
  }
  this.resetFromCountry();
}
```

This single method handles four distinct paths. Split into:
- `submitInStandaloneMode(address)` — handles create/update in standalone
- `submitInEmbeddedMode()` — notifies parent via service

---

### 4.3 `onSupplierSave()` Chains Unrelated Concerns

**File:** `supplier-info-update.component.ts` lines 74–78

```ts
onSupplierSave() {
  if (!this.isSupplierValid()) return;
  this.getSupplierAddress();  // side-effect: mutates supplier.address
  this.saveSupplier();          // triggers confirmation popup + HTTP
}
```

`getSupplierAddress()` should not mutate state silently. Consider returning the address and passing it directly to `saveSupplier(address)` instead.

---

### 4.4 `clearDependencies` Uses String-Based Array Clearing

**File:** `address-form.component.ts` lines 263–274

```ts
if (arraysToClear.includes('divisions')) this.divisions = [];
if (arraysToClear.includes('districts')) this.districts = [];
```

Using magic strings (`'divisions'`, `'districts'`) is fragile. If a property is renamed, TypeScript won't catch the mismatch. Consider a direct approach or using a mapped object keyed by property name.

---

## 5. 📡 Data Passing Issues

### 5.1 `@ViewChild` Used to Access Child's Internal Form — Breaks Encapsulation

**File:** `supplier-info-update.component.ts` lines 51–52

```ts
if (this.addressForm && this.addressForm.addressForm && this.addressForm.addressForm.valid) {
  addressData = this.addressForm.getAddressFromAddressForm();
}
```

The parent is accessing `addressForm.addressForm` — a **child's internal `FormGroup`** — directly. This is a deep encapsulation violation. The parent should not know about the child's internal implementation details.

**Suggestion:** Expose only what is needed from the child via a public method like `getAddressFromAddressForm()` (which already exists) or an `@Output() addressChange` event emitter. Do not access `.addressForm` (the FormGroup) from outside.

---

### 5.2 `AddressFormComponent` Has Two Conflicting Input Mechanisms

**File:** `address-form.component.ts`

The component accepts an address via:
1. `@Input() address?: Address` — for parent → child (used in `supplier-info-update`)
2. `addressFormService.editAddress$` — service Observable (used in `address-lists`)

Both trigger `startEdit()`. Having **two entry points** for the same action makes the component unpredictable and hard to test. The caller must know *which* mechanism to use.

**Suggestion:** Standardize on a single input mechanism. Prefer `@Input()` for direct parent-child communication. Reserve the service observable for cross-component (sibling/unrelated) communication.

---

### 5.3 `AddressFormService` Is Overloaded — Mixes HTTP and UI State

**File:** `address-form.service.ts`

This service:
- Makes HTTP calls (`getCountries`, `getDivisions`, etc.)
- Manages UI event bus (`editAddress$`, `addressFormSubmit$`)

These are two separate concerns. Consider splitting into:
- `AddressDataService` — HTTP calls only
- `AddressFormService` — UI state/event coordination only

---

### 5.4 `ConfirmationPopupService` Uses Callback-Based API Instead of Observable

**File:** `confirmation-popup.service.ts`

```ts
confirm(confirmFn: Function, declineFn?: Function, ...): Promise<boolean>
```

Storing callbacks as service properties is stateful and risky (see Issue 1.6). A cleaner approach is to return an Observable or Promise from `confirm()` and let the caller decide what to do:

```ts
// Preferred:
confirmationPopupService.confirm(message).subscribe(result => {
  if (result) { /* do work */ }
});
```

---

### 5.5 `standalone` Input Flag Creates Implicit Behavior Split

**File:** `address-form.component.ts` line 16

```ts
@Input() standalone: boolean = true;
```

The `standalone` flag fundamentally changes what `submit()` does — either saving data or just notifying a parent. This is a hidden behavioral split. A component should do one thing.

**Suggestion:** When embedded in `supplier-info-update`, do not use `submit()` at all. Instead, let the parent call `getAddressFromAddressForm()` directly when it's ready to save.

---

## 6. 👪 Child-Parent Relationship Issues

### 6.1 `AddressListComponent` and `AddressFormComponent` Are Siblings Communicating via Service

**File:** `address-lists.component.html` — both components are in the same template

```html
<div class="left">
  <app-address-form></app-address-form>
</div>
<div class="right">
  <!-- list uses editAddress$ from service -->
</div>
```

The parent `AddressListComponent` passes no data to `AddressFormComponent` directly — all communication goes through `AddressFormService`. This is fine for sibling communication, but since they share the same parent, the parent could act as a mediator, keeping the service cleaner.

---

### 6.2 `SupplierInfoUpdateComponent` → `AddressFormComponent` Relationship Is Implicit

**File:** `supplier-info-update.component.html` line 18

```html
<app-address-form [address]="supplier.address" [standalone]="false"></app-address-form>
```

The parent passes `[standalone]="false"` to change child behavior, and then queries the child via `@ViewChild`. This creates a **tight coupling** between parent and child. The child is not truly reusable — it behaves differently depending on what the parent passes.

**Suggestion:** Use `@Output() addressSelected = new EventEmitter<Address>()` and let the child emit when ready, decoupling the parent from the child's internal form state.

---

### 6.3 `SupplierDetailsComponent` Has No Loading State

**File:** `supplier-details.component.ts` lines 21–26

```ts
ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  if (id) {
    this.supplierService.getSupplier(id).subscribe(s => this.supplier = s);
  }
}
```

While the data loads, `supplier` is `undefined` and the template is completely hidden by `*ngIf="supplier"`. There is no skeleton/loading state shown to the user.

---

## 7. 🧩 Reusable Component Issues

### 7.1 Address Display Logic Is Duplicated

**Files:** `supplier-list.component.html`, `supplier-details.component.html`, `address-preview.component.html`

The `address-preview` component exists specifically to render an `Address`, but `supplier-list.component.html` renders address inline instead of using `<app-address-preview>`:

```html
<!-- supplier-list.component.html — custom inline rendering -->
{{ supplier.address?.postOffice?.postOffice }}, {{ supplier.address?.upazila?.name }}
{{ supplier.address?.district?.name }}, ...
```

**Suggestion:** Use `<app-address-preview [address]="supplier.address">` inside the supplier list as well, to ensure consistent display.

---

### 7.2 `AddressPreviewComponent` Shows Two Separate `*ngIf` Blocks Instead of `ng-template`

**File:** `address-preview.component.html` lines 2–38

```html
<div *ngIf="address && address.country"> ... </div>
<div *ngIf="!address || !address.country"> ... </div>
```

Using `*ngIf` / `*ngIf="!..."` pairs is an anti-pattern. Use `ng-template` with `else`:

```html
<div *ngIf="address?.country; else noAddress"> ... </div>
<ng-template #noAddress> ... </ng-template>
```

---

### 7.3 `LoadingService.getKeyFromUrl()` Is Hardcoded — Not Scalable

**File:** `loading.service.ts` lines 63–70

```ts
private getKeyFromUrl(url: string): string {
  if (url.includes('/countries')) return 'countries';
  if (url.includes('/divisions')) return 'divisions';
  // ...
  return '';
}
```

Every new API endpoint requires a manual addition here. This is brittle and will silently fail for unrecognized URLs (returning `''`, which skips per-key tracking).

**Suggestion:** Extract the last URL segment dynamically, or accept a `key` parameter in `show()`/`hide()` instead of deriving it from the URL.

---

### 7.4 `ConfirmationPopupComponent` Is Not Configurable for Danger Styling

**File:** `confirmation-popup.component.ts`

The popup supports `confirmText` and `cancelText`, but no visual variant (e.g., `danger`, `warning`, `info`). Every confirmation looks the same whether you're submitting a form or deleting a supplier.

**Suggestion:** Add a `variant: 'default' | 'danger' | 'warning'` field to `ConfirmationConfig` to allow visual differentiation.

---

### 7.5 `Supplier` Model Is Defined Inside `supplier.service.ts`

**File:** `supplier.service.ts` lines 6–10

```ts
export class Supplier {
  id: number;
  name: string;
  address: Address;
}
```

Model/entity classes should live in their own `*.domain.ts` file, not inside a service file. This forces any component that only needs the type to import the entire service.

**Suggestion:** Move `Supplier` to `supplier.domain.ts`.

---

## 8. 🌐 Excessive Network Calls

### 8.1 Countries & Divisions Are Fetched Twice on Edit

**File:** `address-form.component.ts`

When editing an address:
1. `ngOnInit` calls `loadCountries()` and `loadDivisions()` → **2 HTTP calls**
2. `loadRelatedAddresssForOptionsPreview()` calls `getCountries()` and `getDivisions()` again → **2 more HTTP calls**

This results in **4 redundant calls** for data that never changes per session (countries/divisions are static reference data).

**Suggestion:**
- Cache countries and divisions in the service using `shareReplay(1)` so subsequent subscriptions reuse the same response.
- In `loadRelatedAddresssForOptionsPreview`, skip fetching countries/divisions if the arrays are already populated.

---

### 8.2 No Caching for Any Reference Data

**File:** `address-form.service.ts`

All HTTP methods return a fresh `http.get(...)` on every call. Countries, divisions, districts, upazilas, and post offices are all static/reference data that changes rarely.

```ts
public getCountries(): Observable<Country[]> {
  return this.http.get<Country[]>(`${this.baseUrl}/countries`); // no cache
}
```

**Suggestion:** Add `shareReplay(1)` to cache the last emitted value:

```ts
private countries$ = this.http.get<Country[]>(`${this.baseUrl}/countries`).pipe(shareReplay(1));
public getCountries(): Observable<Country[]> { return this.countries$; }
```

---

### 8.3 `addressFormSubmit$` Triggers a Full List Reload on Every Save

**File:** `address-lists.component.ts` lines 22–28

Every time a form is submitted (create or update), `getAddresses()` is called again, fetching the **entire address list**. For large datasets this is inefficient.

**Suggestion:** After a successful `addAddress`, push the new item into the local array. After `updateAddress`, update the item in-place. Only fall back to a full reload if necessary.

---

### 8.4 `SupplierListComponent` and `SupplierDetailsComponent` Both Fetch Independently

**Files:** `supplier-list.component.ts`, `supplier-details.component.ts`

When a user visits the list page and then navigates to a detail page, a separate `getSupplier(id)` HTTP call is made. Since the list data was already fetched, the individual supplier data could be served from that cache.

**Suggestion:** Add a `getSupplierById(id)` method in `SupplierService` that first checks an in-memory cache from the list call before making a new HTTP request.

---

### 8.5 Artificial `delay(100)` in Interceptor Adds Latency to Every Request

**File:** `loading.interceptor.ts` line 32

```ts
return next.handle(request).pipe(
  delay(100), // ← artificial delay
  finalize(() => { ... })
);
```

This adds 100ms to **every HTTP request** in the application. This was likely added to debug the loading indicator but should not remain in production code.

---

## Summary Table

| # | Category | Severity | Count |
|---|---|---|---|
| 1 | Potential Issues | 🔴 High / 🟡 Medium | 11 |
| 2 | Code Formatting | 🟡 Medium | 6 |
| 3 | Naming Issues | 🟡 Medium | 10 items |
| 4 | Function Splitting | 🟡 Medium | 4 |
| 5 | Data Passing | 🔴 High | 5 |
| 6 | Child-Parent Relationship | 🟡 Medium | 3 |
| 7 | Reusable Component Issues | 🟡 Medium | 5 |
| 8 | Excessive Network Calls | 🔴 High | 5 |
