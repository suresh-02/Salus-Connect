import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppointmentDashboard, Treatment } from './../../../../_models';
import { TokenStorageService } from './../../../../_services/token.service';
import { ApiService } from './../../../../_services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
})
export class AppointmentComponent implements OnInit {
  loading = false;
  isOpen = false;

  doctor = this.token.getDoctor();
  user = this.doctor ? this.doctor : this.token.getUser();
  treatments: Treatment[];
  dashboard: AppointmentDashboard | undefined;
  bookingEfficiency: any[] = [];

  doctorId: number;
  facilityId: number;
  _treatmentId = -1;
  dateRange: any[] = [];

  public get treatmentId(): number {
    return this._treatmentId;
  }
  public set treatmentId(v: number) {
    this._treatmentId = v;
    this.loadData();
  }

  constructor(
    private token: TokenStorageService,
    private client: ApiService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((p) => {
      this.doctorId = p.docId;
      this.facilityId = p.facilityId;
      if (this.doctorId < 0) this._treatmentId = -1;

      if (this.doctorId >= 0 || this.facilityId >= 0) this.loadData();
    });
  }

  ngOnInit(): void {}

  loadData() {
    let totalSeconds = 0;

    this.loading = true;
    this.dashboard = undefined;
    this.client
      .getAppointmentDashboard({
        doctorId: this.doctorId,
        facilityId: this.facilityId,
        treatmentId: this.treatmentId,
        from: this.dateRange[0]
          ? formatDate(this.dateRange[0], 'yyyy-MM-dd', 'en')
          : null,
        to: this.dateRange[1]
          ? formatDate(this.dateRange[1], 'yyyy-MM-dd', 'en')
          : null,
      })
      .subscribe((res) => {
        this.dashboard = res;
        res.bookings?.forEach((be) => {
          totalSeconds += be.efficiencySeconds;
        });

        let averageSeconds = totalSeconds / res.bookings.length;
        if (averageSeconds) {
          let resultstring = `${Math.trunc(averageSeconds / 60)}:${
            averageSeconds % 60
          }`;

          this.bookingEfficiency = resultstring.split(':');
        } else this.bookingEfficiency = [];
        this.loading = false;
      });

    if (this.doctorId > 0) {
      this.client.getTreatments(this.doctorId).subscribe((res) => {
        this.treatments = res;
      });
    } else {
      this.treatments = [];
    }
  }
}
