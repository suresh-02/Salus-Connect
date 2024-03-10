export interface Appointment {
  // slotOption: string;
  doctorId: number;
  cancellationPolicyDays: number;
  // timeRange?: string[];
  dateRange: string[];
  // dateSlots?: AppointmentDate[];
  slotExceptions: SlotException[];
  // durationMinutes?: number;
  treatments: Treatment[];
}

export interface Treatment {
  treatmentId?: number;
  nickname: string;
  treatmentType: string;
  description: string;
  durationMinutes: number;
  timeRange: string[];
  breakMinutes: number;
  treatmentDays: number[];
  excludeHolidays: boolean;
  insuranceCoverage: string;
  feePerVisit: number | null;
  isDefault: boolean;
  isBreak?: boolean;
  feeAmount?: number;
}

export interface SlotException {
  // slotDate: string;
  // slotTimes: string[]; //TimeSlot[];
  exceptionId?: number;
  exceptionDate: string;
  exceptionTimeRange?: string[];
  notAvailable: boolean | null;
}

export interface TimeSlot {
  time: string;
  booking: Booking;
}

export interface Booking {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  appointmentCode: string;
  status: string;
}

export interface RequestAppointment {
  id?: number;
  appointmentCode?: string;
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  treatmentId: number;
  symptoms: string;
}

export interface AppointmentByPhone {
  id?: number;
  appointmentDate: string;
  appointmentTime: string;
  treatmentId: number;
  name: string;
  email: string;
  phoneNumber: string;
  symptoms: string;
  emailConsent: boolean;
}

export interface AppointmentList {
  appointmentCode: string;
  appointmentDate: string;
  appointmentId: number;
  parentId?: number;
  appointmentTime: string;
  status: string;
  address?: string;
  doctorName?: string;
  location?: string;
  facilityName?: string;
  emailAddress?: string;
  patientName: string;
  phoneNumber?: string;
  durationMin?: string;
  isRead?: boolean;
  newAppointmentTime?: string;
  completeStatus?: string;
  treatmentDescription: string;
  treatmentFees: number | null;
  treatmentInsuranceCoverage: string;
  treatmentNickname: string;
  symptoms: string;
  cancellationPolicyDays: number;
  treatmentType: string;
  treatmentId: number;
  doctorNotes?: string;
  billedAmount?: number;
}
