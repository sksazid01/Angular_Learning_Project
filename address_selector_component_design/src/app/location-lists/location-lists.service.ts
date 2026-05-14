import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from '../location-form/location-form.model';

@Injectable({
  providedIn: 'root'
})
export class LocationListService {
  // =========================
  // Properties
  // =========================
  private readonly baseUrl = 'http://localhost:3000';

  // =========================
  // Constructor
  // =========================
  constructor(private http: HttpClient) { }

  // =========================
  // Public HTTP API Methods
  // =========================
  public getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.baseUrl}/address_list`);
  }

  public addAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(`${this.baseUrl}/address_list`, address);
  }

  public updateAddress(id: number, address: Address): Observable<Address> {
    return this.http.put<Address>(`${this.baseUrl}/address_list/${id}`, address);
  }
}
