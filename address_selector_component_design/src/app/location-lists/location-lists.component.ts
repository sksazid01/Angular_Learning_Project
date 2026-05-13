import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectedAddress } from '../location-form/location-form.model';
import { LocationListService } from './location-lists.service';

@Component({
  selector: 'app-location-lists',
  templateUrl: './location-lists.component.html',
  styleUrls: ['./location-lists.component.css']
})
export class AddressListComponent implements OnInit {
  // =========================
  // Properties
  // =========================
  public savedAddresses$: Observable<SelectedAddress[]> = new Observable<SelectedAddress[]>();
  public addressBeingEdited: SelectedAddress | null = null;

  // =========================
  // Constructor
  // =========================
  constructor(private locationListService: LocationListService) { }

  // =========================
  // Lifecycle Hooks
  // =========================
  ngOnInit(): void {
    this.loadAddresses();
  }
  
  // =========================
  // Public UI Methods
  // =========================
  public onEditAddress(address: SelectedAddress): void {
    this.addressBeingEdited = address;
  }

  public onAddressFormSubmit(): void {
    this.addressBeingEdited = null;
    this.loadAddresses();
  }

  // =========================
  // Data Loaders
  // =========================
  private loadAddresses(): void {
    this.savedAddresses$ = this.locationListService.getAddresses();
  }
}
