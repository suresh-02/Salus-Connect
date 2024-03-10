import { formatDate } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { DataService } from 'src/app/_helpers';

interface Calendar {
  date: number;
  month: number;
  year: number;
  class: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Output('clickedDate') clickedDate = new EventEmitter<string>();
  today = new Date();
  custom = false;
  private _date = new Date();
  private _activeDates: string[] = [];
  private _inactiveDates: string[] = [];
  @Input('selectedDate') selectedDate: any;

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

  get activeDates(): string[] {
    if (this._activeDates) {
      return this._activeDates;
    } else {
      return [];
    }
  }
  set activeDates(activeDates: string[]) {
    this._activeDates = activeDates;
    // console.log('active');
    this.setCalendar({
      month: this.today.getMonth(),
      year: this.today.getFullYear(),
    });
  }
  get inactiveDates(): string[] {
    if (this._inactiveDates) {
      return this._inactiveDates;
    } else {
      return [];
    }
  }
  set inactiveDates(inactiveDated: string[]) {
    this._inactiveDates = inactiveDated;
    // console.log('inactive');
    this.setCalendar({
      month: this.today.getMonth(),
      year: this.today.getFullYear(),
    });
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
  calendarDates: Calendar[];

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

  constructor(private data: DataService) {
    this.data.receiveCalendarData().subscribe((res) => {
      this.custom = res.custom;
      if (res.dates) this.activeDates = res.dates;
      if (res.reset) this.clearCalendar();
    });
    this.data.receiveSetCalendarData().subscribe((res) => {
      if (res.year) {
        if (
          this.date.getMonth() !== res.month ||
          this.date.getFullYear() !== res.year
        ) {
          console.log(res);
          this.setCalendar({ month: res.month, year: res.year });
        }
      }
      if (this.date.getMonth() !== res.month) {
        console.log(res);
        this.setCalendar({ month: res.month });
      }
    });
  }

  ngOnInit() {
    this.setCalendar({
      month: this.today.getMonth(),
      year: this.today.getFullYear(),
    });
  }

  setCalendar(data: any) {
    let { month, year, isNav } = data;
    let currentDate = this.date;
    currentDate.setDate(1);
    currentDate.setMonth(month);
    this.date = currentDate;
    if (year) {
      currentDate.setFullYear(year);
      this.date = currentDate;
    }
    if (!this.custom && isNav) {
      this.selectedDate =
        'date-' +
        currentDate.getDate() +
        '-' +
        currentDate.getMonth() +
        '-' +
        currentDate.getFullYear();
      this.clickedDate.emit(formatDate(currentDate, 'yyyy-MM-dd', 'en'));
    }

    this.previousDayCount = Array(this.firstDayIndex);
    this.calendarDates = this.generateCalendar(1, this.lastDayIndex);
  }

  generateCalendar(start: number, end: number): Calendar[] {
    return Array(end - start + 1)
      .fill(0)
      .map((_, idx) => {
        const currentDate = formatDate(
          new Date(this.date.getFullYear(), this.date.getMonth(), idx + 1),
          'yyyy-MM-dd',
          'en'
        );
        const formattedToday = formatDate(this.today, 'yyyy-MM-dd', 'en');

        //! Check for today & past dates
        if (formattedToday === currentDate) {
          if (this.activeDates.includes(formattedToday)) {
            return {
              date: idx + 1,
              month: this.date.getMonth(),
              year: this.date.getFullYear(),
              class: 'date selected',
            };
          } else {
            return {
              date: idx + 1,
              month: this.date.getMonth(),
              year: this.date.getFullYear(),
              class: 'date today',
            };
          }
        } else if (currentDate < formattedToday && this.custom) {
          if (this.activeDates.includes(currentDate)) {
            return {
              date: idx + 1,
              month: this.date.getMonth(),
              year: this.date.getFullYear(),
              class: 'date inactive selected',
            };
          } else
            return {
              date: start + idx,
              month: this.date.getMonth(),
              year: this.date.getFullYear(),
              class: 'date inactive',
            };
        }

        if (this.custom) {
          //! make given dates Active
          for (let i = 0; i < this.activeDates.length; i++) {
            const active = new Date(`${this.activeDates[i]}T00:00`);
            if (
              active.getDate() === idx + 1 &&
              active.getMonth() === this.date.getMonth() &&
              active.getFullYear() === this.date.getFullYear()
            ) {
              return {
                date: start + idx,
                month: active.getMonth(),
                year: active.getFullYear(),
                class: 'date selected',
              };
            }
          }

          //! make given dates InActive
          for (let i = 0; i < this.inactiveDates.length; i++) {
            const inactive = new Date(`${this.inactiveDates[i]}T00:00`);
            if (
              inactive.getDate() === idx + 1 &&
              inactive.getMonth() === this.date.getMonth() &&
              inactive.getFullYear() === this.date.getFullYear() &&
              this.activeDates.includes(this.inactiveDates[i])
            ) {
              return {
                date: start + idx,
                month: inactive.getMonth(),
                year: inactive.getFullYear(),
                class: 'date inactive',
              };
            }
          }
        }

        //! date
        return {
          date: start + idx,
          month: this.date.getMonth(),
          year: this.date.getFullYear(),
          class: 'date',
        };
      });
  }

  clearCalendar() {
    for (let i = 1; i <= this.lastDayIndex; i++) {
      document.getElementById('date-' + i)?.classList.remove('selected');
    }
    this.activeDates = [];
  }

  onCalendarChange(fullDate: any, id: any) {
    const { date, month, year } = fullDate;
    const dateString = formatDate(
      new Date(year, month, date),
      'yyyy-MM-dd',
      'en'
    );

    if (!fullDate.class.includes('inactive')) {
      this.clickedDate.emit(dateString);
      this.selectedDate = id;
    }
    if (
      (fullDate.active === undefined || fullDate.active === true) &&
      this.custom
    ) {
      console.log('inside');
      this.selectedDate = -1;
      if (document.getElementById(id)?.classList.contains('selected')) {
        document.getElementById(id)?.classList.remove('selected');
        let index = this.activeDates.indexOf(dateString);
        this.activeDates.splice(index, 1);
        if (
          new Date().getDate() > new Date(dateString).getDate() &&
          new Date().getMonth() > new Date(dateString).getMonth() &&
          new Date().getFullYear() > new Date(dateString).getFullYear()
        ) {
          document.getElementById(id)?.classList.add('inactive');
        }
      } else {
        if (
          !document.getElementById(id)?.classList.contains('inactive') &&
          this.custom
        ) {
          this.activeDates.push(dateString);
          document.getElementById(id)?.classList.add('selected');
        }
      }
      this.data.sendCalendarData({
        custom: this.custom,
        calendarDates: this.activeDates,
      });
    }
  }
}
