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
  savedAddresses$: Observable<SelectedAddress[]> = new Observable<SelectedAddress[]>(); 
  addressBeingEdited: SelectedAddress | null = null;

  constructor(private locationListService: LocationListService) { }

  ngOnInit(): void {
    this.savedAddresses$ = this.locationListService.getAddresses();
  }
  
  onEditAddress(entry: SelectedAddress): void {
    this.addressBeingEdited = entry;
  }

  onAddressFormSubmit(entry?: SelectedAddress): void {
    this.addressBeingEdited = null;
    this.savedAddresses$ = this.locationListService.getAddresses();
  }
}
