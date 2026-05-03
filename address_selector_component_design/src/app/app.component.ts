import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocationSelectorComponent } from './location-selector/location-selector.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LocationSelectorComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'address_selector_component_design';
}
