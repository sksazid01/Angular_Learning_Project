import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocation } from '../housinglocation';

@Component({
  selector: 'app-housing-location',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="listing" *ngIf="housingLocation as h">
      <img class="listing-photo" [src]="h.photo" [alt]="h.name">
      <h2 class="listing-heading">{{ h.name }}</h2>
      <p class="listing-location">{{ h.city }}, {{ h.state }}</p>
      <p>Available Units: {{ h.availableUnits }}</p>
      <p>Wifi: {{ h.wifi ? 'Yes' : 'No' }}</p>
      <p>Laundry: {{ h.laundry ? 'Yes' : 'No' }}</p>
    </section>
  `,
  styleUrl: './housing-location.component.css'
})
export class HousingLocationComponent {
  @Input() housingLocation!: HousingLocation;
}
