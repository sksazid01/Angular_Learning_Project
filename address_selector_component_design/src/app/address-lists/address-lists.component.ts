import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from '../address-form/address-form.model';
import { AddressListService } from './address-lists.service';
import { AddressFormService } from '../address-form/address-form.service';

@Component({
  selector: 'app-address-lists',
  templateUrl: './address-lists.component.html',
  styleUrls: ['./address-lists.component.css']
})
export class AddressListComponent implements OnInit {
  public savedAddresses$: Observable<Address[]> = new Observable<Address[]>();

  constructor(
    private addressListService: AddressListService,
    private addressFormService: AddressFormService
  ) { }

  ngOnInit(): void {
    this.loadAddresses();
    this.addressFormService.addressFormSubmit$.subscribe(() => {
      this.loadAddresses();
    });
  }

  private loadAddresses(): void {
    this.savedAddresses$ = this.addressListService.getAddresses();
  }

  public editAddress(address: Address): void {
    this.addressFormService.onEditAddress(address);
  }
  
}
