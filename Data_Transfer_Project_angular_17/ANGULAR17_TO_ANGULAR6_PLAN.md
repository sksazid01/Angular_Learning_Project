# Angular 17 to Angular 6 Migration Plan (Project-Specific)

## Goal
Downgrade this project from Angular 17 to Angular 6 in a controlled way, with minimal feature loss and clear rollback points.

## Important Reality Check
This is a major backward migration across many breaking changes. A direct package downgrade is not reliable.

Recommended approach:
1. Create a clean Angular 6 baseline.
2. Port application code module by module.
3. Replace Angular 14+ and Angular 17-only APIs with Angular 6-compatible patterns.

## Current Project Facts (Detected)
1. Uses Angular 17 dependencies in package.json.
2. Uses standalone bootstrap in src/main.ts.
3. Uses ApplicationConfig and provideRouter in src/app/app.config.ts.
4. Uses standalone component option in src/app/app.component.ts.
5. Uses inject() API in:
   - src/app/homeModule/homeComponent.ts
   - src/app/leftComponent/leftComponent.ts
   - src/app/rightComponent/rightComponent.ts
   - src/app/roundModule/roundComponent.ts
6. Uses styleUrl (singular) in multiple components; Angular 6 expects styleUrls (array).
7. Uses Angular 17 builder config in angular.json (application builder and browser entry syntax differ from Angular 6 format).

## Target Version Matrix (Angular 6 Compatible)
Use a dedicated environment for old tooling.

