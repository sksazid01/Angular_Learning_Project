import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ENDPOINTS } from '../../../core/constants/endpoints';
import { Country, Division, District, Upazila, PostOffice, Address } from '../domain/address.domain';

@Injectable({
  providedIn: 'root'
})
export class AddressFormService {

  constructor(
    private http: HttpClient
  ) { }

  public getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(ENDPOINTS.address.countries);
  }

  public getDivisions(): Observable<Division[]> {
    return this.http.get<Division[]>(ENDPOINTS.address.divisions);
  }

  public getDistrictsByDivision(divisionId: number): Observable<District[]> {
    const params = new HttpParams().set('division_id', String(divisionId));
    return this.http.get<District[]>(ENDPOINTS.address.districts, { params });
  }

  public getUpazilasByDistrict(districtId: number): Observable<Upazila[]> {
    const params = new HttpParams().set('district_id', String(districtId));
    return this.http.get<Upazila[]>(ENDPOINTS.address.upazilas, { params });
  }

  public getPostCodesByUpazila(upazilaId: number): Observable<PostOffice[]> {
    const params = new HttpParams().set('upazila_id', String(upazilaId));
    return this.http.get<PostOffice[]>(ENDPOINTS.address.postOffice, { params });
  }
}
