import { Component, OnInit } from '@angular/core';
import { Supplier } from '../../domain/supplier.domain';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {
  
  suppliers!: Supplier[];

  constructor(
    private supplierService: SupplierService
  ) { }

  ngOnInit(): void {
    this.supplierService.getSuppliers()
      .subscribe(s => this.suppliers = s);
  }
}