1. Node.js: 8.9+ or 10.x (recommend Node 10 LTS for better npm compatibility with legacy packages)
2. npm: compatible with chosen Node version
3. @angular/*: 6.1.x (or 6.0.x consistently)
4. @angular/cli: 6.2.x
5. @angular-devkit/build-angular: 0.8.x
6. typescript: ~2.7.x or ~2.9.x
7. rxjs: ^6.0.0
8. zone.js: ~0.8.26

## Migration Strategy

### Phase 0: Safety and Branching
1. Create a migration branch.
2. Tag current working state for rollback.
3. Keep a copy of current package-lock.json (or regenerate cleanly in the new baseline).

Suggested commands:

    git checkout -b chore/downgrade-angular17-to-6
    git tag backup-before-ng6-downgrade

### Phase 1: Build a Clean Angular 6 Baseline
Best practice is a fresh Angular 6 app, then move source code.

1. Use Node 10 environment for this phase.
2. Install Angular CLI 6 globally or use npx with pinned version.
3. Generate a new Angular 6 project shell.
4. Compare generated angular.json, tsconfig, polyfills, test setup with this project.

Suggested commands:

    nvm use 10
    npm i -g @angular/cli@6.2.9
    ng new Data_Transfer_Project_ng6 --style=css --routing

Then copy your app source modules/services/components into the new shell.

### Phase 2: Convert Bootstrap and Root App Structure
Angular 6 does not support standalone bootstrap.

1. Replace src/main.ts bootstrapApplication with platformBrowserDynamic().bootstrapModule(AppModule).
2. Create/use src/app/app.module.ts as root module.
3. Remove standalone: true and imports: [...] from AppComponent metadata.
4. Remove app.config.ts pattern and use module-based router setup if needed.

Files affected in this project:
1. src/main.ts
2. src/app/app.component.ts
3. src/app/app.config.ts (remove or stop using)
4. src/app/app.routes.ts (adapt into RouterModule.forRoot if routing is needed)
5. src/app/app.module.ts (create/update)

### Phase 3: Replace Angular 14+ APIs with Angular 6 APIs
#### 3.1 Replace inject() with constructor injection
Update each class:

From pattern:
private readonly svc = inject(ServiceType);

To pattern:
constructor(private svc: ServiceType) {}

Apply to:
1. src/app/homeModule/homeComponent.ts
2. src/app/leftComponent/leftComponent.ts
3. src/app/rightComponent/rightComponent.ts
4. src/app/roundModule/roundComponent.ts

#### 3.2 Replace styleUrl with styleUrls
Angular 6 component decorator expects:

styleUrls: ['./component.css']

Apply to:
1. src/app/app.component.ts
2. src/app/homeModule/homeComponent.ts
3. src/app/leftComponent/leftComponent.ts
4. src/app/rightComponent/rightComponent.ts
5. src/app/roundModule/roundComponent.ts

#### 3.3 Keep RxJS usage compatible
Current right service uses BehaviorSubject and asObservable, which are fine in RxJS 6.

Reference:
1. src/app/rightComponent/rightService.ts

### Phase 4: Align Angular CLI Config to v6
Current angular.json is Angular 17 style and must be normalized to Angular 6 shape.

Key updates:
1. Build builder should be browser, not application.
2. Use main and polyfills file entries as expected by CLI 6.
3. Ensure test target has compatible options.
4. Regenerate by starting from fresh ng6 angular.json, then merge custom paths/assets/styles.

Primary file:
1. angular.json

### Phase 5: Downgrade Dependencies
In package.json, pin compatible versions and remove Angular 17-only ecosystem assumptions.

Typical dependency block direction:
1. @angular/* to 6.1.x
2. rxjs to ^6.0.0
3. zone.js to ~0.8.26
4. typescript to ~2.9.2
5. devkit/cli/compiler-cli to Angular 6 matching range

Then reinstall from scratch:

    rm -rf node_modules package-lock.json
    npm install

Primary file:
1. package.json

### Phase 6: TypeScript and Compiler Settings Backport
Current tsconfig uses strict and modern options not available or practical in TS 2.9.

Adjustments:
1. target/module lowered to Angular 6-friendly values.
2. Remove unsupported strict flags introduced later.
3. Keep only options supported by TS 2.9.

Primary files:
1. tsconfig.json
2. tsconfig.app.json
3. tsconfig.spec.json

### Phase 7: Polyfills and Browser Support
Ensure Angular 6 polyfills format is present (usually src/polyfills.ts with zone.js import).

Primary files:
1. src/polyfills.ts
2. angular.json (polyfills path reference)

## Exact File-by-File Change Map (Where and How)

Use this section as your hands-on checklist while editing.

### 1) src/main.ts
Why:
Angular 6 cannot use standalone bootstrap.

Change:
1. Remove bootstrapApplication import and call.
2. Use AppModule bootstrap flow.

How:

   import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
   import { AppModule } from './app/app.module';

   platformBrowserDynamic().bootstrapModule(AppModule)
     .catch(err => console.error(err));

### 2) src/app/app.component.ts
Why:
Angular 6 components are NgModule-declared, not standalone.

Change:
1. Remove standalone: true.
2. Remove imports: [HomeModule] from component decorator.
3. Rename styleUrl to styleUrls with array format.

How:

   @Component({
     selector: 'app-root',
     templateUrl: './app.component.html',
     styleUrls: ['./app.component.css']
   })

### 3) src/app/app.module.ts (create or replace)
Why:
Root NgModule is required by Angular 6 bootstrap.

Change:
1. Declare AppComponent.
2. Import BrowserModule and HomeModule.
3. Bootstrap AppComponent.

How:

   @NgModule({
     declarations: [AppComponent],
     imports: [BrowserModule, HomeModule],
     providers: [],
     bootstrap: [AppComponent]
   })
   export class AppModule {}

### 4) src/app/app.config.ts and src/app/app.routes.ts
Why:
ApplicationConfig/provideRouter are newer patterns.

Change:
1. Stop using app.config.ts in bootstrap flow.
2. Move routing to AppRoutingModule with RouterModule.forRoot(routes) if routing is needed.
3. If routes are empty, remove routing wiring entirely in first pass.

### 5) Replace inject() usage in component classes
Files:
1. src/app/homeModule/homeComponent.ts
2. src/app/leftComponent/leftComponent.ts
3. src/app/rightComponent/rightComponent.ts
4. src/app/roundModule/roundComponent.ts

Why:
inject() is not available in Angular 6.

Change pattern:
1. Remove field initializer style injection.
2. Add constructor injection.

How:

   // from
   private readonly rightService = inject(RightService);

   // to
   constructor(private rightService: RightService) {}

### 6) Replace styleUrl in all components
Files:
1. src/app/app.component.ts
2. src/app/homeModule/homeComponent.ts
3. src/app/leftComponent/leftComponent.ts
4. src/app/rightComponent/rightComponent.ts
5. src/app/roundModule/roundComponent.ts

Why:
Angular 6 expects styleUrls array.

Change pattern:

   styleUrl: './x.css'

to:

   styleUrls: ['./x.css']

### 7) angular.json (critical format backport)
Why:
Current file is Angular 17 format.

Change:
1. Start from a fresh Angular 6 generated angular.json.
2. Copy project name, sourceRoot, assets, styles.
3. Ensure build target uses @angular-devkit/build-angular:browser.
4. Ensure serve/test targets match Angular 6 schema.

### 8) package.json (downgrade package set)
Why:
Current dependencies are Angular 17 and TypeScript 5.x.

Change:
1. Pin all @angular/* to 6.1.x.
2. Set @angular/cli to 6.2.x and @angular-devkit/build-angular to 0.8.x.
3. Set typescript to ~2.9.2.
4. Keep rxjs at ^6.0.0 and zone.js at ~0.8.26.

Then reinstall:

   rm -rf node_modules package-lock.json
   npm install

### 9) tsconfig.json, tsconfig.app.json, tsconfig.spec.json
Why:
Current compiler options are too modern for TypeScript 2.9.

Change:
1. Remove strict flags unavailable in old TS (for example noImplicitOverride, noPropertyAccessFromIndexSignature).
2. Lower target/module to Angular 6-compatible values.
3. Keep minimal options from fresh Angular 6 template, then merge only required customizations.

### 10) Keep/verify RxJS-based intermodule communication
Files:
1. src/app/rightComponent/rightService.ts
2. src/app/leftComponent/leftComponent.ts
3. src/app/rightComponent/rightComponent.ts
4. src/app/roundModule/roundComponent.ts
5. src/app/homeModule/homeComponent.ts

Status:
Current shared right-value flow already uses BehaviorSubject/asObservable and is compatible with RxJS 6.

Verify after downgrade:
1. Right button increments stream value.
2. Home and Round update from same stream.
3. Left still receives Home Count through parent-child input binding.

### 11) Quick detection commands before/after edits
Use these to find unsupported Angular 17 patterns:

   rg "bootstrapApplication|ApplicationConfig|provideRouter|standalone: true|inject\(|styleUrl" src

## Validation Checklist
Run after each phase, not only at the end.

1. Install succeeds with no peer dependency conflicts.
2. ng serve starts on Angular 6 toolchain.
3. App renders Home, Left, Right, Round components.
4. Clicking Right button increments shared count and updates Home/Round views.
5. Left component correctly receives Home Count from Home via parent-child binding.
6. Tests run (or are updated to Angular 6-compatible test setup).

Suggested commands:

    npm run start
    npm run test

## Risk Register
1. High: Toolchain mismatch (Node/npm/CLI incompatibility).
   - Mitigation: lock Node to 10 during migration.
2. High: Config drift in angular.json.
   - Mitigation: copy from fresh Angular 6 scaffold first, then merge custom settings.
3. Medium: TypeScript option incompatibilities.
   - Mitigation: simplify tsconfig to minimal Angular 6 defaults.
4. Medium: Hidden usage of newer APIs beyond current files.
   - Mitigation: search for standalone, inject(, styleUrl, provideRouter, bootstrapApplication.

## Work Breakdown (Suggested Execution Order)
1. Create Angular 6 baseline shell.
2. Port source files.
3. Convert bootstrap/module structure.
4. Refactor inject() and styleUrl usage.
5. Align dependencies.
6. Align angular.json and tsconfig.
7. Run and fix compile/runtime issues.
8. Run tests and finalize.

## Acceptance Criteria
1. Project builds and serves using Angular 6 CLI/toolchain.
2. Core data transfer behavior works exactly as before.
3. No Angular 14+ or 17-only APIs remain.
4. Build/test commands execute successfully on locked legacy environment.

## Optional Alternative (Lower Risk)
If Angular 6 is mandatory only for learning, keep this Angular 17 project as-is and create a separate Angular 6 practice project with the same feature set. This avoids destabilizing your working Angular 17 codebase.