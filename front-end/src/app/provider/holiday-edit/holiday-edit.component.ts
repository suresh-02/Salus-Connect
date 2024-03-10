import { formatDate } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/_services';
import { Component, OnInit } from '@angular/core';
import { Holiday } from 'src/app/_models/holiday.model';

@Component({
  selector: 'app-holiday-edit',
  templateUrl: './holiday-edit.component.html',
  styleUrls: ['./holiday-edit.component.scss'],
})
export class HolidayEditComponent implements OnInit {
  loading = false;
  year: number[] = [];
  _selectedYear = 1900;
  public get selectedYear(): number {
    return this._selectedYear;
  }
  public set selectedYear(v: number) {
    this._selectedYear = v;
    this.loadData();
  }

  isModal = false;

  provinces: string[] = [];
  tempProvince: string[] = [];
  holidays: Holiday[];
  modalTitle = '';

  id: number = -1;
  holidayName = new FormControl('', [
    Validators.required,
    Validators.maxLength(100),
    Validators.minLength(5),
  ]);
  selectedProvince: string[] = [];
  _selectedMonth = new FormControl(null, [Validators.required]);
  selectedDate = new FormControl(null, [Validators.required]);
  public get selectedMonth(): Date {
    return this._selectedMonth.value;
  }
  public set selectedMonth(v: Date) {
    this._selectedMonth.setValue(v);
    this.selectedDate.setValue(
      new Date(this.selectedYear, this.selectedMonth.getMonth(), 1)
    );
    this.selectedDate.enable();
  }

  constructor(
    private client: ApiService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.selectedDate.disable();
    let date = new Date();
    for (let i = 2021; i <= date.getFullYear() + 1; i++) {
      this.year.push(i);
    }
    this.client.getProvinces().subscribe((res) => {
      this.provinces.push('ALL');
      this.provinces = [...this.provinces, ...res];
      this.tempProvince = this.provinces;
    });
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.holidayName.setValue('');
    this.client.getHolidays(this.selectedYear).subscribe(
      (res) => {
        this.holidays = res;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  toggleModal(id: number) {
    if (id >= 0) {
      this.id = this.holidays[id].holidayId;
      let holiday = this.holidays[id];
      this.selectedMonth = new Date(holiday.date);
      this.selectedDate.enable();
      this.selectedDate.setValue(new Date(`${holiday.date}T00:00`));
      this.holidayName.setValue(holiday.name);
      this.modalTitle = 'Edit';
      if (holiday.provinces.length === 0) this.selectedProvince = ['ALL'];
      else this.selectedProvince = holiday.provinces;
    } else this.modalTitle = 'Add';
    this.isModal = true;
  }

  closeModal() {
    this.id = -1;
    this._selectedMonth.reset();
    this.selectedDate.reset();
    this.selectedDate.disable();
    this.selectedProvince = [];
    this.holidayName.setValue('');
    this.isModal = false;
  }

  submit() {
    let data: Holiday = {
      holidayId: this.id,
      date: this.selectedDate.value,
      name: this.holidayName.value,
      provinces: this.selectedProvince,
    };

    if (data.provinces.includes('ALL')) data.provinces = [];

    data.date = formatDate(data.date, 'yyyy-MM-dd', 'en');

    if (this.id == -1) {
      this.client.postHoliday(data).subscribe((res) => {
        this.message.success('Success', 'Holiday added successfully');
        this.isModal = false;
        ``;
        this.loadData();
      });
    } else {
      this.client.putHoliday(data).subscribe((res) => {
        this.message.success('Success', 'Holiday edited successfully');
        this.isModal = false;
        this.loadData();
      });
    }
  }

  delete(id: number) {
    this.client.deleteHoliday(id).subscribe((res) => {
      this.message.success('Success', 'Holiday deleted successfully');
      this.loadData();
    });
  }
  provinceChange() {
    if (this.selectedProvince.includes('ALL')) {
      this.selectedProvince = ['ALL'];
      this.provinces = [];
    } else this.provinces = this.tempProvince;
  }
}
