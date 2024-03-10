import { environment } from './../../../environments/environment';
import { ApiService } from 'src/app/_services';
import { TokenStorageService } from './../../_services/token.service';
import { AuthService } from './../../_services/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { DataService, InOut } from 'src/app/_helpers';
@Component({
  selector: 'app-provider-header',
  templateUrl: './provider-header.component.html',
  styleUrls: ['./provider-header.component.scss'],
  animations: [InOut],
})
export class ProviderHeaderComponent implements OnInit {
  environment = environment;
  // color = '#7E858D';
  @Input('isNavigation') isNavigation = true;
  isAdmin = false;
  isPatient = false;
  isStaff = false;
  isStaffOrDoctor = false;

  isDropdown = false;
  isNavMenu = false;
  toggleMenu = false;
  items: any[] = [];
  user = this.token.getUser();
  notification: number = 0;

  constructor(
    private data: DataService,
    public auth: AuthService,
    private token: TokenStorageService,
    private client: ApiService
  ) {
    this.data.receiveHeaderData().subscribe((data) => {
      this.isNavigation = data.isNavigation;
    });
  }

  ngOnInit(): void {
    this.token.observableUser().subscribe((res) => {
      this.user = { ...res };
    });
    if (this.user) {
      this.isAdmin = this.user.role.roleName === 'Administrator';
      this.isStaffOrDoctor =
        this.user.role.roleName === 'SupportStaff' ||
        this.user.role.roleName === 'Doctor';
      this.isStaff = this.user.role.roleName === 'SupportStaff';
      this.isPatient = this.user.role.roleName === 'Patient';
    }
    this.notifyCount();
  }

  notifyCount() {
    let user = this.user;
    let type = '';
    if (user?.role?.roleName === 'SupportStaff') {
      user = this.token.getDoctor();
      type = 'doctors';
    } else type = user.role.roleName === 'Doctor' ? 'doctors' : 'patients';

    if (user?.userId && !this.isPatient && !this.isAdmin) {
      this.client.getNotifyCount(user.userId, type);
    }
    this.client.notifyCount.subscribe((res) => {
      this.notification = res.notificationCount;
    });
  }

  menuClick() {
    this.isNavMenu = !this.isNavMenu;
    this.notifyCount();
  }
}
