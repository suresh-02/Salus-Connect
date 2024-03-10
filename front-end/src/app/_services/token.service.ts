import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { encode, decode } from '../_helpers/crypto';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const DOCTOR_KEY = 'auth-doctor';
const SEARCH_KEY = 'search-doctor';
const SEARCHED = 'searched';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  userData = new Subject();
  doctorData = new Subject();
  constructor() {}

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }
  public getToken(): string {
    return String(sessionStorage.getItem(TOKEN_KEY));
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userData.next(user);
  }
  public getUser() {
    let user: any = sessionStorage.getItem(USER_KEY);
    if (user !== null) return JSON.parse(user);
    else return null;
  }
  public observableUser(): Observable<any> {
    return this.userData.asObservable();
  }

  public saveDoctor(doctor: any): void {
    window.sessionStorage.removeItem(DOCTOR_KEY);
    window.sessionStorage.setItem(DOCTOR_KEY, JSON.stringify(doctor));
  }
  public getDoctor(): any {
    let doctor: any = sessionStorage.getItem(DOCTOR_KEY);
    if (doctor) return JSON.parse(doctor);
    else return null;
  }
  public observableDoctor(): Observable<any> {
    return this.doctorData.asObservable();
  }
  public removeDoctor(): any {
    window.sessionStorage.removeItem(DOCTOR_KEY);
  }

  public saveAppointment(search: any): void {
    localStorage.removeItem(SEARCH_KEY);
    localStorage.setItem(SEARCH_KEY, JSON.stringify(search));
  }
  public getAppointment(): any {
    let appointment: any = localStorage.getItem(SEARCH_KEY);
    if (appointment) return JSON.parse(appointment);
    else return null;
  }
  public removeAppointment(): any {
    localStorage.removeItem(SEARCH_KEY);
  }

  public saveSearched(search: any): void {
    sessionStorage.removeItem(SEARCHED);
    sessionStorage.setItem(SEARCHED, JSON.stringify(search));
  }
  public getSearched(): any {
    let search: any = sessionStorage.getItem(SEARCHED);
    if (search) return JSON.parse(search);
    else return null;
  }
  public removeSearched(): any {
    sessionStorage.removeItem(SEARCHED);
  }
}
