export interface Country {
  id: number;
  name: string;
  code: string;
}

export interface Division {
  id: number;
  country_id: number;
  name: string;
  bn_name: string;
  lat?: string;
  lng?: string;
}

export interface District {
  id: number;
  division_id: number;
  name: string;
  bn_name: string;
  lat?: string;
  lng?: string;
}

export interface Upazila {
  id: number;
  district_id: number;
  name: string;
  bn_name: string;
}

export interface PostCode {
  id?: number;
  upazila_id: number;
  postOffice: string;
  postCode: string;
}