import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Country, Division, District, Upazila, PostOffice, Address } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressFormService {
  private editAddressSource = new Subject<Address>();
  private addressFormSubmitSource = new Subject<void>();
  public editAddress$ = this.editAddressSource.asObservable();
  public addressFormSubmit$ = this.addressFormSubmitSource.asObservable();

  private readonly baseUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  public getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.baseUrl}/countries`);
  }

  public getDivisions(): Observable<Division[]> {
    return this.http.get<Division[]>(`${this.baseUrl}/divisions`);
  }

  public getDistrictsByDivision(divisionId: number): Observable<District[]> {
    const params = new HttpParams().set('division_id', String(divisionId));
    return this.http.get<District[]>(`${this.baseUrl}/districts`, { params });
  }

  public getUpazilasByDistrict(districtId: number): Observable<Upazila[]> {
    const params = new HttpParams().set('district_id', String(districtId));
    return this.http.get<Upazila[]>(`${this.baseUrl}/upazilas`, { params });
  }

  public getPostCodesByUpazila(upazilaId: number): Observable<PostOffice[]> {
    const params = new HttpParams().set('upazila_id', String(upazilaId));
    return this.http.get<PostOffice[]>(`${this.baseUrl}/postoffice`, { params });
  }

  public onEditAddress(address: Address): void {
    this.editAddressSource.next(address);
  }

  public onAddressFormSubmit(): void {
    this.addressFormSubmitSource.next();
  }
}
