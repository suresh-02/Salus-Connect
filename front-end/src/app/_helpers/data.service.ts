import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private header = new BehaviorSubject({ isNavigation: true });
  private calendar = new Subject();
  private setCalendar = new Subject();
  private dateTimeSelector = new Subject();
  private treatment = new Subject();
  private appointment = new Subject();

  parent = new Subject();
  child = new Subject();

  constructor() {}

  sendHeaderData(data: any) {
    this.header.next(data);
  }

  receiveHeaderData(): Observable<any> {
    return this.header.asObservable();
  }

  sendCalendarData(data: any) {
    this.calendar.next({ ...data });
  }

  receiveCalendarData(): Observable<any> {
    return this.calendar.asObservable();
  }

  sendSetCalendarData(data: any) {
    this.setCalendar.next({ ...data });
  }

  receiveSetCalendarData(): Observable<any> {
    return this.setCalendar.asObservable();
  }

  sendDateTimeData(data: any) {
    this.dateTimeSelector.next(data);
  }

  receiveDateTimeData(): Observable<any> {
    return this.dateTimeSelector.asObservable();
  }

  sendTreatmentData(data: any) {
    this.treatment.next(data);
  }

  receiveTreatmentData(): Observable<any> {
    return this.treatment.asObservable();
  }

  sendAppointmentData(data: any) {
    this.appointment.next(data);
  }

  receiveAppointmentData(): Observable<any> {
    return this.appointment.asObservable();
  }

  //! for provider onboarding
  fromParent(data: any) {
    this.parent.next(data);
  }

  receiveFromParent(): Observable<any> {
    return this.parent.asObservable();
  }

  fromChild(data: any) {
    this.child.next(data);
  }

  receiveFromChild(): Observable<any> {
    return this.child.asObservable();
  }
}
