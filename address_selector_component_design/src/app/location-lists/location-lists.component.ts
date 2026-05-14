import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from '../location-form/location-form.model';
import { LocationListService } from './location-lists.service';

@Component({
  selector: 'app-location-lists',
  templateUrl: './location-lists.component.html',
  styleUrls: ['./location-lists.component.css']
})
export class LocationListComponent implements OnInit {
  // =========================
  // Properties
  // =========================
  public savedAddresses$: Observable<Address[]> = new Observable<Address[]>();
  public addressBeingEdited: Address | null = null;

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
  public onEditAddress(address: Address): void {
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
