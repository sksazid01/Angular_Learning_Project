# Angular Homes App

This application is built by following the official [Angular v17 "Your First Angular App" tutorial](https://v17.angular.io/tutorial/first-app).

## Overview

The app is a directory of housing locations that demonstrates fundamental Angular concepts, including:
- **Standalone Components**: Building a modular UI with `HomeComponent`, `HousingLocationComponent`, and `DetailsComponent`.
- **Data Binding**: Passing housing location data into child components with property binding (`[]`) and `@Input()`.
- **Directives & Interpolation**: Rendering housing cards with `*ngFor` and displaying dynamic values with `{{ }}` interpolation.
- **Services & Dependency Injection**: Centralizing housing data and application submission logic in an injectable `HousingService`.
- **Routing**: Navigating from the home list to individual detail pages with `RouterModule`, `routerLink`, route parameters, and `<router-outlet>`.
- **Reactive Forms**: Collecting application details with `FormGroup`, `FormControl`, and `ReactiveFormsModule`.

## Current Features

- Displays a list of housing locations on the home page.
- Uses `HousingService` to provide all housing location data.
- Links each housing card to a route like `/details/:id`.
- Shows the selected housing location's photo, name, city, state, available units, wifi, and laundry information on the details page.
- Includes an application form for first name, last name, and email.
- Logs submitted application data through `HousingService.submitApplication()`.

## Official Tutorial References

Links to the different steps of the tutorial:
- [Tutorial Introduction](https://v17.angular.io/tutorial/first-app)
- [Lesson 09: Angular Services](https://v17.angular.io/tutorial/first-app/first-app-lesson-09)
- [Lesson 10: Add routes to the application](https://v17.angular.io/tutorial/first-app/first-app-lesson-10)
- [Lesson 11: Integrate details page into application](https://v17.angular.io/tutorial/first-app/first-app-lesson-11)
- [Lesson 12: Adding a form to your Angular app](https://v17.angular.io/tutorial/first-app/first-app-lesson-12)

## Prerequisites

Before running this project locally, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (active LTS version recommended)
- [Angular CLI](https://v17.angular.io/cli) (`npm install -g @angular/cli`)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm start
   ```

3. **View the app:**
   Open your browser and navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Useful Commands

```bash
npm start
npm run build
npm test
```
