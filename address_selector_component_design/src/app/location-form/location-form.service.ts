import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Country, Division, District, Upazila, PostOffice } from './location-form.model';

@Injectable({
  providedIn: 'root'
})
export class LocationFormService {
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
}
