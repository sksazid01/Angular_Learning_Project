import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
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

  ngOnInit(): void {
    this.buildForm();
    this.loadCountries();
    this.loadDivisions();
    this.onCountryChange();
    this.onDivisionChange();
    this.onDistrictChange();
    this.onUpazilaChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address']) {
      const address = changes['address'].currentValue;
      if (address && this.addressForm) {
        this.loadRelatedAddresssForOptionsPreview(address);
        this.patchAddressValues(address);
      } else if (!address && this.addressForm) {
        this.addressForm.reset();
      }
    }
  }

  private buildForm(formData?: Address | null): void {
    const data = formData || new Address();
    this.addressForm = this.formBuilder.group({
      countryId: [1, Validators.required],
      divisionId: [data.division ? data.division.id : null, Validators.required],
      districtId: [data.district ? data.district.id : null, Validators.required],
      upazilaId: [data.upazila ? data.upazila.id : null, Validators.required],
      postCode: [data.postOffice ? data.postOffice.postCode : null, Validators.required]
    });
  }

  private loadRelatedAddresssForOptionsPreview(address: Address): void {
    this.addressFormService.getCountries().subscribe((countries: Country[]) => {
      this.countries = countries;
    });

    this.addressFormService.getDivisions().subscribe((divisions: Division[]) => {
      this.divisions = divisions;
    });

    if (address.division && address.division.id) {
      this.addressFormService.getDistrictsByDivision(address.division.id).subscribe((districts: District[]) => {
        this.districts = districts;
      });
    }

    if (address.district && address.district.id) {
      this.addressFormService.getUpazilasByDistrict(address.district.id).subscribe((upazilas: Upazila[]) => {
        this.upazilas = upazilas;
      });
    }

    if (address.upazila && address.upazila.id) {
      this.addressFormService.getPostCodesByUpazila(address.upazila.id).subscribe((postOffice: PostOffice[]) => {
        this.postOffice = postOffice;
      });
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
      control.valueChanges.subscribe(countryId => {
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
      error: error => {
        this.showLoadError('Failed to load countries. Please try again.');
      }
    });
  }

  private loadDivisions(): void {
    this.addressFormService.getDivisions().subscribe({
      next: divisions => {
        this.divisions = divisions;
      },
      error: error => {
        this.showLoadError('Failed to load divisions. Please try again.');
      }
    });
  }

  private loadDistricts(divisionId: number): void {
    this.addressFormService.getDistrictsByDivision(divisionId).subscribe({
      next: districts => {
        this.districts = districts;
      },
      error: error => {
        this.showLoadError('Failed to load districts. Please try again.');
      }
    });
  }

  private loadUpazilas(districtId: number): void {
    this.addressFormService.getUpazilasByDistrict(districtId).subscribe({
      next: upazilas => {
        this.upazilas = upazilas;
      },
      error: error => {
        this.showLoadError('Failed to load upazilas. Please try again.');
      }
    });
  }

  private loadPostCodes(upazilaId: number): void {
    this.addressFormService.getPostCodesByUpazila(upazilaId).subscribe({
      next: postOffice => {
        this.postOffice = postOffice;
      },
      error: error => {
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
      country: country ? country : null,
      division: division ? division : null,
      district: district ? district : null,
      upazila: upazila ? upazila : null,
      postOffice: postCode ? postCode : null,
    };
  }


  // Error Handling
  private showLoadError(message: string, isError: boolean = true): void {
    this.notificationService.showNotification(message, isError);
  }
}