To reduce redundant network calls and improve the performance of your Angular application, you can leverage state management techniques or shared data services. Since your `supplier-list` component already fetches the full list of supplierList, passing or making that locally available data accessible to the `supplier-details` and `supplier-info-update` (edit) components will eliminate unnecessary API calls.

Here are enterprise-level approaches to handle this data transfer effectively:

### 1. Simple Shared Data Service (Stateful Service)
You can modify your `SupplierService` or create a new dedicated state service to cache the list of supplierList using RxJS `BehaviorSubject`.
*   **How it works:** When the list is fetched in `/supplierList`, store it in the service via a `BehaviorSubject`. 
*   **Usage:** In the Details or Edit page, read the specific supplier data directly from the service state (e.g., finding the supplier by ID from the cached array).
*   **Enterprise Fit:** Great for small to medium projects where you just need to prevent duplicated REST calls but don't need heavy tooling. Allows instant, synchronous data retrieval across components.

### 2. Angular Router State (Navigation Extras)
When navigating using the router, Angular allows you to pass complex state objects.
*   **How it works:** In `supplier-list` (or `supplier-details`), use the router's `navigate` method with a `state` object containing the data:
    ```typescript
    this.router.navigate(['/supplierList', supplier.id], { state: { supplierData: supplier } });
    ```
*   **Usage:** The target component retrieves it using `history.state.supplierData`.
*   **Enterprise Fit:** Good for localized transitions when you are absolutely sure users will follow a direct path. However, it's not ideal if users refresh the page or load the details page directly via URL because the state will be lost (requiring a fallback API call).

### 3. Redux Pattern (NgRx / Ngxs / Akita)
State Management Libraries provide a single, immutable store.
*   **How it works:** When you fetch the list, an action is dispatched to store all supplierList centrally. The details and edit components map their UI state via selectors.
*   **Enterprise Fit:** This is the most robust enterprise-level solution for data flow. If a user tries to access `/supplierList/id/edit` and the store is empty (e.g., direct link visit), you can configure NgRx Effects or guards to transparently fetch just the missing entity. The drawback is the boilerplate code.

### 4. Route Resolvers
Angular provides a mechanism to fetch data before navigating to a route.
*   **How it works:** A resolver will intercept the route change, check your local cache (like the `BehaviorSubject` mentioned in approach #1) for the supplier data. If it exists, it returns it instantly; if not (e.g., page refresh), it calls the API.
*   **Enterprise Fit:** Prevents components from rendering until data is available or handles failures cleanly. Pairs excellently with a caching service to completely eliminate blinking/loading states when the user goes from list > details > edit.

### The Recommended Architecture
For an application scaling up:
1. **Combine Stateful Service with Route Resolvers:** Keep a cache of the supplierList retrieved during the list view.
2. **Build a Smart Resolver:** When a user clicks "Edit", the Resolver checks the cache first. If found, navigation acts instantly without HTTP requests. If not found (e.g. they bookmarked the edit page or hit F5), the Resolver elegantly fetches that single supplier from the backend.
3. **If the application grows very large:** Consider upgrading from a Stateful Service to **NgRx** or **SignalStore**.