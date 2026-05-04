import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Country, Division, District, Upazila, PostCode } from './location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http: HttpClient) {}

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

  getPostCodesByUpazila(upazilaId: number): Observable<PostCode[]> {
    const params = new HttpParams().set('upazila_id', String(upazilaId));

    return this.http.get<PostCode[]>(`${this.baseUrl}/postcodes`, { params });
  }
}