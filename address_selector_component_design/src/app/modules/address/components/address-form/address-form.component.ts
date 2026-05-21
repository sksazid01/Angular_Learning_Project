import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Country, Division, District, Upazila, PostOffice, Address } from '../../domain/address.domain';
import { AddressFormService } from '../../services/address-form.service';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit, OnChanges {
  public countries: Country[] = [];
  public divisions: Division[] = [];
  public districts: District[] = [];
  public upazilas: Upazila[] = [];
  public postOffice: PostOffice[] = [];
  public addressForm!: FormGroup;
  @Input() address?: Address;

  constructor(
    private formBuilder: FormBuilder,
    private addressFormService: AddressFormService
  ) { }

  ngOnInit(): void {
    this.prepareForm(null);
    this.fetchCountries();
    this.fetchDivisions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address'] && changes['address'].currentValue) {
      this.prepareForm(this.address);
    }
  }

  private prepareForm(address: Address): void {
    address = address || new Address();

    this.addressForm = this.formBuilder.group({
      countryId: [address.country ? address.country.id : null, Validators.required],
      divisionId: [address.division ? address.division.id : null, Validators.required],
      districtId: [address.district ? address.district.id : null, Validators.required],
      upazilaId: [address.upazila ? address.upazila.id : null],
      postCode: [address.postOffice ? address.postOffice.postCode : null]
    });

    this.addressForm.get('countryId').valueChanges.subscribe(() => {
      this.clearCountryDependentFields();
      this.fetchDivisions();
    });

    this.addressForm.get('divisionId').valueChanges.subscribe(divisionId => {
      this.clearDivisionDependentFields();
      this.fetchDistricts(divisionId);
    });

    if (address.division && address.division.id) {
      this.fetchDistricts(address.division.id);
    }

    this.addressForm.get('districtId').valueChanges.subscribe(districtId => {
      this.clearDistrictDependentFields();
      this.fetchUpazilas(districtId);
    });

    if (address.district && address.district.id) {
      this.fetchUpazilas(address.district.id);
    }

    this.addressForm.get('upazilaId').valueChanges.subscribe(upazilaId => {
      this.clearUpazilaDependentFields();
      this.fetchPostCodes(upazilaId);
    });

    if (address.upazila && address.upazila.id) {
      this.fetchPostCodes(address.upazila.id);
    }
  }

  // Data Loaders
  private fetchCountries(): void {
    this.addressFormService.fetchCountries()
      .subscribe(countries => {
        this.countries = countries;
      });
  }

  private fetchDivisions(): void {
    this.addressFormService.fetchDivisions()
      .subscribe(divisions => {
        this.divisions = divisions;
      });
  }

  private fetchDistricts(divisionId: number): void {
    if (!divisionId) { return }

    this.addressFormService.fetchDistrictsByDivision(divisionId)
      .subscribe(districts => {
        this.districts = districts;
      });
  }

  private fetchUpazilas(districtId: number): void {
    if (!districtId) return;

    this.addressFormService.fetchUpazilasByDistrict(districtId)
      .subscribe(upazilas => {
        this.upazilas = upazilas;
      });
  }

  private fetchPostCodes(upazilaId: number): void {
    if (!upazilaId) return;

    this.addressFormService.fetchPostCodesByUpazila(upazilaId)
      .subscribe(postOffice => {
        this.postOffice = postOffice;
      }
      );
  }

  private clearCountryDependentFields(): void {
    this.clearDivisionDependentFields();
    this.resetControl(['divisionId']);
    this.divisions = [];
  }

  private clearDivisionDependentFields(): void {
    this.clearDistrictDependentFields();
    this.resetControl(['districtId']);
    this.districts = [];
  }

  private clearDistrictDependentFields(): void {
    this.clearUpazilaDependentFields();
    this.resetControl(['upazilaId']);
    this.upazilas = [];
  }

  private clearUpazilaDependentFields(): void {
    this.resetControl(['postCode']);
    this.postOffice = [];
  }

  resetControl(controls: string[]) {
    if (!controls || !controls.length) { return; };

    controls.forEach(control => {
      this.addressForm.get(control).reset();
    });
  }

  // To access data using ViewChild from Parent component
  public getAddressValues(): Address {
    const { countryId, divisionId, districtId, upazilaId, postCode } = this.addressForm.getRawValue();

    return {
      country: this.countries.find(c => c.id === countryId) ?? null,
      division: this.divisions.find(d => d.id === divisionId) ?? null,
      district: this.districts.find(d => d.id === districtId) ?? null,
      upazila: this.upazilas.find(u => u.id === upazilaId) ?? null,
      postOffice: this.postOffice.find(p => p.postCode === postCode) ?? null,
    };
  }

  // maybe required some update
  public isFormValid(): boolean {
    this.addressForm.markAsTouched();
    return this.addressForm.valid;
  }

}