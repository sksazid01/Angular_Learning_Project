import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SelectedAddress } from '../location-form/location-form.model';

@Injectable({
  providedIn: 'root'
})
export class LocationListService {
  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:3000';

  getAddresses(): Observable<SelectedAddress[]> {
    return this.http.get<SelectedAddress[]>(`${this.baseUrl}/address_list`);
  }

  addAddress(entry: SelectedAddress): Observable<SelectedAddress> {
    return this.http.post<SelectedAddress>(`${this.baseUrl}/address_list`, entry);
  }

  updateAddress(id: number, entry: SelectedAddress): Observable<SelectedAddress> {
    return this.http.put<SelectedAddress>(`${this.baseUrl}/address_list/${id}`, entry);
  }
}