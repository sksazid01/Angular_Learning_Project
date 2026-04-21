import { Component } from '@angular/core';
import {HomeComponent} from './home/home.component'
import { HousingLocationComponent } from './housing-location/housing-location.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HomeComponent,
    HousingLocationComponent,
  ],
  template: `
  <section>
    <form>
      <input type="text" placeholder="Filter by city">
      <button class="primary" type="button">Search</button>
    </form>
  </section>
  <section class="results">
    <app-housing-location></app-housing-location>
  </section>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'homes';
}
