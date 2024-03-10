export interface AppointmentDashboard {
  appointment: {
    acceptedCount: number;
    completedCount: number;
    followupCount: number;
    noShowCount: number;
    rescheduledCount: number;
  };
  bookings: {
    doctorId: number;
    efficiencySeconds: number;
  }[];
  cancel: {
    cancelledByDoctorCount: number;
    cancelledByPatientCount: number;
  };
  patient: {
    newPatients: number;
    returningPatients: number;
  };
}

export interface RevenueDashboard {
  patient: {
    newPatients: number;
    returningPatients: number;
  };
  fee: {
    statedFee: number;
    actualBilled: number;
  };
  cancel: {
    cancelledByDoctorAmount: number;
    cancelledByPatientAmount: number;
  };
}

export interface PlanDashboard {
  authDoctors: string[];
  authStaff: string[];
  billingStartDate: string;
  billingFrequency: string;
  designatedEmail: string;
  designatedPhone: string;
  endDate: string;
  facilityId: number;
  freeTrialDays: number;
  invoiceFooter: string;
  isActive: boolean;
  memo: string;
  paymentMethod: string;
  plans: Plan[];
  startDate: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  subscriptionId: number;
  discounts: any[];
  facilityMembers: FacilityMenbers;
}

interface FacilityMenbers {
  staff: number;
  doctors: number;
}

interface Plan {
  baseFee: number;
  cost: number;
  id: number;
  planCategory: string;
  planIdnumber: string;
  planName: string;
  planNickname: string;
  qty: number;
}

export interface UpcomingInvoice {
  hostedInvoiceUrl: string;
  receiptPdf: string;
  invoicePdf: string;
  amountDue: number;
  amountPaid: number;
  amountRemaining: number;
  dueDate: string;
  paymentStatus: string;
}

export interface InvoicesAndReceipts {
  invoices: InvoiceOrReceiptItem[];
  receipts: InvoiceOrReceiptItem[];
}

export interface InvoiceOrReceiptItem {
  label: string;
  value: string;
  fileName: string;
}
