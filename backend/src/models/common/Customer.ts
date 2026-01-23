export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  dateOfBirth: string;
  status: 'ACTIVE' | 'SUSPENDED';  
  createdAt: string;
  updatedAt: string;
}

export interface CustomerData {
  customers: Customer[];
}