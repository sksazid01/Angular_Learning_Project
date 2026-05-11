import { Component, ViewChild } from '@angular/core';
import { SelectedAddress } from './location-selector/location.model';
import { LoadingService } from './core/services/loading.service';
import { LocationSelectorComponent } from './location-selector/location-selector.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'address_selector_component_design';
  receivedAddress: SelectedAddress | null = null;
  isLoading$ = this.loadingService.isLoading$;

  @ViewChild('locationSelector') locationSelector!: LocationSelectorComponent;

  constructor(private loadingService: LoadingService) {}

  onAddressSubmit(address: SelectedAddress): void {
    this.receivedAddress = address;
    console.log('Parent received address:', address);
  }

  onEditRequest(entry: SelectedAddress): void {
    if (this.locationSelector) {
      this.locationSelector.startEdit(entry);
    }
  }
}
