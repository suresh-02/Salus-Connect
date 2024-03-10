import { Address } from '.';
import { Treatment } from 'src/app/_models';
export interface Doctor {
  userId: number;
  facilityId?: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  biography: string;
  specialty: {
    specialtyId: number;
    specialtyName: string;
    categoryId: number;
  };
  tags: string[];
  // addressId?: 0;
  address: Address;
  facilityName?: string;
  other?: string;
  isBackgroundCheck?: boolean;
  notificationCount?: number;
  richBio?: string;
  status?: string;
  imageUrl?: string;
  role?: any;
  sequence?: number;
}
export interface SearchDoctor {
  id: number;
  addressId: number;
  firstName: string;
  lastName: string;
  facilityId?: number;
  facilityName?: string;
  biography: string;
  stateAbbr: string;
  city: string;
  specialtyName: string;
  tags: string[];
  slots: Slot[];
  treatments: Treatment[];
  isAvailable: Slot;
  isAutoApprove: boolean;
  isAcceptNew: boolean;
  cancellationPolicyDays: number;
  imageUrl?: string;
}

export interface Slot {
  date: string;
  times: string[];
  durationMinutes?: number;
}
