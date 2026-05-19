import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ENDPOINTS } from '../../../core/constants/endpoints';
import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressListService {
  constructor(private http: HttpClient) { }

  public getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(ENDPOINTS.address.addressList);
  }

  public addAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(ENDPOINTS.address.addressList, address);
  }

  public updateAddress(id: number, address: Address): Observable<Address> {
    return this.http.put<Address>(ENDPOINTS.address.addressListById(id), address);
  }
}
