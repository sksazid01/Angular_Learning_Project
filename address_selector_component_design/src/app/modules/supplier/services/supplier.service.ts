import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ENDPOINTS } from '../../../core/constants/endpoints';
import { Supplier } from '../domain/supplier.domain';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  constructor(private http: HttpClient) { }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(ENDPOINTS.suppliers.list);
  }

  getSupplier(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(ENDPOINTS.suppliers.byId(id));
  }

  addSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(ENDPOINTS.suppliers.list, supplier);
  }

  updateSupplier(id: number, supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(ENDPOINTS.suppliers.byId(id), supplier);
  }

  deleteSupplier(id: number): Observable<any> {
    return this.http.delete(ENDPOINTS.suppliers.byId(id));
  }
}
