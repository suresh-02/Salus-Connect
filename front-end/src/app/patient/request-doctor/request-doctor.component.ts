import { environment } from './../../../environments/environment';
import { Treatment } from './../../_models/appointment.model';
import { formatDate } from '@angular/common';
import {
  Fader,
  sortTimeArray,
  timeStringToDate,
  addMinute,
} from 'src/app/_helpers';
import { SearchDoctor } from 'src/app/_models';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenStorageService, ApiService } from 'src/app/_services';
import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-request-doctor',
  templateUrl: './request-doctor.component.html',
  styleUrls: ['./request-doctor.component.scss'],
  animations: [Fader],
})
export class RequestDoctorComponent implements OnInit {
  public Editor = ClassicEditor;
  environment = environment;

  loading = false;
  moment = moment;
  timeStringToDate = timeStringToDate;
  addMinute = addMinute;
  @Input() doctor: SearchDoctor;
  symptoms = '';
  colors: string[] = [
    '#FFFBBE',
    '#DFEEEF',
    '#FBDBCB',
    '#FCFEED',
    '#CDBBCF',
    '#EEEEFC',
    '#DFEDEB',
    '#FDFCFF',
    '#FFDEDE',
    '#ECBDCE',
    '#CCBEDB',
    '#FFFBBE',
    '#FCCECF',
    '#FEDBED',
    '#FCBBDB',
    '#BCDFBD',
    '#EFFEEF',
    '#FBBFFF',
    '#CDCCFF',
    '#FECBBB',
    '#BEEEEC',
  ];
  includedDates: string[] = [];
  availableSlots: any[];
  treatments: Treatment[];
  disabledDate = (current: Date): boolean => {
    return !this.includedDates.includes(
      formatDate(current, 'yyyy-MM-dd', 'en')
    );
  };

  private _selectedTreatment: Treatment;
  public get selectedTreatment(): Treatment {
    return this._selectedTreatment;
  }
  public set selectedTreatment(v: Treatment) {
    this._selectedTreatment = v;
    // console.log(v);
    if (this.selectedTreatment.treatmentId) {
      this.loading = true;
      this.client
        .searchTreatmentSlot(this.doctor.id, this.selectedTreatment.treatmentId)
        .subscribe((res) => {
          this.loading = false;
          // this.selectedDate = null;
          this.doctor.slots = res;
          this.includedDates = [];
          res.map((slot) => {
            // slot.times = sortTimeArray(slot.times);
            this.includedDates.push(slot.date);
          });
          if (this.selectedDate) {
            let slots = this.doctor.slots.filter(
              (s) =>
                formatDate(s.date, 'yyyy-MM-dd', 'en') ===
                formatDate(this.selectedDate, 'yyyy-MM-dd', 'en')
            );
            if (slots.length > 0) this.availableSlots = slots[0].times;
            else this.availableSlots = [];
          } else {
            if (this.includedDates[0])
              this.selectedDate = new Date(`${this.includedDates[0]}T00:00`);
          }
          this.includedDates = [...this.includedDates];
        });
    }
  }

  private _selectedDate: Date;
  get selectedDate() {
    return this._selectedDate;
  }
  set selectedDate(date: any) {
    this._selectedDate = date;
    this.selectedSlot = '';
    let slots = this.doctor.slots.filter(
      (s) =>
        formatDate(s.date, 'yyyy-MM-dd', 'en') ===
        formatDate(this.selectedDate, 'yyyy-MM-dd', 'en')
    );
    if (slots.length > 0) this.availableSlots = slots[0].times;
    else this.availableSlots = [];
  }

  selectedSlot: string;
  isSeeMore = false;

  requestAppointment() {
    let user = this.token.getUser();
    let isPatient = user ? user.role.roleName === 'Patient' : false;
    let data = {
      date: new Date(`${formatDate(this.selectedDate, 'yyyy-MM-dd', 'en')}`),
      slot: this.selectedSlot,
      doctorId: this.doctor.id,
      symptoms: this.symptoms,
      treatmentId: this.selectedTreatment.treatmentId,
    };
    // console.log(data);
    this.token.saveAppointment(data);
    if (isPatient) this.router.navigate(['/booking']);
    else this.router.navigate(['/login']);
  }

  constructor(
    private client: ApiService,
    private token: TokenStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let { q } = this.route.snapshot.queryParams;
    let eq: any = {};

    window
      .atob(q)
      .split('&')
      .forEach((q) => {
        eq[q.split('=')[0]] = q.split('=')[1];
      });

    const { dId, dt, time, tId } = eq;

    this.client.searchProvider({ id: dId, date: dt }).subscribe((res) => {
      this.doctor = res[0];
      this.doctor.slots.map((slot) => {
        slot.times = sortTimeArray(slot.times);
        this.includedDates.push(slot.date);
      });
      if (dt) {
        this.selectedDate = new Date(`${dt}T00:00`);
        this.selectedSlot = time;
      }
      this.treatments = this.doctor.treatments;
      if (tId)
        this.selectedTreatment = this.treatments.filter(
          (t) => t.treatmentId == tId
        )[0];
      else {
        this.selectedTreatment = this.doctor.treatments[0];
      }
    });
  }
}
