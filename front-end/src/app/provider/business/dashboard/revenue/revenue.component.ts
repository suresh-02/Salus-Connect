import { ApiService } from './../../../../_services/api.service';
import { TokenStorageService } from './../../../../_services/token.service';
import { RevenueDashboard, Treatment } from './../../../../_models';
import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss'],
})
export class RevenueComponent implements OnInit {
  loading = false;
  isOpen = false;

  doctor = this.token.getDoctor();
  user = this.doctor ? this.doctor : this.token.getUser();
  treatments: Treatment[];
  dashboard: RevenueDashboard;

  doctorId: number;
  facilityId: number;
  _treatmentId = -1;
  _dateRange: any[] = [];

  public get dateRange(): any[] {
    return this._dateRange;
  }
  public set dateRange(v: any[]) {
    v[0] = formatDate(v[0], 'yyyy-MM-dd', 'en');
    v[1] = formatDate(v[1], 'yyyy-MM-dd', 'en');
    this._dateRange = v;
    this.loadData();
  }

  public get treatmentId(): number {
    return this._treatmentId;
  }
  public set treatmentId(v: number) {
    this._treatmentId = v;
    this.loadData();
  }

  //filterTreatmentType = 'all';

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
    this.loading = true;
    this.client
      .getRevenueDashboard({
        doctorId: this.doctorId,
        facilityId: this.facilityId,
        treatmentId: this.treatmentId,
        from: this.dateRange[0],
        to: this.dateRange[1],
      })
      .subscribe((res) => {
        this.dashboard = res;
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
