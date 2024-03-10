export interface Patient {
  userId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  password: string;
  address?: Address;
  dateCreated: string;
  status: string;
}

export interface Address {
  addressId?: number;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
  city: string;
  stateAbbr: string;
}
