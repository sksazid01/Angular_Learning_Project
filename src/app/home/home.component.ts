import { Component, inject, ɵsetInjectorProfilerContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingService } from '../housing.service';
import { HousingLocationComponent } from '../housing-location/housing-location.component';
import { HousingLocation } from '../housinglocation';
import { DetailsComponent } from '../details/details.component'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HousingLocationComponent,
    DetailsComponent
  ],
  template: `
    <section>
      <form>
        <input type="text" placeholder="Filter by city"  #filter>
        <button class="primary" type="button" (click)="filterResults(filter.value)">Search</button>
      </form>
    </section>

    <section>
        <app-details> </app-details>
    </section>


    <section class="results">
     <app-housing-location *ngFor="let housingLocation of filteredLocationList" 
        [housingLocation]="housingLocation">
      </app-housing-location>
    </section>
  `,
  styleUrls: ['./home.component.css'],
})

export class HomeComponent {
  housingLocationList: HousingLocation[] = [];
  filteredLocationList: HousingLocation[] = [];
  housingService: HousingService = inject(HousingService);

  filterResults(text: string) {
  if (!text) {
    this.filteredLocationList = this.housingLocationList;
    return;
  }

  this.filteredLocationList = this.housingLocationList.filter(
    housingLocation => housingLocation?.city.toLowerCase().includes(text.toLowerCase())
  );
}

  constructor() {
    this.housingLocationList = this.housingService.getAllHousingLocations();
    this.filteredLocationList = this.housingLocationList;
  }
}