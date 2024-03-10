import { environment } from './../../../environments/environment';
import { DataService } from './../../_helpers/data.service';
import { TokenStorageService } from './../../_services/token.service';
import { AuthService } from './../../_services/auth.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  environment = environment;
  user = this.token.getUser();
  constructor(
    public auth: AuthService,
    private token: TokenStorageService,
    public data: DataService
  ) {}

  ngOnInit(): void {
    this.token.observableUser().subscribe((res) => {
      this.user = { ...res };
    });
  }
  logout() {
    this.auth.logout();
    this.user = null;
  }
}
