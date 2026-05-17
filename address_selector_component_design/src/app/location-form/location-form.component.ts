import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { LocationFormService } from './location-form.service';
import { Country, Division, District, Upazila, PostOffice, Address } from './location-form.model';
import { ConfirmationPopupService } from '../confirmation-popup/confirmation-popup.service';
import { LocationListService } from '../location-lists/location-lists.service';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.css']
})
export class LocationFormComponent implements OnInit, OnChanges {
  // =========================
  // Properties
  // =========================
  public countries: Country[] = [];
  public divisions: Division[] = [];
  public districts: District[] = [];
  public upazilas: Upazila[] = [];
  public postOffice: PostOffice[] = [];

  public isEditMode = false;
  public locationForm!: FormGroup;
  private currentAddressIdForEditing: number | null = null; // remove
  private pendingAddress: Address | null = null; // remove

  // =========================
  // Inputs / Outputs
  // =========================
  @Input() address: Address | null = null;
  @Output() addressSubmit = new EventEmitter<Address>(); // remove, use ViewChild

  // =========================
  // Constructor
  // =========================
  constructor(
    private formBuilder: FormBuilder,
    private locationFormService: LocationFormService,
    private confirmationPopupService: ConfirmationPopupService,
    private locationListService: LocationListService,
    private notificationService: NotificationService
  ) { }

  // =========================
  // Lifecycle Hooks
  // =========================
  ngOnInit(): void {
    this.buildForm();
    this.loadCountries();
    this.onCountryChange();
    this.onDivisionChange();
    this.onDistrictChange();
    this.onUpazilaChange();

    if (this.pendingAddress) {
      this.startEdit(this.pendingAddress);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address']) {
      const address = changes['address'].currentValue;
      this.pendingAddress = address;
      if (address && this.locationForm) {
        this.startEdit(address);
      }
    }
  }

  // =========================
  // Form Initialization
  // =========================
  private buildForm(formData?: Address | null): void {
    const data = formData || new Address();
    this.locationForm = this.formBuilder.group({
      countryId: [data.country ? data.country.id : null, Validators.required],
      divisionId: [data.division ? data.division.id : null, Validators.required],
      districtId: [data.district ? data.district.id : null, Validators.required],
      upazilaId: [data.upazila ? data.upazila.id : null, Validators.required],
      postCode: [data.postOffice ? data.postOffice.postCode : null, Validators.required]
    });
  }

  // =========================
  // Public UI Methods
  // =========================
  public onSubmitRequest(): void {
    if (this.locationForm.invalid) {
      this.showLoadError('Please fill all required fields correctly before submitting.');
      Object.values(this.locationForm.controls).forEach(control => control.markAsTouched());
      return;
    }
    this.confirmationPopupService.confirm(() => this.submit());
  }

  public startEdit(address: Address): void {
    if (address && address.id) {
      this.enableEditMode(address.id);
      this.loadAddressForEdit(address);
    }
  }

  // =========================
  // Edit Mode Helpers
  // =========================
  private enableEditMode(addressId: number): void {
    this.isEditMode = true;
    this.currentAddressIdForEditing = addressId;
  }

  private disableEditMode(): void {
    this.isEditMode = false;
    this.currentAddressIdForEditing = null;
  }

  // =========================
  // Form Population
  // =========================
  private loadAddressForEdit(address: Address): void {
    try {
      this.loadRelatedLocationsForOptionsPreview(address);
      this.patchAddressValues(address);
    } catch (error) {
      this.showLoadError('Failed to load address data for editing. Please try again.');
    }
  }

