# Data Transfer Project (Angular)

This project demonstrates practical Angular data transfer patterns between parent and child components, plus shared state through a service.

## Project Goal

The app shows how to:

1. Send data from parent to child using `@Input`.
2. Send data from child to parent using `@Output` and `EventEmitter`.
3. Share state across sibling components using a service (`providedIn: 'root'`).

## Current Component Structure

- `AppComponent` renders `HomeComponent`.
- `HomeComponent` is the parent container.
- `LeftComponent` and `RightComponent` are children of `HomeComponent`.
- `RightService` stores and updates shared right-side counter state.

Relevant files:

- `src/app/homeModule/homeComponent.ts`
- `src/app/leftMolude/leftComponent.ts`
- `src/app/rightModule/rightComponent.ts`
- `src/app/rightModule/rightService.ts`

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

### 3) Shared Sibling State (Left <-> Right via Service)

- `RightService` contains shared counter state (`rightButtonClickCount`).
- Both `LeftComponent` and `RightComponent` inject the same service instance.
- Any update from either component is visible in both places.

Result: Left button can update right-side value through shared service state.

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
