import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SelectedAddress } from '../location-selector/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationEntriesService {

  entriesSubject: BehaviorSubject<SelectedAddress[]> = new BehaviorSubject<SelectedAddress[]>([]);
  entries$: Observable<SelectedAddress[]> = this.entriesSubject.asObservable();
  
  constructor(private http: HttpClient) {}

  private baseUrl = 'http://localhost:3000';

  getEntries(): Observable<SelectedAddress[]> {
    this.http.get<SelectedAddress[]>(`${this.baseUrl}/saved_addresses`).subscribe(entries => {
      this.entriesSubject.next(entries);
    });
    console.log('Fetched entries:', this.entriesSubject.value);
    return this.entries$;
  }
  postEntry(entry: SelectedAddress): Observable<SelectedAddress> {
    return this.http
    .post<SelectedAddress>(`${this.baseUrl}/saved_addresses`, entry)
    .pipe(
      tap(() => {
        // After successfully posting the entry, fetch the updated list of entries
        this.getEntries();
      })
    );
  }

  updateEntry(id: number, entry: SelectedAddress): Observable<SelectedAddress> {
    return this.http
      .put<SelectedAddress>(`${this.baseUrl}/saved_addresses/${id}`, entry)
      .pipe(
        tap(() => {
          this.getEntries();
        })
      );
  }
}