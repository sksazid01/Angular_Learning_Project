import { Component, OnInit } from '@angular/core';
import { Supplier, SupplierService } from '../supplier.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {
  suppliers$!: Observable<Supplier[]>;

  constructor(
    private supplierService: SupplierService
  ) { }

  ngOnInit(): void {
    this.suppliers$ = this.supplierService.getSuppliers();
  }
}