  private loadRelatedLocationsForOptionsPreview(address: Address): void {

    this.locationFormService.getCountries().subscribe((countries: Country[]) => {
      this.countries = countries;
    });

    this.locationFormService.getDivisions().subscribe((divisions: Division[]) => {
      this.divisions = divisions;
    });

    if (address.division && address.division.id) {
      this.locationFormService.getDistrictsByDivision(address.division.id).subscribe((districts: District[]) => {
        this.districts = districts;
      });
    }

    if (address.district && address.district.id) {
      this.locationFormService.getUpazilasByDistrict(address.district.id).subscribe((upazilas: Upazila[]) => {
        this.upazilas = upazilas;
      });
    }

    if (address.upazila && address.upazila.id) {
      this.locationFormService.getPostCodesByUpazila(address.upazila.id).subscribe((postOffice: PostOffice[]) => {
        this.postOffice = postOffice;
      });
    }
  }

  // =========================
  // Update the form values instead of reload the whole form
  // =========================
  private patchAddressValues(address: Address): void {
    const countryId = this.findCountryIdFromCountryName(address.country ? address.country.name : null);

    this.locationForm.patchValue({
      countryId: countryId,
      divisionId: address.division ? address.division.id : null,
      districtId: address.district ? address.district.id : null,
      upazilaId: address.upazila ? address.upazila.id : null,
      postCode: address.postOffice ? address.postOffice.postCode : null
    }, { emitEvent: false });
  }

  private findCountryIdFromCountryName(countryName: string | null): number {
    if (!countryName) return 1;
    const country = this.countries.find(c => c.name === countryName);
    return country ? country.id : 1;
  }

  private resetFormForCreateMode(): void {
    this.disableEditMode();
    if (this.locationForm) {
      this.locationForm.reset();
      this.setDefaultCountryToBangladesh();
    }
  }

  private setDefaultCountryToBangladesh() {
    if (this.countries.length === 1) {
      this.locationForm.patchValue({ countryId: this.countries[0].id }, { emitEvent: false });
      this.loadDivisions();
    }
  }

  // =========================
  // Dropdown Change Handlers
  // =========================
  private onCountryChange(): void {
    this.getControl('countryId').valueChanges.subscribe(countryId => {
      this.resetFromCountry();
      if (countryId) {
        this.loadDivisions();
      }
    });
  }

  private onDivisionChange(): void {
    this.getControl('divisionId').valueChanges.subscribe(divisionId => {
      this.resetFromDivision();
      if (divisionId) {
        this.loadDistricts(divisionId);
      }
    });
  }

  private onDistrictChange(): void {
    this.getControl('districtId').valueChanges.subscribe(districtId => {
      this.resetFromDistrict();
      if (districtId) {
        this.loadUpazilas(districtId);
      }
    });
  }

  private onUpazilaChange(): void {
    this.getControl('upazilaId').valueChanges.subscribe(upazilaId => {
      this.resetFromUpazila();
      if (upazilaId) {
        this.loadPostCodes(upazilaId);
      }
    });
  }

  // =========================
  // Data Loaders
  // =========================
  private loadCountries(): void {
    this.locationFormService.getCountries().subscribe({
      next: countries => {
        this.countries = countries;
        if (countries.length === 1 && !this.isEditMode) {
          this.locationForm.patchValue({ countryId: countries[0].id });
        }
      },
      error: error => {
        this.showLoadError('Failed to load countries. Please try again.');
      }
    });
  }

  private loadDivisions(): void {
    this.locationFormService.getDivisions().subscribe({
      next: divisions => {
        this.divisions = divisions;
      },
      error: error => {
        this.showLoadError('Failed to load divisions. Please try again.');
      }
    });
  }

  private loadDistricts(divisionId: number): void {
    this.locationFormService.getDistrictsByDivision(divisionId).subscribe({
      next: districts => {
        this.districts = districts;
      },
      error: error => {
        this.showLoadError('Failed to load districts. Please try again.');
      }
    });
  }

  private loadUpazilas(districtId: number): void {
    this.locationFormService.getUpazilasByDistrict(districtId).subscribe({
      next: upazilas => {
        this.upazilas = upazilas;
      },
      error: error => {
        this.showLoadError('Failed to load upazilas. Please try again.');
      }
    });
  }

