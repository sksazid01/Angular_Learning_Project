import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from '../location-form/location-form.model';
import { LocationListService } from './location-lists.service';
import { LocationFormService } from '../location-form/location-form.service';

@Component({
  selector: 'app-location-lists',
  templateUrl: './location-lists.component.html',
  styleUrls: ['./location-lists.component.css']
})
export class LocationListComponent implements OnInit {
  public savedAddresses$: Observable<Address[]> = new Observable<Address[]>();

  constructor(
    private locationListService: LocationListService,
    private locationFormService: LocationFormService
  ) { }

  ngOnInit(): void {
    this.loadAddresses();
    this.locationFormService.addressFormSubmit$.subscribe(() => {
      this.loadAddresses();
    });
  }

  private loadAddresses(): void {
    this.savedAddresses$ = this.locationListService.getAddresses();
  }

  public editAddress(address: Address): void {
    this.locationFormService.onEditAddress(address);
  }
  
}
