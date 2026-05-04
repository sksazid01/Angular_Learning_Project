import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocationSelectorComponent } from './location-selector/location-selector.component';


import { CommonModule } from '@angular/common';

import { SelectedAddress } from './location-selector/location.model';

// CommonModule is imported to use '<pre>{{ receivedAddress | json }}</pre>' in the template for displaying the received address data in a readable format.'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LocationSelectorComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'address_selector_component_design';


  receivedAddress: SelectedAddress | null = null; // variable decleared to hold the received address data from child component
  onAddressSubmit(address: SelectedAddress): void {
    this.receivedAddress = address;

    console.log('Parent received address:', address);
  }
}