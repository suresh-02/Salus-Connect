import { Address } from ".";

export interface Facility {
  facilityId?: number;
  facilityName: string;
  facilityType: string;
  address: Address;
  doctors: [
    {
      biography: string;
      specialty: {
        specialtyId: number;
        specialtyName: string;
        categoryId: number;
      };
      tags: string[];
      userId?: number;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      emailAddress: string;
    }
  ];
}
