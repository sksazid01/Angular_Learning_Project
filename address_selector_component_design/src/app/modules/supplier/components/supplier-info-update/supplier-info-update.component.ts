import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmationPopupService } from '../../../../shared/components/confirmation-popup/confirmation-popup.service';
import { AddressFormComponent } from '../../../address/components/address-form/address-form.component';
import { Address } from '../../../address/domain/address.domain';
import { Supplier } from '../../domain/supplier.domain';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-supplier-info-update',
  templateUrl: './supplier-info-update.component.html',
  styleUrls: ['./supplier-info-update.component.css']
})
export class SupplierInfoUpdateComponent implements OnInit {
  isNewSupplier = false;
  supplier: Supplier = { id: 0, name: '', address: null };

  @ViewChild(AddressFormComponent) addressForm!: AddressFormComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private confirmationPopupService: ConfirmationPopupService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.supplierService.getSupplier(Number(id)).subscribe(s => this.supplier = s);
    } else {
      this.isNewSupplier = true;
    }
  }

  onSupplierSave(): void {
    if (!this.isSupplierNameValid()) return;
    const currentAddress = this.buildAddressFromForm();
    if (this.isNewSupplier) {
      this.addSupplier(currentAddress);
    } else {
      this.updateExistingSupplier(currentAddress);
    }
  }

  private isSupplierNameValid(): boolean {
    if (!this.supplier || !this.supplier.name || this.supplier.name.trim() === '') {
      this.notificationService.showNotification('Supplier name is required', true);
      return false;
    }
    return true;
  }

  private buildAddressFromForm(): Address | null {
    if (this.addressForm && this.addressForm.addressForm && this.addressForm.addressForm.valid) {
      return this.addressForm.getAddressFromAddressForm();
    }
    return null;
  }

  private addSupplier(address: Address | null): void {
    this.confirmationPopupService.confirm(() => {
      this.supplier.address = address;
      this.supplierService.addSupplier(this.supplier).subscribe(newSupplier => {
        this.router.navigate(['/suppliers', newSupplier.id]);
      });
    }, undefined, 'Are you sure to add this supplier?', 'Add Confirmation');
  }

  private updateExistingSupplier(address: Address | null): void {
    this.confirmationPopupService.confirm(() => {
      this.supplier.address = address;
      this.supplierService.updateSupplier(this.supplier.id, this.supplier).subscribe(() => {
        this.router.navigate(['/suppliers', this.supplier.id]);
      });
    }, undefined, 'Are you sure to update this supplier?', 'Update Confirmation');
  }

  goBack(): void {
    if (this.isNewSupplier) {
      this.router.navigate(['/suppliers']);
    } else {
      this.router.navigate(['/suppliers', this.supplier.id]);
    }
  }
}
