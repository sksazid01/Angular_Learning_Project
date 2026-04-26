# Angular Homes App

This project is a housing-location directory built while following the official Angular v17 **Your First Angular App** tutorial.

The app demonstrates standalone Angular components, routing, services, dependency injection, reactive forms, list filtering, and HTTP-style data loading from a local JSON API.

## Project Snapshot

- **Framework:** Angular 17.2
- **Language:** TypeScript
- **Routing:** Angular Router with a home route and details route
- **Forms:** Angular Reactive Forms
- **Data source:** `db.json`, served locally at `http://localhost:3000/locations`
- **Package manager:** npm
- **License:** MIT

## Current Features

- Displays a list of housing locations on the home page.
- Loads housing data through `HousingService`.
- Fetches housing locations from a local JSON API instead of hard-coded component data.
- Filters the location list by city from the home page search box.
- Renders each location with a reusable `HousingLocationComponent`.
- Links each card to `/details/:id`.
- Shows details for a selected housing location, including photo, city, state, available units, wifi, and laundry.
- Includes an application form for first name, last name, and email.
- Sends application form values to `HousingService.submitApplication()`, which currently logs the submission.

## App Structure

```text
src/app/
  app.component.ts
  routes.ts
  housing.service.ts
  housinglocation.ts
  home/
    home.component.ts
    home.component.css
  housing-location/
    housing-location.component.ts
    housing-location.component.css
  details/
    details.component.ts
    details.component.css
db.json
```

Key files:

- `src/app/home/home.component.ts` loads all housing locations and filters them by city.
- `src/app/housing-location/housing-location.component.ts` displays a single housing card and links to the details page.
- `src/app/details/details.component.ts` reads the route id, loads one housing location, and handles the apply form.
- `src/app/housing.service.ts` centralizes data fetching and application submission behavior.
- `src/app/routes.ts` defines the home and details routes.
- `db.json` contains the local housing-location data used by the app.

## Commit History

| Commit | Change |
| --- | --- |
| `543f9c2` | Created the Angular documentation practice project with starter Angular files, assets, styles, and npm configuration. |
| `68ce140` | Wired `HomeComponent` data into `HousingLocationComponent` and introduced the `HousingLocation` interface. |
| `24ea960` | Rendered housing cards with `*ngFor` and adjusted component bindings. |
| `6336918` | Moved housing data into injectable `HousingService`. |
| `1876167` | Added application routes, `DetailsComponent`, route configuration, and router outlet setup. |
| `d0ac81e` | Integrated the details page and added details-page styling. |
| `87988c0` | Added the first project README with setup instructions and tutorial links. |
| `5825532` | Added a reactive application form to the details page and documented Lessons 9-12. |
| `ea74536` | Added home-page search/filter behavior. |
| `4b4bdd8` | Added HTTP communication by moving housing data into `db.json` and fetching it from the local API. |

## Tutorial Progress

This repository currently includes work through Lesson 14 of the Angular v17 first-app tutorial:

- [Tutorial introduction](https://v17.angular.io/tutorial/first-app)
- [Lesson 09: Angular services](https://v17.angular.io/tutorial/first-app/first-app-lesson-09)
- [Lesson 10: Add routes to the application](https://v17.angular.io/tutorial/first-app/first-app-lesson-10)
- [Lesson 11: Integrate details page into application](https://v17.angular.io/tutorial/first-app/first-app-lesson-11)
- [Lesson 12: Adding a form to your Angular app](https://v17.angular.io/tutorial/first-app/first-app-lesson-12)
- [Lesson 13: Add the search feature to your app](https://v17.angular.io/tutorial/first-app/first-app-lesson-13)
- [Lesson 14: Add HTTP communication to your app](https://v17.angular.io/tutorial/first-app/first-app-lesson-14)

## Prerequisites

Install these before running the project:

- [Node.js](https://nodejs.org/) using an active LTS version
- npm
- [Angular CLI](https://v17.angular.io/cli)
- JSON Server, or another local server that can serve `db.json`

Install Angular CLI globally if needed:

```bash
npm install -g @angular/cli
```

Install JSON Server globally if needed:

```bash
npm install -g json-server
```

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local JSON API in one terminal:

```bash
json-server --watch db.json
```

The housing data should be available at:

```text
http://localhost:3000/locations
```

Start the Angular development server in another terminal:

```bash
npm start
```

Open the app at:

```text
http://localhost:4200/
```

## Useful Commands

```bash
npm start
npm run build
npm run watch
npm test
npm run e2e
```

## Notes

- The app expects the local API to run on port `3000`.
- Housing images are loaded from the Angular tutorial asset URLs.
- Application submissions are logged in the browser console; they are not persisted.
