import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Country, Division, District, Upazila, PostCode } from './location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private http = inject(HttpClient);

  private baseUrl = 'http://localhost:3000';

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.baseUrl}/countries`);
  }

  getDivisions(): Observable<Division[]> {
    return this.http.get<Division[]>(`${this.baseUrl}/divisions`);
  }

  getDistrictsByDivision(divisionId: number): Observable<District[]> {
    const params = new HttpParams().set('division_id', divisionId);

    return this.http.get<District[]>(`${this.baseUrl}/districts`, { params });
  }

  getUpazilasByDistrict(districtId: number): Observable<Upazila[]> {
    const params = new HttpParams().set('district_id', districtId);

    return this.http.get<Upazila[]>(`${this.baseUrl}/upazilas`, { params });
  }

  getPostCodesByUpazila(
    divisionId: number,
    districtId: number,
    upazilaName: string
  ): Observable<PostCode[]> {
    const params = new HttpParams()
      .set('division_id', divisionId)
      .set('district_id', districtId)
      .set('upazila', upazilaName);

    return this.http.get<PostCode[]>(`${this.baseUrl}/postcodes`, { params });
  }
}