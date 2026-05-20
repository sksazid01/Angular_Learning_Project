import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NotificationService } from '../../../../core/services/notification.service';
import { Country, Division, District, Upazila, PostOffice, Address } from '../../domain/address.domain';
import { AddressFormService } from '../../services/address-form.service';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit, OnChanges {
  @Input() address?: Address;

  public countries: Country[] = [];
  public divisions: Division[] = [];
  public districts: District[] = [];
  public upazilas: Upazila[] = [];
  public postOffice: PostOffice[] = [];
  public addressForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private addressFormService: AddressFormService,
    private notificationService: NotificationService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address']) {
      const address = changes['address'].currentValue;
      if (address && this.addressForm) {
        this.loadCascadingOptionsForAddress(address);
        this.patchAddressValues(address);
      } else if (!address && this.addressForm) {
        this.addressForm.reset();
      }
    }
  }

  ngOnInit(): void {
    this.buildForm();
    this.loadCountries();
    this.loadDivisions();
    this.onCountryChange();
    this.onDivisionChange();
    this.onDistrictChange();
    this.onUpazilaChange();
  }

  private buildForm(): void {
    this.addressForm = this.formBuilder.group({
      countryId: [1, Validators.required],
      divisionId: [null, Validators.required],
      districtId: [null, Validators.required],
      upazilaId: [null, Validators.required],
      postCode: [null, Validators.required]
    });
  }

  private loadCascadingOptionsForAddress(address: Address): void {
    this.loadCountries();
    this.loadDivisions();

    if (address.division && address.division.id) {
      this.loadDistricts(address.division.id);
    }

    if (address.district && address.district.id) {
      this.loadUpazilas(address.district.id);
    }

    if (address.upazila && address.upazila.id) {
      this.loadPostCodes(address.upazila.id);
    }
  }

  // Update the form values instead of reload the whole form
  private patchAddressValues(address: Address): void {
    this.addressForm.patchValue({
      countryId: 1,
      divisionId: address.division ? address.division.id : null,
      districtId: address.district ? address.district.id : null,
      upazilaId: address.upazila ? address.upazila.id : null,
      postCode: address.postOffice ? address.postOffice.postCode : null
    }, { emitEvent: false });
  }

  // Dropdown Change Handlers
  private onCountryChange(): void {
    const control = this.addressForm.get('countryId');
    if(control) {
      control.valueChanges.subscribe(() => {
        this.resetFromCountry();
        this.loadDivisions();
      });
    }
  }

  private onDivisionChange(): void {
    const control = this.addressForm.get('divisionId');
    if(control) {
      control.valueChanges.subscribe(divisionId => {
        this.resetFromDivision();
        if (divisionId) {
          this.loadDistricts(divisionId);
        }
      });
    }
  }

  private onDistrictChange(): void {
    const control = this.addressForm.get('districtId');
    if(control) {
      control.valueChanges.subscribe(districtId => {
        this.resetFromDistrict();
        if (districtId) {
          this.loadUpazilas(districtId);
        }
      });
    }
  }

  private onUpazilaChange(): void {
    const control = this.addressForm.get('upazilaId');
    if(control) {
      control.valueChanges.subscribe(upazilaId => {
        this.resetFromUpazila();
        if (upazilaId) {
          this.loadPostCodes(upazilaId);
        }
      });
    }
  }

  // Data Loaders
  private loadCountries(): void {
    this.addressFormService.getCountries().subscribe({
      next: countries => {
        this.countries = countries;
      },
      error: () => {
        this.showLoadError('Failed to load countries. Please try again.');
      }
    });
  }

  private loadDivisions(): void {
    this.addressFormService.getDivisions().subscribe({
      next: divisions => {
        this.divisions = divisions;
      },
      error: () => {
        this.showLoadError('Failed to load divisions. Please try again.');
      }
    });
  }

  private loadDistricts(divisionId: number): void {
    this.addressFormService.getDistrictsByDivision(divisionId).subscribe({
      next: districts => {
        this.districts = districts;
      },
      error: () => {
        this.showLoadError('Failed to load districts. Please try again.');
      }
    });
  }

  private loadUpazilas(districtId: number): void {
    this.addressFormService.getUpazilasByDistrict(districtId).subscribe({
      next: upazilas => {
        this.upazilas = upazilas;
      },
      error: () => {
        this.showLoadError('Failed to load upazilas. Please try again.');
      }
    });
  }

  private loadPostCodes(upazilaId: number): void {
    this.addressFormService.getPostCodesByUpazila(upazilaId).subscribe({
      next: postOffice => {
        this.postOffice = postOffice;
      },
      error: () => {
        this.showLoadError('Failed to load post codes. Please try again.');
      }
    });
  }

  private resetFromCountry(): void {
    this.clearFieldData(
      { divisionId: null, districtId: null, upazilaId: null, postCode: null },
      ['divisions', 'districts', 'upazilas', 'postOffice']
    );
  }

  private resetFromDivision(): void {
    this.clearFieldData(
      { districtId: null, upazilaId: null, postCode: null },
      ['districts', 'upazilas', 'postOffice']
    );
  }

  private resetFromDistrict(): void {
    this.clearFieldData(
      { upazilaId: null, postCode: null },
      ['upazilas', 'postOffice']
    );
  }

  private resetFromUpazila(): void {
    this.clearFieldData(
      { postCode: null },
      ['postOffice']
    );
  }

  private clearFieldData(
    fieldsToReset: { [key: string]: any },
    arraysToClear: string[]
  ): void {
    this.addressForm.patchValue(fieldsToReset, { emitEvent: false });

    if (arraysToClear.includes('divisions')) this.divisions = [];
    if (arraysToClear.includes('districts')) this.districts = [];
    if (arraysToClear.includes('upazilas')) this.upazilas = [];
    if (arraysToClear.includes('postOffice')) this.postOffice = [];
  }

  // To access data using ViewChild from Parent component
  public getAddressFromAddressForm(): Address {
    const formValue = this.addressForm.getRawValue();

    const country = this.countries.find(item => item.id === formValue.countryId);
    const division = this.divisions.find(item => item.id === formValue.divisionId);
    const district = this.districts.find(item => item.id === formValue.districtId);
    const upazila = this.upazilas.find(item => item.id === formValue.upazilaId);
    const postCode = this.postOffice.find(item => item.postCode === formValue.postCode);

    return {
      country: country || null,
      division: division || null,
      district: district || null,
      upazila: upazila || null,
      postOffice: postCode || null,
    };
  }

  private showLoadError(message: string): void {
    this.notificationService.showNotification(message, true);
  }
}