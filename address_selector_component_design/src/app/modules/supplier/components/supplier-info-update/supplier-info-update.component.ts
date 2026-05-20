import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  supplierForm!: FormGroup;
  supplier: Supplier = { id: 0, name: '', address: null };
  @ViewChild(AddressFormComponent) addressForm!: AddressFormComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private confirmationPopupService: ConfirmationPopupService
  ) { }

  ngOnInit(): void {
    this.prepareForm();
    this.getSupplierList();
  }

  prepareForm(supplier?: Supplier): void {
    this.supplierForm = this.formBuilder.group({
      name: [supplier ? supplier.name : '', Validators.required]
    });
  }

  getSupplierList(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.supplierService
        .getSupplierById(Number(id))
        .subscribe(
          supplier => {
            this.supplier = supplier;
            this.prepareForm(supplier);
          }
        );
    } else {
      this.isNewSupplier = true;
    }
  }

  onSupplierSave(): void {
    if (!this.isSupplierNameValid()) return;
    this.supplier.name = this.supplierForm.get('name') ? this.supplierForm.get('name')!.value : '';
    this.supplier.address = this.buildAddressFromForm();

    this.confirmationPopupService.confirm(() => {
      this.isNewSupplier ? this.addSupplier(this.supplier) : this.updateExistingSupplier(this.supplier);
    });
  }

  private isSupplierNameValid(): boolean {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAsTouched();
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

  private addSupplier(supplier: Supplier): void {
    this.supplierService.addSupplier(supplier).subscribe(newSupplier => {
      this.router.navigate(['/', 'supplier', 'details', newSupplier.id]);
    });
  }

  private updateExistingSupplier(supplier: Supplier): void {
    this.supplierService.updateSupplier(supplier.id, supplier).subscribe(() => {
      this.router.navigate(['/', 'supplier', 'details', supplier.id]);
    });
  }

  goBack(): void {
    if (this.isNewSupplier) {
      this.router.navigate(['/', 'supplier', 'list']);
    } else {
      this.router.navigate(['/', 'supplier', 'details', this.supplier.id]);
    }
  }
}
