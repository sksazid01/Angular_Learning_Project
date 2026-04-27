# Angular 17 to Angular 6 Differences Used in This Project

## 1. Component model

| Topic | Angular 17 style | Angular 6 style used here |
|---|---|---|
| Component type | Standalone component (`standalone: true`) | Module-based component declared in `NgModule` |
| Composition | Component-level `imports` | `NgModule` `declarations`, `imports`, and `exports` |

## 2. Dependency Injection syntax

| Topic | Angular 17 style | Angular 6 style used here |
|---|---|---|
| Service access | `inject(ServiceName)` inside class body | Constructor injection: `constructor(private service: ServiceName) {}` |

## 3. Component metadata syntax

| Topic | Angular 17 style | Angular 6 style used here |
|---|---|---|
| Style metadata key | `styleUrl` | `styleUrls` (array) |
| Template style | Commonly inline templates in simple components | External template files with `templateUrl` |

## 4. Application bootstrap architecture

| Topic | Angular 17 style | Angular 6 style used here |
|---|---|---|
| App configuration | `ApplicationConfig` + provider-based setup | `AppModule` bootstrap flow |
| Router setup | `provideRouter(routes)` | `RouterModule.forRoot(routes)` via `AppRoutingModule` |

## 5. Feature organization

| Topic | Angular 17 source project | Angular 6 migrated project |
|---|---|---|
| Feature shape | Standalone-capable app with modules | Fully module-driven structure |
| In this migration | `Home`, `Left`, `Right`, `Round` behavior | Same behavior recreated through `HomeModule` and `RoundModule` |

## 6. Data transfer pattern (concept preserved)

| Pattern | Angular 17 source | Angular 6 migrated project |
|---|---|---|
| Shared state | `BehaviorSubject` in shared service | Same `BehaviorSubject` in `RightService` |
| Parent to child | `@Input()` binding | Same `@Input()` binding |
| Child to parent | `@Output()` + `EventEmitter` | Same `@Output()` + `EventEmitter` |
| Sibling communication | Shared observable stream in service | Same shared observable stream in service |

## 7. Tooling/runtime implication

| Topic | Angular 17 | Angular 6 in this workspace |
|---|---|---|
| Build compatibility | Works with modern Node versions | Best with older Node for webpack compatibility |
| Verified setup here | N/A | Build succeeded with Node `10.24.1` |
