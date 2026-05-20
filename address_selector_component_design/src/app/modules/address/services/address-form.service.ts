import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ENDPOINTS } from '../../../core/constants/endpoints.constants';
import { Country, Division, District, Upazila, PostOffice } from '../domain/address.domain';

@Injectable({
  providedIn: 'root'
})
export class AddressFormService {

  constructor(
    private http: HttpClient
  ) { }

  public fetchCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(ENDPOINTS.address.countries);
  }

  public fetchDivisions(): Observable<Division[]> {
    return this.http.get<Division[]>(ENDPOINTS.address.divisions);
  }

  public fetchDistrictsByDivision(divisionId: number): Observable<District[]> {
    const params = new HttpParams().set('division_id', String(divisionId));
    return this.http.get<District[]>(ENDPOINTS.address.districts, { params });
  }

  public fetchUpazilasByDistrict(districtId: number): Observable<Upazila[]> {
    const params = new HttpParams().set('district_id', String(districtId));
    return this.http.get<Upazila[]>(ENDPOINTS.address.upazilas, { params });
  }

  public fetchPostCodesByUpazila(upazilaId: number): Observable<PostOffice[]> {
    const params = new HttpParams().set('upazila_id', String(upazilaId));
    return this.http.get<PostOffice[]>(ENDPOINTS.address.postOffice, { params });
  }
}
