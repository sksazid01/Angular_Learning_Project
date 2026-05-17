import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Supplier, SupplierService } from '../supplier.service';

@Component({
  selector: 'app-supplier-details',
  templateUrl: './supplier-details.component.html',
  styleUrls: ['./supplier-details.component.css']
})
export class SupplierDetailsComponent implements OnInit {
  supplier: Supplier | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.supplierService.getSupplier(id).subscribe(s => this.supplier = s);
    }
  }

  deleteSupplier() {
    if (this.supplier && this.supplier.id) {
      this.supplierService.deleteSupplier(this.supplier.id).subscribe(() => {
        this.router.navigate(['/suppliers']);
      });
    }
  }

  editSupplier() {
    if (this.supplier) {
      this.router.navigate(['/suppliers', this.supplier.id, 'edit']);
    }
  }
}
