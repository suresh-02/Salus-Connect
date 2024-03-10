import { environment } from './../../../environments/environment';
import { Doctor } from 'src/app/_models';
import { ApiService } from 'src/app/_services';
import { TokenStorageService } from './../../_services/token.service';
import { DataService } from 'src/app/_helpers';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-doctor',
  templateUrl: './choose-doctor.component.html',
  styleUrls: ['./choose-doctor.component.scss'],
})
export class ChooseDoctorComponent implements OnInit {
  environment = environment;
  user = this.token.getUser();
  facilityName: string;
  doctors: Doctor[];
  colors: string[] = [
    '#FCCECF',
    '#FEDBED',
    '#FCBBDB',
    '#DFEEEF',
    '#FBDBCB',
    '#FCFEED',
    '#CDBBCF',
    '#EEEEFC',
    '#DFEDEB',
    '#FDFCFF',
    '#EFFEEF',
    '#FBBFFF',
    '#CDCCFF',
    '#FECBBB',
    '#BEEEEC',
    '#BCDFBD',
    '#FFDEDE',
    '#ECBDCE',
    '#CCBEDB',
    '#FFFBBE',
  ];

  constructor(
    private client: ApiService,
    private router: Router,
    private data: DataService,
    private token: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.data.sendHeaderData({ isNavigation: false });
    this.client.getStaffDoctor(this.user.userId).subscribe((res) => {
      this.doctors = res.data;
      res.data.forEach((d) => {
        this.client.getNotifyCount(d.userId, 'doctors');
        this.client.notifyCount.subscribe((res) => {
          d.notificationCount = res.notificationCount;
        });
      });
      this.facilityName = res.facilityName;
    });
  }

  navigate(doctor: Doctor) {
    this.token.saveDoctor(doctor);
    this.data.sendHeaderData({ isNavigation: true });
    this.router.navigate(['/provider/home']);
    this.client.getNotifyCount(doctor.userId, 'doctors');
  }
}
