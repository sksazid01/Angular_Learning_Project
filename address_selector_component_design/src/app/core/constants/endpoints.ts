// core/constants/endpoints.ts
import { environment } from '../../../environments/environment';

const BASE = environment.apiUrl;

export const ENDPOINTS = {
  USER: {
    LOGIN: `${BASE}/user/login`,
    LOGOUT: `${BASE}/user/logout`,
    REGISTER: `${BASE}/user/register`,
  },
  ADDRESS: {
    GET_ALL: `${BASE}/address`,
    GET_BY_ID: (id: string) => `${BASE}/address/${id}`,
    CREATE: `${BASE}/address`,
    UPDATE: (id: string) => `${BASE}/address/${id}`,
    DELETE: (id: string) => `${BASE}/address/${id}`,
  },
};