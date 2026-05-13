import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectedAddress } from '../location-form/location-form.model';

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
  public getAddresses(): Observable<SelectedAddress[]> {
    return this.http.get<SelectedAddress[]>(`${this.baseUrl}/address_list`);
  }

  public addAddress(address: SelectedAddress): Observable<SelectedAddress> {
    return this.http.post<SelectedAddress>(`${this.baseUrl}/address_list`, address);
  }

  public updateAddress(id: number, address: SelectedAddress): Observable<SelectedAddress> {
    return this.http.put<SelectedAddress>(`${this.baseUrl}/address_list/${id}`, address);
  }
}
