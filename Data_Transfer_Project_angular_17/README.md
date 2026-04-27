# Data Transfer Project (Angular)

This project demonstrates practical Angular data transfer patterns between parent and child components, plus shared state through a service.

## Project Goal

The app shows how to:

1. Send data from parent to child using `@Input`.
2. Send data from child to parent using `@Output` and `EventEmitter`.
3. Share state across sibling components using a service (`providedIn: 'root'`).
4. Transfer data across feature modules using a shared reactive service.

This project now uses exactly two Angular modules:

1. `HomeModule` -> contains `HomeComponent`, `LeftComponent`, `RightComponent`
2. `RoundModule` -> contains `RoundComponent`

## Current Component Structure

- `AppComponent` renders `HomeComponent`.
- `HomeComponent` is the parent container.
- `LeftComponent` and `RightComponent` are children of `HomeComponent`.
- `RoundComponent` is another child under `HomeComponent`, shown below left and right.
- `RightService` stores and updates shared right-side counter state.
- `HomeModule` declares/exports `HomeComponent`, and also declares `LeftComponent` + `RightComponent`.
- `RoundModule` declares/exports `RoundComponent`.

Relevant files:

- `src/app/homeModule/homeComponent.ts`
- `src/app/homeModule/home.module.ts`
- `src/app/leftComponent/leftComponent.ts`
- `src/app/rightComponent/rightComponent.ts`
- `src/app/rightComponent/rightService.ts`
- `src/app/roundModule/roundComponent.ts`
- `src/app/roundModule/roundComponent.css`
- `src/app/roundModule/round.module.ts`

## Workflow in This App

### 1) Parent to Child (Home -> Left)

- `HomeComponent` owns `homeCount`.
- `HomeComponent` passes it to `LeftComponent`:
	- `<app-left [parentHomeCount]="homeCount"></app-left>`
- `LeftComponent` receives it with:
	- `@Input() parentHomeCount = 0;`

Result: when Home count increases, Left immediately shows the updated parent value.

### 2) Child to Parent (Right -> Home)

- `RightComponent` exposes an output:
	- `@Output() rightCountChange = new EventEmitter<number>();`
- When right button is clicked, it emits the latest count.
- `HomeComponent` listens for it:
	- `<app-right (rightCountChange)="onRightCountChange($event)"></app-right>`

Result: Home receives data emitted by child component events.

UI note: Home also shows `Last Value Emitted By Right (Child -> Parent)` so this flow is visible directly.

### 3) Shared Sibling State (Left <-> Right via Service)

- `RightService` contains shared counter state (`rightButtonClickCount`).
- Both `LeftComponent` and `RightComponent` inject the same service instance.
- Any update from either component is visible in both places.

Result: Left button can update right-side value through shared service state.

### 4) Shared State Projection (Round Component)

- `RoundComponent` also injects `RightService`.
- It displays the same `rightButtonClickCount` value in a circular UI.
- When Left or Right increases the value, Round updates because all read the same shared state.

Result: one shared service value is reflected in multiple components at the same time.

### 5) Inter-Module Data Transfer (HomeModule <-> RoundModule)

- `RightComponent` lives in `HomeModule`.
- `RoundComponent` lives in `RoundModule`.
- Both modules communicate through `RightService` (`providedIn: 'root'`).
- `RightService` uses `BehaviorSubject<number>` so updates can be consumed reactively across modules.

Result: updates produced in `HomeModule` are consumed and displayed in `RoundModule`.

## Inter-Module Data Transfer Using RxJS (Detailed)

This project uses RxJS to transfer data between two Angular modules:

- Producer module: `HomeModule` (through `LeftComponent` and `RightComponent`)
- Consumer module: `RoundModule` (through `RoundComponent`)
- Shared bridge: `RightService`

### Step-by-step flow

1. `RightService` creates a private `BehaviorSubject<number>` as the source of truth.
2. `RightService` exposes a read-only stream `rightButtonClickCount$` with `asObservable()`.
3. Components in `HomeModule` push updates via `increaseCount()` or `setCount(value)`.
4. `RoundComponent` (in `RoundModule`) consumes `rightButtonClickCount$`.
5. The template uses Angular `async` pipe to render every new emission automatically.

### Why `BehaviorSubject` is used

- It always stores the latest value.
- New subscribers immediately receive the current value.
- It supports both reactive stream reads and direct current-value reads.

### Implementation in this project

- RxJS source: `src/app/rightComponent/rightService.ts`
- Producer updates: `src/app/leftComponent/leftComponent.ts`, `src/app/rightComponent/rightComponent.ts`, `src/app/homeModule/homeComponent.ts`
- Cross-module consumer: `src/app/roundModule/roundComponent.ts`

### Best-practice notes used here

- Keep the subject private.
- Expose observable publicly.
- Change state through service methods.
- Prefer `async` pipe in templates to avoid manual subscription cleanup.

## Sibling vs Inter-Module Clarification

### Are Left and Right siblings?

Yes. `LeftComponent` and `RightComponent` are sibling components because both are rendered by the same parent (`HomeComponent`).

### Is this inter-module communication?

Yes, now it is.

- `HomeModule` and `RoundModule` are separate Angular feature modules.
- Their components exchange state through a shared root-provided service (`RightService`).
- This is the common Angular inter-module data transfer approach.

## How To Identify Siblings And Modules

### How to identify sibling components

Two components are siblings if:

- They are rendered under the same parent component template.
- Neither one is the parent of the other.

In this project, `app-left`, `app-right`, and `app-round` are siblings inside `HomeComponent`.

### How to identify a module

A feature is an Angular module if it has an `@NgModule` class file (for example `home.module.ts`) that declares/exports components.

In this project:

- `HomeModule` and `RoundModule` are modules.
- `HomeComponent`, `LeftComponent`, and `RightComponent` are components declared inside `HomeModule`.

### Inter-component vs inter-module communication

- Inter-component communication: data flow between component classes (for example `@Input`, `@Output`, or shared service usage by sibling components).
- Inter-module communication: data exchange across components that belong to different Angular modules, typically through a shared service/store contract.

This project includes both.

## Data Transfer Theory (Short Notes)

### `@Input`

Use `@Input` when parent provides values to a child.

- Direction: Parent -> Child
- Best for: display/configuration values controlled by parent

### `@Output` + `EventEmitter`

Use `@Output` when child notifies parent about events or new values.

- Direction: Child -> Parent
- Best for: button clicks, form submit, state updates from child

### Shared Service

Use a service when multiple components need the same mutable state.

- Direction: any component can read/write shared state
- Best for: sibling communication and reusable business logic
- In this project: `LeftComponent`, `RightComponent`, `HomeComponent`, and `RoundComponent` read or update the same service-backed right count.
- Implementation detail: `BehaviorSubject` exposes reactive state (`rightButtonClickCount$`) for module-to-module consumption.

## Run the Project

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm start
```

Open:

- `http://localhost:4200/`

## Useful Scripts

- `npm start` -> Run Angular dev server
- `npm run build` -> Build project
- `npm test` -> Run unit tests

## Notes

- This project currently keeps state simple using plain number fields in a service.
- For larger apps, consider RxJS (`BehaviorSubject`/`signal`) for reactive shared state.
