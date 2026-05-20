import { Component, OnInit } from '@angular/core';
import { Supplier } from '../../domain/supplier.domain';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {

  supplierList!: Supplier[];

  constructor(
    private supplierService: SupplierService
  ) { }

  ngOnInit(): void {
    this.supplierService.getSupplierList()
      .subscribe(supplierList => {
        this.supplierList = supplierList
      })
  }

  getSupplierAddress(supplier: Supplier): string {
    if (!supplier.address) return 'N/A';

    return (supplier.address.postOffice ? (supplier.address.postOffice.postOffice + ' ') : '') +
      (supplier.address.postOffice ? ('(' + supplier.address.postOffice.postCode + '), ') : '') +
      (supplier.address.upazila ? (supplier.address.upazila.name + ', ') : '') +
      (supplier.address.district ? (supplier.address.district.name + ', ') : '') +
      (supplier.address.division ? (supplier.address.division.name + ', ') : '') +
      (supplier.address.country ? supplier.address.country.name : '');
  }
}
