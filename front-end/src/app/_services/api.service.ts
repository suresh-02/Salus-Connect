import { AppointmentByPhone } from './../_models/appointment.model';
import { map } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';

import { environment } from '../../environments/environment';
import {
  Provider,
  Doctor,
  SearchDoctor,
  Facility,
  Appointment,
  Slot,
  Patient,
  RequestAppointment,
  AppointmentList,
  Specialties,
  Treatment,
  Address,
  Holiday,
  AppointmentDashboard,
  RevenueDashboard,
  PlanDashboard,
  UpcomingInvoice,
  InvoicesAndReceipts,
} from '../_models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  notifyCount = new EventEmitter<any>();
  constructor(private client: HttpClient) {}

  //! Authentication api

  forgotPassword(emailAddress: string): Observable<any> {
    return this.client.post(`${environment.apiUrl}/users/forgot-password`, {
      emailAddress,
    });
  }
  resetPassword(data: any): Observable<any> {
    return this.client.patch(
      `${environment.apiUrl}/users/change-password`,
      data
    );
  }
  sendInvite(data: any) {
    return this.client.post(`${environment.apiUrl}/users/send-invite`, data);
  }
  sendInviteToProvider(data: any) {
    return this.client.post(
      `${environment.apiUrl}/providers/${data.id}/send-invite`,
      data
    );
  }
  verifyEmail(data: { emailAddress: string; confirmEmailCode: string }) {
    return this.client.patch(`${environment.apiUrl}/users/confirm-email`, data);
  }

  //! Provider api

  getProviders(
    pageIndex: number,
    pageSize: number,
    sortField: string,
    sortDirection: string,
    search: string
  ): Observable<{ data: Provider[]; rows: number }> {
    console.log(
      `${
        environment.apiUrl
      }/providers?pageIndex=${pageIndex}&pageSize=${pageSize}&search=${
        search ? search : ''
      }&sortField=${sortField}&sortDirection=${sortDirection}`
    );
    return this.client.get<any>(
      `${
        environment.apiUrl
      }/providers?pageIndex=${pageIndex}&pageSize=${pageSize}&search=${
        search ? search : ''
      }&sortField=${sortField}&sortDirection=${sortDirection}`
    );
  }
  deleteProviders(providerType: string, providerId: number): Observable<any> {
    return this.client.delete(
      `${environment.apiUrl}/${providerType}/${providerId}`
    );
  }

  // getProviderSpecialties(): Observable<any> {
  //   return this.client
  //     .get<{ id: number; specialtyName: string }[]>(
  //       `${environment.apiUrl}/providers/specialties`
  //     )
  //     .pipe(
  //       map((specialties) => {
  //         return specialties.map((specialty) => {
  //           return {
  //             label: specialty.specialtyName,
  //             value: specialty.specialtyName,
  //           };
  //         });
  //       })
  //     );
  // }

  getProviderCities(searchString: string): Observable<any> {
    return this.client
      .get<{ city: string; stateAbbr: string }[]>(
        `${environment.apiUrl}/providers/locations?search=${searchString}`
      )
      .pipe(
        map((cities) => {
          return cities.map((city) => {
            return {
              label: `${
                city.city[0] +
                city.city.slice(1, city.city.length).toLowerCase()
              }, ${city.stateAbbr}`,
              value: `${city.city},${city.stateAbbr}`,
            };
          });
        })
      );
  }

  getSpecialtyOrProvider(searchString: string): Observable<any> {
    return this.client.get<{ value: string; label: string }[]>(
      `${environment.apiUrl}/providers/specialties-or-providers?search=${searchString}`
    );
  }

  searchProvider(data: any): Observable<SearchDoctor[]> {
    let { specialty, city, province, date, id } = data;
    let formattedDate = date ? formatDate(date, 'yyyy-MM-dd', 'en') : null;
    let params = '';
    if (id) params = `id=${id}`;
    else
      params = `specialty=${specialty}&city=${city ? city : ''}&province=${
        province ? province : ''
      }&date=${formattedDate}`;
    return this.client.get<SearchDoctor[]>(
      `${environment.apiUrl}/providers/search?${params}`
    );
  }
  updateProviderStatus(
    providerType: string,
    providerId: number,
    status: string
  ): Observable<any> {
    return this.client.patch(
      `${environment.apiUrl}/providers/${providerId}/update-status`,
      {
        id: providerId,
        providerType,
        status,
      }
    );
  }
  searchTreatmentSlot(id: number, tId: number, date?: string) {
    let params;
    if (date) params = `treatmentId=${tId}&date=${date}`;
    else params = `treatmentId=${tId}`;
    return this.client.get<Slot[]>(
      `${environment.apiUrl}/providers/${id}/slots?${params}`
    );
  }
  getTreatments(id: number) {
    return this.client.get<Treatment[]>(
      `${environment.apiUrl}/providers/${id}/treatments`
    );
  }

  //! Doctor api

  getDoctor(id: number): Observable<Doctor> {
    return this.client.get<Doctor>(`${environment.apiUrl}/doctors/${id}`);
  }
  getStaffDoctor(
    id: number
  ): Observable<{ data: Doctor[]; facilityName: string }> {
    return this.client.get<any>(`${environment.apiUrl}/staff/${id}/doctors`);
  }
  putDoctor(id: number, data: Doctor): Observable<Doctor> {
    return this.client.put<Doctor>(`${environment.apiUrl}/doctors/${id}`, data);
  }
  postDoctor(data: Doctor): Observable<Doctor> {
    return this.client.post<Doctor>(`${environment.apiUrl}/doctors`, data);
  }

  //! Facility api

  getFacility(id: number): Observable<Facility> {
    return this.client.get<Facility>(
      `${environment.apiUrl}/facilities/${id}?includeChildren=true`
    );
  }
  putFacility(id: number, data: Facility): Observable<Facility> {
    return this.client.put<Facility>(
      `${environment.apiUrl}/facilities/${id}`,
      data
    );
  }
  postFacility(data: Facility): Observable<Facility> {
    return this.client.post<Facility>(`${environment.apiUrl}/facilities`, data);
  }

  //! Appointment api
  getAppointment(id: number): Observable<Appointment> {
    return this.client.get<Appointment>(
      `${environment.apiUrl}/doctors/${id}/slots`
    );
  }
  putAppointment(id: number, data: Appointment): Observable<Appointment> {
    return this.client.put<Appointment>(
      `${environment.apiUrl}/doctors/${id}/slots`,
      data
    );
  }
  postAppointment(id: number, data: Appointment): Observable<Appointment> {
    return this.client.post<Appointment>(
      `${environment.apiUrl}/doctors/${id}/slots`,
      data
    );
  }
  requestAppointment(id: number, data: RequestAppointment) {
    return this.client.post(
      `${environment.apiUrl}/patients/${id}/appointments`,
      data
    );
  }

  requestAppointmentByPhone(id: number, data: AppointmentByPhone) {
    return this.client.post(
      `${environment.apiUrl}/doctors/${id}/appointments`,
      data
    );
  }
  getDoctorAppointment(
    doctorId: number,
    from?: string,
    to?: string
  ): Observable<{ data: AppointmentList[]; rows: number }> {
    if (!from) from = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    let params = `from=${from}`;
    if (to) params += `&to=${to}`;

    return this.client.get<any>(
      `${environment.apiUrl}/doctors/${doctorId}/appointments?${params}`
    );
  }
  getDoctorAppointmentPagination(
    doctorId: number,
    from?: string,
    to?: string,
    data?: any
  ): Observable<{ data: AppointmentList[]; rows: number }> {
    let { pageIndex, pageSize, sortField, sortDirection, search, status } =
      data;
    if (!from) from = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    let params = `pageIndex=${pageIndex}&pageSize=${pageSize}&sortField=${sortField}&sortDirection=${sortDirection}&search=${search}&from=${from}`;
    if (to) params += `&to=${to}`;
    if (status) params += `&status=${status}`;

    return this.client.get<any>(
      `${environment.apiUrl}/doctors/${doctorId}/appointments?${params}`
    );
  }

  appointmentStatus(id: number, data: any) {
    return this.client.put(
      `${environment.apiUrl}/appointments/${id}/change-status`,
      data
    );
  }

  followup(data: any) {
    return this.client.post(
      `${environment.apiUrl}/appointments/${data.appointmentId}/follow-up`,
      data
    );
  }

  markAsComplete(id: number, status: string) {
    return this.client.patch(
      `${environment.apiUrl}/appointments/${id}/mark-as-complete`,
      { completeStatus: status }
    );
  }

  getNotes(id: number) {
    return this.client.get<{ doctorNotes: string; staffNotes: string }>(
      `${environment.apiUrl}/appointments/${id}/notes`
    );
  }
  addNotes(id: number, data: any) {
    return this.client.patch(
      `${environment.apiUrl}/appointments/${id}/notes`,
      data
    );
  }

  addBilledAmount(id: number, data: any) {
    return this.client.patch(
      `${environment.apiUrl}/appointments/${id}/billed-amount`,
      data
    );
  }

  //! Specialty api

  getSpecialties(): Observable<Specialties[]> {
    return this.client.get<Specialties[]>(`${environment.apiUrl}/specialties`);
  }
  putSpecialty(id: number, data: any): Observable<Specialties> {
    return this.client.put<Specialties>(
      `${environment.apiUrl}/specialties/${id}`,
      data
    );
  }
  postSpecialty(data: any): Observable<Specialties> {
    return this.client.post<Specialties>(
      `${environment.apiUrl}/specialties`,
      data
    );
  }
  deleteSpecialty(id: number): Observable<Specialties> {
    return this.client.delete<Specialties>(
      `${environment.apiUrl}/specialties/${id}`
    );
  }

  //! Notification api

  getNotifyCount(id: number, type: string) {
    this.client
      .get(`${environment.apiUrl}/${type}/${id}/notifications/count`)
      .subscribe((res) => {
        this.notifyCount.emit(res);
      });
  }
  // markAsRead(id: number, type: string) {
  //   return this.client
  //     .patch(
  //       `${environment.apiUrl}/${type}/${id}/notifications/mark-as-read`,
  //       {}
  //     )
  //     .subscribe();
  // }

  //! Holiday api

  getHolidays(year: number): Observable<Holiday[]> {
    return this.client.get<Holiday[]>(
      `${environment.apiUrl}/holidays?year=${year}`
    );
  }
  postHoliday(data: Holiday): Observable<Holiday> {
    return this.client.post<Holiday>(`${environment.apiUrl}/holidays`, data);
  }
  putHoliday(data: Holiday): Observable<Holiday> {
    return this.client.put<Holiday>(
      `${environment.apiUrl}/holidays/${data.holidayId}`,
      data
    );
  }
  deleteHoliday(id: number): Observable<Holiday> {
    return this.client.delete<Holiday>(`${environment.apiUrl}/holidays/${id}`);
  }

  //! Patient api

  getPatient(id: number): Observable<Patient> {
    return this.client.get<Patient>(`${environment.apiUrl}/patients/${id}`);
  }
  putPatientAddress(id: number, data: Address): Observable<Address> {
    return this.client.put<Address>(
      `${environment.apiUrl}/patients/${id}/addresses`,
      data
    );
  }
  getAllPatient(
    pageIndex: number,
    pageSize: number,
    sortField: string,
    sortDirection: string,
    search: string
  ) {
    return this.client.get<{ data: Patient[]; rows: number }>(
      `${environment.apiUrl}/patients?pageIndex=${pageIndex}&pageSize=${pageSize}&sortField=${sortField}&sortDirection=${sortDirection}&search=${search}`
    );
  }
  postPatient(data: Patient): Observable<Patient> {
    return this.client.post<Patient>(`${environment.apiUrl}/patients`, data);
  }
  getPatientAppointment(patientId: number): Observable<AppointmentList[]> {
    return this.client.get<AppointmentList[]>(
      `${environment.apiUrl}/patients/${patientId}/appointments`
    );
  }
  updatePatientStatus(patientId: number, status: string): Observable<any> {
    return this.client.patch(
      `${environment.apiUrl}/patients/${patientId}/update-status`,
      {
        id: patientId,
        status,
      }
    );
  }

  //! Dashboard api

  getAppointmentDashboard(data: any) {
    let { facilityId, doctorId, treatmentId, from, to } = data;
    let path = `${environment.apiUrl}/dashboard/appointments?`;

    if (doctorId >= 0) {
      path += `doctorId=${doctorId}&`;
    } else if (facilityId >= 0) {
      path += `facilityId=${facilityId}&`;
    }
    if (treatmentId >= 0) path += `treatmentId=${treatmentId}&`;
    if (from) path += `from=${from}&`;
    if (to) path += `&to=${to}`;
    path = path.endsWith('&') ? path.substring(0, path.length - 1) : path;

    return this.client.get<AppointmentDashboard>(path);
  }

  getRevenueDashboard(data: any) {
    let { facilityId, doctorId, treatmentId, from, to } = data;
    let path = `${environment.apiUrl}/dashboard/revenues?`;

    if (doctorId >= 0) {
      path += `doctorId=${doctorId}&`;
    } else if (facilityId >= 0) {
      path += `facilityId=${facilityId}&`;
    }
    if (treatmentId >= 0) path += `treatmentId=${treatmentId}&`;
    if (from) path += `from=${from}&`;
    if (to) path += `&to=${to}`;
    path = path.endsWith('&') ? path.substring(0, path.length - 1) : path;

    return this.client.get<RevenueDashboard>(path);
  }

  getSubscriptionDashboard(data: any) {
    let { facilityId, doctorId } = data;
    let path = `${environment.apiUrl}/subscriptions?`;

    if (doctorId >= 0) {
      path += `doctorId=${doctorId}`;
    } else if (facilityId >= 0) {
      path += `facilityId=${facilityId}`;
    }

    return this.client.get<PlanDashboard>(path);
  }
  updatePaymentMethod(data: any) {
    return this.client.post(
      `${environment.apiUrl}/subscriptions/update-payment-method`,
      data
    );
  }
  updateCollection(data: any) {
    return this.client.post(
      `${environment.apiUrl}/subscriptions/update-collection-method`,
      data
    );
  }
  validateCollection(data: any) {
    return this.client.post(
      `${environment.apiUrl}/subscriptions/validate-collection-method`,
      data
    );
  }

  getUpcomingInvoice(data: any) {
    let { facilityId, doctorId } = data;
    let postData: any = {};

    if (facilityId >= 0) postData.facilityId = facilityId;
    else postData.doctorId = doctorId;

    return this.client.post<UpcomingInvoice>(
      `${environment.apiUrl}/subscriptions/retrieve-upcoming-invoice`,
      postData
    );
  }

  getInvoicesAndReceipts(data: any) {
    let { facilityId, doctorId } = data;
    let postData: any = {};

    if (facilityId >= 0) postData.facilityId = facilityId;
    else postData.doctorId = doctorId;

    return this.client.post<InvoicesAndReceipts>(
      `${environment.apiUrl}/subscriptions/get-invoices-and-receipts`,
      postData
    );
  }

  //! Other api

  getTags(): Observable<{ tags: [] }> {
    return this.client.get<{ tags: [] }>(`${environment.apiUrl}/doctors/tags`);
  }
  getProvinces(): Observable<string[]> {
    return this.client.get<string[]>(
      `${environment.apiUrl}/postal-codes/provinces`
    );
  }
  getIsEmailAvailable(
    email: string,
    id?: number
  ): Observable<{ isAvailable: boolean }> {
    let params = `email=${email}`;
    if (id) params += `&userId=${id}`;
    return this.client.get<{ isAvailable: boolean }>(
      `${environment.apiUrl}/users/is-email-available?${params}`
    );
  }
  getIsPhoneAvailable(
    phoneNumber: string,
    id?: number
  ): Observable<{ isAvailable: boolean }> {
    let params = `phone=${phoneNumber}`;
    if (id) params += `&userId=${id}`;
    return this.client.get<{ isAvailable: boolean }>(
      `${environment.apiUrl}/users/is-phone-available?${params}`
    );
  }
  updateProfile(id: number, phoneNumber: string, biography: string) {
    return this.client.patch(
      `${environment.apiUrl}/doctors/${id}/update-profile`,
      {
        phoneNumber,
        biography,
      }
    );
  }
  uploadProfileImage(id: number, data: any) {
    return this.client.post(
      `${environment.apiUrl}/users/${id}/upload-image`,
      data
    );
  }
  removeProfileImage(id: number) {
    return this.client.delete(`${environment.apiUrl}/users/${id}/remove-image`);
  }

  downloadFile(url: string, fileName: string) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.client.get<any>(
      `${environment.apiUrl}/subscriptions/download-file?fileName=${fileName}&fileUrl=${url}`,
      httpOptions
    );
  }
}
