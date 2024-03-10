import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { formatDate } from '@angular/common';
import { ApiService, TokenStorageService } from 'src/app/_services';
import { Component, OnInit } from '@angular/core';
import { AppointmentList } from 'src/app/_models';
import { subtractDate, addMinute, stringToDate } from 'src/app/_helpers';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  addMinute = addMinute;
  formatDate = formatDate;
  patient = this.token.getUser();
  appointments: AppointmentList[];
  loading = false;
  status: string[] = [];

  isCancellable = (dt: string, till: number): Boolean => {
    let date: Date = stringToDate(dt);
    //console.log('isCancellable', dt, till, date);
    return (
      subtractDate(date, till, 'day') >=
      formatDate(new Date(), 'yyyy-MM-dd', 'en')
    );
  };

  constructor(
    private client: ApiService,
    private token: TokenStorageService,
    private toast: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.client.getPatientAppointment(this.patient.userId).subscribe((res) => {
      this.loading = false;
      this.appointments = res;
      // this.client.markAsRead(this.patient.userId, 'patients');
    });
  }

  trackByFunction = (index: number, apppointment: AppointmentList) => {
    return apppointment.appointmentId;
  };

  submit(id: number, statusIndex: number, newTime?: string) {
    let data: any = {
      appointmentId: id,
      appointmentStatus: this.status[statusIndex],
      notifyParty: 'Provider',
    };
    if (this.status[statusIndex] === 'Confirmed' && newTime) {
      data.newAppointmentTime = formatDate(newTime, 'yyyy-MM-dd HH:mm', 'en');
    }
    const tId = this.toast.loading('Action in progress..', {
      nzDuration: 0,
    }).messageId;
    this.client.appointmentStatus(id, data).subscribe((res) => {
      this.loadData();
      this.status[statusIndex] = '';
      this.toast.remove(tId);
    });
  }

  changeStatus(id: number, statusIndex: number, newTime?: string) {
    console.log(newTime);
    this.modal.confirm({
      nzTitle: 'Are you sure want to change the status?',
      nzOkText: 'Yes',
      nzOnOk: () => this.submit(id, statusIndex, newTime),
      nzCancelText: 'No',
      nzOnCancel: () => (this.status[statusIndex] = ''),
    });
  }
}
