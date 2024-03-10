export interface Provider {
  providerId: number;
  providerName: string;
  postalCode: string;
  city: string;
  stateAbbr: string;
  providerType: string;
  doctors?: number;
  status: string;
  specialtyName: string;
  activeDoctors?: number;
  dateCreated: string;
  paymentType: string;
}
