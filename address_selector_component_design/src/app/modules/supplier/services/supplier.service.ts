import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ENDPOINTS } from '../../../core/constants/endpoints.constants';
import { Supplier } from '../domain/supplier.domain';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  constructor(private http: HttpClient) { }

  getSupplierList(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(ENDPOINTS.supplier.list);
  }

  getSupplierById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(ENDPOINTS.supplier.byId(id));
  }

  addSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(ENDPOINTS.supplier.list, supplier);
  }

  updateSupplier(id: number, supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(ENDPOINTS.supplier.byId(id), supplier);
  }

  deleteSupplier(id: number): Observable<any> {
    return this.http.delete(ENDPOINTS.supplier.byId(id));
  }
}
