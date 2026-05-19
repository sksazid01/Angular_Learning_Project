// core/constants/endpoints.ts

export const ENDPOINTS = {
  address: {
    countries: '/countries',
    divisions: '/divisions',
    districts: '/districts',
    upazilas: '/upazilas',
    postOffice: '/postoffice',
    addressListById: (id: number) => `/address_list/${id}`
  },
  suppliers: {
    list: '/suppliers',
    byId: (id: number) => `/suppliers/${id}`
  }
};