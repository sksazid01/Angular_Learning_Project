export class Country {
  id: number;
  name: string;
  code: string;
}

export class Division {
  id: number;
  country_id: number;
  name: string;
  bn_name: string;
  lat?: string;
  lng?: string;
}

export class District {
  id: number;
  division_id: number;
  name: string;
  bn_name: string;
  lat?: string;
  lng?: string;
}

export class Upazila {
  id: number;
  district_id: number;
  name: string;
  bn_name: string;
}

export class PostOffice {
  id;
  upazila_id: number;
  postOffice: string;
  postCode: number;
}

export class Address {
  id?: number;
  country: Country;
  division: Division;
  district: District;
  upazila: Upazila;
  postOffice: PostOffice
}

