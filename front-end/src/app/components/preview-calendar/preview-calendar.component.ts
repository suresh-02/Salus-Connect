import { DataService } from 'src/app/_helpers';
import { Appointment, Treatment } from './../../_models/appointment.model';
import { TokenStorageService } from 'src/app/_services';
import { formatDate } from '@angular/common';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import * as moment from 'moment';

interface Calendar {
  date: string;
  class: string;
  treatments?: {
    treatmentName: string;
    count: number;
  }[];
  total: number;
}

interface Slots {
  treatmentName: string;
  count: number;
  daysAvailable: number[];
  durationMinutes: number;
}

@Component({
  selector: 'app-preview-calendar',
  templateUrl: './preview-calendar.component.html',
  styleUrls: ['../calendar/calendar.component.scss'],
})
export class PreviewCalendarComponent implements OnInit {
  @Output('clickedDate') clickedDate = new EventEmitter<string>();
  appointmentData: Appointment;
  doctor = this.token.getDoctor();
  user = this.token.getUser();
  today = new Date();
  custom = false;
  selectedDate: any;

  slots: Slots[] = [];
  startDate: string;
  endDate: string;

  private _date = new Date();

  get date(): Date {
    return this._date;
  }
  set date(date: Date) {
    this._date = date;

    this.firstDayIndex = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).getDay();

    this.lastDayIndex = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
  }

  firstDayIndex = new Date(
    this.date.getFullYear(),
    this.date.getMonth(),
    1
  ).getDay();

  lastDayIndex = new Date(
    this.date.getFullYear(),
    this.date.getMonth() + 1,
    0
  ).getDate();

  previousDayCount: any[];
  calendarData: Calendar[];

  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  dayOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  constructor(private token: TokenStorageService, private data: DataService) {}

  ngOnInit() {
    let id = this.doctor ? this.doctor.userId : this.user.userId;
    this.data.receiveAppointmentData().subscribe((res) => {
      this.appointmentData = { ...res };
      this.dataForCalendar();
    });
    this.data.receiveTreatmentData().subscribe((data) => {
      this.appointmentData.treatments = data;
      this.dataForCalendar();
    });
    this.data.receiveDateTimeData().subscribe((data) => {
      this.appointmentData.slotExceptions = data;
      this.dataForCalendar();
    });
  }

  dataForCalendar() {
    this.slots = [];
    if (this.appointmentData.treatments)
      this.appointmentData.treatments.forEach((t) => {
        let data = {
          treatmentName: t.nickname,
          count: this.noOfSlots(
            t.timeRange[0],
            t.timeRange[1],
            t.durationMinutes + (t.breakMinutes ? t.breakMinutes : 0)
          ),
          daysAvailable: t.treatmentDays,
          durationMinutes:
            t.durationMinutes + (t.breakMinutes ? t.breakMinutes : 0),
        };
        this.slots.push(data);
      });
    let month: number = this.today.getMonth();
    let year: number = this.today.getFullYear();
    if (this.appointmentData.dateRange) {
      this.startDate = this.appointmentData.dateRange[0];
      this.endDate = this.appointmentData.dateRange[1];
      // month = new Date(this.appointmentData.dateRange[0]).getMonth();
      // year = new Date(this.appointmentData.dateRange[0]).getFullYear();
    }
    this.initiateCalendar(month, year);
  }

  noOfSlots(start: string, end: string, interval: number) {
    let sTime = moment(start, 'hh:mm');
    let eTime = moment(end, 'hh:mm');
    let slotCount = Math.floor(
      (moment.duration(eTime.diff(sTime)).asHours() * 60) / interval
    );
    return slotCount;
  }

  initiateCalendar(month: number, year?: number) {
    let currentDate = this.date;
    currentDate.setDate(1);
    currentDate.setMonth(month);
    this.date = currentDate;
    if (year) {
      currentDate.setFullYear(year);
      this.date = currentDate;
    }

    this.previousDayCount = Array(this.firstDayIndex);
    this.calendarData = this.generateCalendar(1, this.lastDayIndex);
  }

  generateCalendar(start: number, end: number): Calendar[] {
    return Array(end - start + 1)
      .fill(0)
      .map((_, idx) => {
        const currentDate = new Date(
          this.date.getFullYear(),
          this.date.getMonth(),
          idx + 1
        );
        const FcurrentDate = formatDate(
          new Date(this.date.getFullYear(), this.date.getMonth(), idx + 1),
          'yyyy-MM-dd',
          'en'
        );
        const formattedToday = formatDate(this.today, 'yyyy-MM-dd', 'en');
        let total = 0;
        let Fslots: Slots[] = [];
        if (this.appointmentData.treatments) {
          const startDate = formatDate(this.startDate, 'yyyy-MM-dd', 'en');
          const endDate = formatDate(this.endDate, 'yyyy-MM-dd', 'en');

          this.slots.forEach((s) => {
            if (
              s.daysAvailable.includes(
                currentDate.getDay() + 1 === 1 ? 7 : currentDate.getDay()
              )
            ) {
              let data = { ...s };
              this.appointmentData.slotExceptions.forEach((se) => {
                if (se.exceptionDate === FcurrentDate) {
                  if (se.notAvailable) data.count = 0;
                  else {
                    // console.log(se.exceptionDate);
                    // console.log(data.count);
                    // console.log(se.exceptionTimeRange);
                    if (se.exceptionTimeRange) {
                      data.count = this.noOfSlots(
                        se.exceptionTimeRange[0],
                        se.exceptionTimeRange[1],
                        s.durationMinutes
                      );
                    }
                    // console.log(data.count);
                  }
                }
              });
              Fslots.push(data);
            }
          });
          Fslots.forEach((s) => (total += s.count));
          let data = {
            date: FcurrentDate,
            class: 'date ',
            treatments: Fslots,
            total,
          };
          if (total === 0) {
            data.class += 'inactive';
          }

          //! Check for today & past dates
          if (formattedToday === FcurrentDate) {
            if (FcurrentDate < startDate) {
              data.class += 'today inactive';
              data.total = 0;
            } else data.class += 'today';
            return data;
          } else if (
            FcurrentDate >= formattedToday &&
            FcurrentDate <= endDate
          ) {
            return data;
          }
        }
        return {
          date: FcurrentDate,
          class: 'date inactive',
          treatments: [],
          total: 0,
        };
      });
  }
}
