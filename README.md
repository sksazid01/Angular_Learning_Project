# Angular Homes App

This application is built by following the official [Angular v17 "Your First Angular App" tutorial](https://v17.angular.io/tutorial/first-app).

## Overview

The app is a directory of housing locations that demonstrates fundamental and essential Angular concepts, including:
- **Components**: Building a modular UI with parent (`HomeComponent`) and child (`HousingLocationComponent`) structures.
- **Data Binding**: Passing data between components using property binding (`[]`) and `@Input()`.
- **Directives & Interpolation**: Rendering dynamic list data using `*ngFor` and displaying object properties using `{{ }}` interpolation.
- **Services & Dependency Injection**: Centralizing data management using an injectable `HousingService`.
- **Routing**: Implementing app navigation across different views using the `<router-outlet>` and `RouterModule`.

## Official Tutorial References

Links to the different steps of the tutorial:
- [Tutorial Introduction](https://v17.angular.io/tutorial/first-app)
- [Lesson 09: Angular Services](https://v17.angular.io/tutorial/first-app/first-app-lesson-09)
- [Lesson 10: Add routes to the application](https://v17.angular.io/tutorial/first-app/first-app-lesson-10)

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
   ng serve
   ```

3. **View the app:**
   Open your browser and navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
