import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private client: HttpClient) {}

  login(data: any): Observable<any> {
    return this.client.post(`${environment.apiUrl}/users/authenticate`, data);
  }
  logout() {
    window.sessionStorage.clear();
    localStorage.clear();
  }
}
