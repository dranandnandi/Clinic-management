export type Role = 'admin' | 'receptionist';

export interface User {
  id: string;
  name: string;
  role: Role;
  clinicId: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  clinicId: string;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  gmbLink: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

// Rest of the types remain the same...