  private loadPostCodes(upazilaId: number): void {
    this.locationFormService.getPostCodesByUpazila(upazilaId).subscribe({
      next: postOffice => {
        this.postOffice = postOffice;
      },
      error: error => {
        this.showLoadError('Failed to load post codes. Please try again.');
      }
    });
  }

  // =========================
  // Reset Helpers
  // =========================
  private clearDependencies(
    fieldsToReset: { [key: string]: any },
    arraysToClear: string[]
  ): void {
    this.locationForm.patchValue(fieldsToReset, { emitEvent: false });

    // Using simple approach to clear arrays
    if (arraysToClear.includes('divisions')) this.divisions = [];
    if (arraysToClear.includes('districts')) this.districts = [];
    if (arraysToClear.includes('upazilas')) this.upazilas = [];
    if (arraysToClear.includes('postOffice')) this.postOffice = [];
  }

  private resetFromCountry(): void {
    this.clearDependencies(
      { divisionId: null, districtId: null, upazilaId: null, postCode: '' },
      ['divisions', 'districts', 'upazilas', 'postOffice']
    );
  }

  private resetFromDivision(): void {
    this.clearDependencies(
      { districtId: null, upazilaId: null, postCode: '' },
      ['districts', 'upazilas', 'postOffice']
    );
  }

  private resetFromDistrict(): void {
    this.clearDependencies(
      { upazilaId: null, postCode: '' },
      ['upazilas', 'postOffice']
    );
  }

  private resetFromUpazila(): void {
    this.clearDependencies(
      { postCode: '' },
      ['postOffice']
    );
  }

  // =========================
  // Submit Workflow
  // =========================
  public submit(): void {
    const address = this.buildAddressForSubmit();

    if (this.isEditMode && this.currentAddressIdForEditing) {
      address.id = this.currentAddressIdForEditing;
      this.updateAddress(address);
    } else {
      this.createAddress(address);
    }
  }

  private buildAddressForSubmit(): Address {
    const formValue = this.locationForm.getRawValue();

    const selectedCountry = this.countries.find(item => item.id === formValue.countryId);
    const selectedDivision = this.divisions.find(item => item.id === formValue.divisionId);
    const selectedDistrict = this.districts.find(item => item.id === formValue.districtId);
    const selectedUpazila = this.upazilas.find(item => item.id === formValue.upazilaId);
    const selectedPostCode = this.postOffice.find(item => item.postCode === formValue.postCode);

    return {
      country: selectedCountry ? selectedCountry : null,
      division: selectedDivision ? selectedDivision : null,
      district: selectedDistrict ? selectedDistrict : null,
      upazila: selectedUpazila ? selectedUpazila : null,
      postOffice: selectedPostCode ? selectedPostCode : null,
    };
  }

  private createAddress(address: Address): void {
    this.locationListService.addAddress(address).subscribe({
      next: () => {
        this.showLoadError('Address added successfully!', false);
        this.resetFormForCreateMode();
        this.addressSubmit.emit(address);
      },
      error: error => {
        this.showLoadError('Failed to add address. Please try again.');
      }
    });
  }

  private updateAddress(address: Address): void {
    if (!this.currentAddressIdForEditing) return;

    this.locationListService.updateAddress(this.currentAddressIdForEditing, address).subscribe({
      next: () => {
        this.showLoadError('Address updated successfully!', false);
        this.resetFormForCreateMode();
        this.addressSubmit.emit(address);
      },
      error: error => {
        this.showLoadError('Failed to update address. Please try again.');
      }
    });
  }

  // =========================
  // Returns the form control object through the control name
  // =========================
  private getControl(controlName: string): AbstractControl {
    const control = this.locationForm.get(controlName);
    if (!control) {
      this.showLoadError(`Control ${controlName} not found in form`);
      throw new Error(`Control ${controlName} not found in form`);
    }
    return control;
  }

  // =========================
  // Error Handling
  // =========================
  private showLoadError(message: string, isError: boolean = true): void {
    this.notificationService.showNotification(message, isError);
  }
}
