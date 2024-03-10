import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SlotException } from './../../_models/appointment.model';
import { DataService } from './../../_helpers/data.service';
import { formatDate } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { amOrPm, timeStringToDate, stringToDate } from 'src/app/_helpers';

@Component({
  selector: 'app-date-time-selector',
  templateUrl: './date-time-selector.component.html',
  styleUrls: ['./date-time-selector.component.scss'],
})
export class DateTimeSelectorComponent implements OnInit {
  amOrPm = amOrPm;

  isFormChanged = false;

  @Output() isSlot = new EventEmitter<boolean>();
  interval: any = {
    durationMinutes: 30,
    startTime: '08:00',
    endTime: '15:00',
  };

  @Input('dates') exceptionDates: SlotException[] = [];

  dates: string[] = [];

  startTime: Date | null;
  endTime: Date | null;

  notAvailable: boolean | null;

  private _selectedDate = 0;

  public get selectedDate(): number {
    return this._selectedDate;
  }

  public set selectedDate(v: number) {
    let pDate = stringToDate(this.dates[this.selectedDate]);

    this._selectedDate = v;
    this.startTime = null;
    this.endTime = null;

    let date = stringToDate(this.dates[this.selectedDate]);
    if (date.getMonth() !== pDate.getMonth()) {
      console.log('sent');
      this.data.sendSetCalendarData({ month: date.getMonth() });
    }

    let fd = this.getDate();
    if (fd) {
      this.notAvailable = fd.notAvailable;
      if (fd.exceptionTimeRange) {
        this.startTime = new Date(
          `${timeStringToDate(fd.exceptionTimeRange[0])}`
        );
        this.endTime = new Date(
          `${timeStringToDate(fd.exceptionTimeRange[1])}`
        );
      }
    } else {
      this.notAvailable = false;
    }
  }

  constructor(
    public data: DataService,
    private modal: NzModalService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    // this.generateSlots();
    // this.exceptionDates = this.interval.exceptionDates;
    if (this.exceptionDates.length > 0) {
      this.exceptionDates.sort((a: SlotException, b: SlotException) => {
        if (a.exceptionDate < b.exceptionDate) {
          return -1 * 1;
        } else if (a.exceptionDate > b.exceptionDate) {
          return 1 * 1;
        } else {
          return 0;
        }
      });
      this.exceptionDates.map((d) => {
        this.dates.push(d.exceptionDate);
      });
      this.selectedDate = 0;
    }
    this.data.receiveCalendarData().subscribe((res) => {
      let sortedDates;
      if (res.calendarDates) {
        sortedDates = res.calendarDates.sort((a: any, b: any) => {
          if (a < b) {
            return -1 * 1;
          } else if (a > b) {
            return 1 * 1;
          } else {
            return 0;
          }
        });
        this.dates = sortedDates;
        this.isFormChanged = true;
      }

      if (this.exceptionDates.length > 0)
        this.exceptionDates.forEach((d) => {
          if (!this.dates.includes(d.exceptionDate)) {
            let id = this.exceptionDates.indexOf(d);
            this.exceptionDates.splice(id, 1);
          }
        });
      if (this.selectedDate !== 0) this.selectedDate = 0;

      if (this.exceptionDates.length > 0)
        this.exceptionDates = [...this.exceptionDates];

      if (this.exceptionDates[0]?.exceptionDate === this.dates[0]) {
        if (this.exceptionDates[0]?.exceptionTimeRange) {
          this.startTime = timeStringToDate(
            this.exceptionDates[0].exceptionTimeRange[0]
          );
          this.endTime = timeStringToDate(
            this.exceptionDates[0].exceptionTimeRange[1]
          );
        } else if (this.exceptionDates[0]?.notAvailable) {
          this.startTime = null;
          this.endTime = null;
          this.notAvailable = true;
        }
      } else {
        this.startTime = null;
        this.endTime = null;
        this.notAvailable = false;
      }
    });
    this.data.sendCalendarData({
      custom: true,
      dates: this.dates,
    });
  }

  getDate() {
    return this.exceptionDates.filter((d) => {
      return (
        formatDate(
          stringToDate(this.dates[this.selectedDate]),
          'yyyy-MM-ddT00:00',
          'en'
        ) === formatDate(d.exceptionDate, 'yyyy-MM-ddT00:00', 'en')
      );
    })[0];
  }

  saveSelection() {
    console.log('selection');
    let fd = this.getDate();
    if (!fd) this.addNewDate();
    this.exceptionDates[this.selectedDate].notAvailable = this.notAvailable;
    if (this.notAvailable)
      delete this.exceptionDates[this.selectedDate].exceptionTimeRange;
  }

  saveDate() {
    let fd = this.getDate();
    if (!fd) this.addNewDate();

    if (this.startTime && this.endTime && !this.notAvailable) {
      this.exceptionDates[this.selectedDate].notAvailable = false;
      this.exceptionDates[this.selectedDate].exceptionTimeRange = [
        formatDate(this.startTime, 'HH:mm', 'en'),
        formatDate(this.endTime, 'HH:mm', 'en'),
      ];
    }
    this.exceptionDates = [...this.exceptionDates];

    // console.log(this.exceptionDates[this.selectedDate]);
  }

  addNewDate() {
    let fd = this.getDate();
    if (!fd) {
      this.isFormChanged = true;
      let data: SlotException = {
        exceptionDate: this.dates[this.selectedDate],
        notAvailable: false,
      };
      this.exceptionDates.push(data);
      this.exceptionDates.sort((a: SlotException, b: SlotException) => {
        if (a.exceptionDate < b.exceptionDate) {
          return -1 * 1;
        } else if (a.exceptionDate > b.exceptionDate) {
          return 1 * 1;
        } else {
          return 0;
        }
      });
      this.exceptionDates = [...this.exceptionDates];
    }
  }

  nextDate() {
    this.addNewDate();
    this.selectedDate = this.selectedDate + 1;
    if (this.selectedDate === this.dates.length - 1) this.addNewDate();
  }

  previousDate() {
    this.addNewDate();
    this.selectedDate = this.selectedDate - 1;
  }

  save() {
    this.data.sendDateTimeData(this.exceptionDates);
    this.isFormChanged = false;
    this.message.success('Success', 'Exception saved successfully');
  }

  exit() {
    if (this.isFormChanged) {
      this.modal.confirm({
        nzTitle: 'Unsaved Changes',
        nzOkText: 'Yes',
        nzCancelText: 'No',
        nzContent:
          'You have unsaved changes. Are you sure you want to leave this page?',
        nzOnOk: () => {
          this.isSlot.emit(false);
        },
      });
    } else {
      this.isSlot.emit(false);
    }
  }
}
