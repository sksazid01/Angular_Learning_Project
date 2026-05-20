import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationPopupService } from '../../../../shared/components/confirmation-popup/confirmation-popup.service';
import { Supplier } from '../../domain/supplier.domain';
import { SupplierService } from '../../services/supplier.service';

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
    private supplierService: SupplierService,
    private confirmationPopupService: ConfirmationPopupService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.fetchSupplierDetails(id);
  }

  fetchSupplierDetails(id: string): void {
    if (id) {
      this.supplierService.fetchSupplierById(Number(id))
        .subscribe(supplier =>
          this.supplier = supplier
        );
    }
  }

  deleteSupplier(): void {
    if (this.supplier && this.supplier.id !== undefined) {
      this.confirmationPopupService.confirm(() => {
        this.supplierService.deleteSupplier(this.supplier!.id)
          .subscribe(() => {
            this.router.navigate(['/', 'supplier', 'list']);
          });
      });
    }
  }

  editSupplier(): void {
    if (this.supplier) {
      this.router.navigate(['/', 'supplier', 'edit', this.supplier.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/', 'supplier', 'list']);
  }
}
