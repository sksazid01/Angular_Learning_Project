import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressListService {
  constructor(private http: HttpClient) { }

  public getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`/address_list`);
  }

  public addAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(`/address_list`, address);
  }

  public updateAddress(id: number, address: Address): Observable<Address> {
    return this.http.put<Address>(`/address_list/${id}`, address);
  }
}
