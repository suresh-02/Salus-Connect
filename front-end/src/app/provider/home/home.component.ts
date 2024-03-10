import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormControl, Validators } from '@angular/forms';
import {
  addMinute,
  amOrPm,
  stringToDate,
  DataService,
  dateToString,
} from 'src/app/_helpers';
import { AppointmentList } from './../../_models/appointment.model';
import { TokenStorageService } from './../../_services/token.service';
import { ApiService } from './../../_services/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import tippy from 'tippy.js';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';

interface GroupedAppointment {
  accepcted: AppointmentList[];
  requested: AppointmentList[];
  proposeNew: AppointmentList[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public Editor = ClassicEditor;

  addMinute = addMinute;
  amOrPm = amOrPm;
  date = new Date();

  appointmentId = -1;
  notesModal: boolean;
  richStaffNotes = new FormControl('');
  richDoctorNotes = new FormControl('');
  staffNotes = new FormControl(''); // , [Validators.maxLength(4000)]
  doctorNotes = new FormControl(''); // , [Validators.maxLength(4000)]

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  isOpen = false;
  filterTreatmentType = 'all';

  doctor = this.token.getDoctor();
  user = this.token.getUser();
  tempAppointment: AppointmentList[] = [];
  appointments: AppointmentList[] = [];
  groupedAppointments: GroupedAppointment = {
    accepcted: [],
    requested: [],
    proposeNew: [],
  };
  treatmentList: string[] = [];

  _selectedDate: Date;
  get selectedDate(): Date {
    if (this._selectedDate) return this._selectedDate;
    else return this.date;
  }
  set selectedDate(value: Date) {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(value);
    this._selectedDate = value;
    this.appointments = [];
    this.saveFilter();
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dayMaxEventRows: true,
    views: {
      dayGridMonth: {
        dayMaxEventRows: 3,
      },
    },
    events: [],
    customButtons: {
      prev: {
        click: (info) => {
          let calendarApi = this.calendarComponent.getApi();
          calendarApi.prev();
          this.selectedDate =
            calendarApi.currentData.dateProfile.currentRange.start;
          let from = dateToString(
            calendarApi.currentData.dateProfile.currentRange.start
          );
          let to = dateToString(
            calendarApi.currentData.dateProfile.currentRange.end
          );
          this.data.sendSetCalendarData({
            month: this.selectedDate.getMonth(),
            year: this.selectedDate.getFullYear(),
          });
          this.loadData(from, to);
        },
      },
      next: {
        click: (info) => {
          let calendarApi = this.calendarComponent.getApi();
          calendarApi.next();
          this.selectedDate =
            calendarApi.currentData.dateProfile.currentRange.start;
          let from = dateToString(
            calendarApi.currentData.dateProfile.currentRange.start
          );
          let to = dateToString(
            calendarApi.currentData.dateProfile.currentRange.end
          );
          this.data.sendSetCalendarData({
            month: this.selectedDate.getMonth(),
            year: this.selectedDate.getFullYear(),
          });
          this.loadData(from, to);
        },
      },
    },
    headerToolbar: {
      // left: 'prev,next today',
      // center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    eventDidMount: (info) => {
      if (info.event.extendedProps.description)
        tippy(info.el, {
          content: info.event.extendedProps.description,
          allowHTML: true,
          // arrow: false,
          theme: 'translucent',
        });
    },
  };

  constructor(
    private client: ApiService,
    private token: TokenStorageService,
    private data: DataService,
    private message: NzNotificationService,
    private toast: NzMessageService
  ) {}

  ngOnInit(): void {
    let from = dateToString(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );

    let to = dateToString(
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    );
    if (this.user.role.roleName === 'SupportStaff') {
      this.user = this.token.getDoctor();
    }
    if (this.user?.role?.roleName !== 'Administrator') this.loadData(from, to);
    this.client.getTreatments(this.user.userId).subscribe((res) => {
      res.forEach((t) => {
        this.treatmentList.push(t.nickname);
      });
    });
  }

  calClick(date: any) {
    this.selectedDate = stringToDate(date);

    let from = dateToString(
      new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1)
    );

    let to = dateToString(
      new Date(
        this.selectedDate.getFullYear(),
        this.selectedDate.getMonth() + 1,
        0
      )
    );
    this.loadData(from, to);
  }

  loadAppointments(value: string) {
    this.groupedAppointments = {
      accepcted: [],
      requested: [],
      proposeNew: [],
    };
    this.appointments = [];
    this.tempAppointment.forEach((ap) => {
      let apDate = dateToString(ap.appointmentDate);
      let sDate = dateToString(this.selectedDate);
      if (
        apDate === sDate &&
        ap.status !== 'Rejected' &&
        ap.status !== 'Cancelled'
      ) {
        // &&(ap.status === 'Accepted' || ap.status === 'Confirmed')
        this.appointments.push(ap);
      }
    });
    let events: any[] = [];
    if (value === 'all') {
      this.tempAppointment.forEach((a) => {
        if (a.status !== 'Cancelled' && a.status !== 'Rejected') {
          events.push(this.loadCalendar(a));
        }
      });
      this.appointments.forEach((a) => {
        if (a.status === 'Confirmed' || a.status === 'Accepted') {
          this.groupedAppointments.accepcted.push(a);
        }
        if (a.status === 'Requested') {
          this.groupedAppointments.requested.push(a);
        }
        if (a.status === 'ProposeNew') {
          this.groupedAppointments.proposeNew.push(a);
        }
      });
    } else {
      this.tempAppointment.forEach((a) => {
        if (a.treatmentNickname === value) events.push(this.loadCalendar(a));
      });
      this.appointments.forEach((a) => {
        if (a.treatmentNickname === value) {
          if (a.status === 'Confirmed' || a.status === 'Accepted') {
            this.groupedAppointments.accepcted.push(a);
          }
          if (a.status === 'Requested') {
            this.groupedAppointments.requested.push(a);
          }
          if (a.status === 'ProposeNew') {
            this.groupedAppointments.proposeNew.push(a);
          }
        }
      });
    }
    this.calendarOptions.events = events;
  }

  loadCalendar(a: AppointmentList) {
    let time = addMinute(a.appointmentTime, a.durationMin, true);
    let time12 = addMinute(a.appointmentTime, a.durationMin);
    let date = dateToString(a.appointmentDate);
    return {
      title: a.patientName,
      start: `${date}T${time[0]}`,
      end: `${date}T${time[1]}`,
      backgroundColor:
        a.status === 'Accepted' || a.status === 'Confirmed'
          ? '#18AE00'
          : a.status === 'Requested'
          ? '#FA2B2B'
          : a.status === 'ProposeNew'
          ? '#7E858D'
          : '',
      extendedProps: {
        description: `${a.patientName}<br>Treatment: ${
          a.treatmentNickname
        }<br>${a.symptoms ? 'Symptoms: ' + a.symptoms + '<br>' : ''}Time: ${
          time12[0]
        } - ${time12[1]}<br>Status: ${
          a.status === 'ProposeNew'
            ? 'New time proposed'
            : a.status === 'Requested'
            ? 'Pending'
            : 'Accepted'
        }`,
      },
    };
  }

  loadData(from: string, to: string) {
    this.client
      .getDoctorAppointment(this.user.userId, from, to)
      .subscribe((res) => {
        this.tempAppointment = res.data;
        this.loadAppointments('all');
        this.calendarOptions.events = this.tempAppointment.map((a) => {
          if (a.status !== 'Cancelled' && a.status !== 'Rejected') {
            return this.loadCalendar(a);
          } else return {};
        });
      });
  }
  saveFilter() {
    // console.log(this.filterTreatmentType);
    this.loadAppointments(this.filterTreatmentType);
    this.isOpen = false;
  }

  cancel() {
    this.appointmentId = -1;
    this.notesModal = false;
    this.staffNotes.setValue('');
    this.doctorNotes.setValue('');
    this.richDoctorNotes.setValue('');
    this.richStaffNotes.setValue('');
  }

  public onChange({ editor }: ChangeEvent, notes: string) {
    const data = editor.getData();
    const div = document.createElement('div');
    div.innerHTML = data;
    if (notes === 'doctor') this.doctorNotes.setValue(div.innerText);
    else this.staffNotes.setValue(div.innerText);
  }

  openNotesModal(id: number) {
    const tId = this.toast.loading('Action in progress..', {
      nzDuration: 0,
    }).messageId;
    this.appointmentId = id;
    this.client.getNotes(id).subscribe(
      (res) => {
        console.log(res);
        const div = document.createElement('div');
        div.innerHTML = res.doctorNotes;
        this.doctorNotes.setValue(div.innerText);

        div.innerHTML = res.staffNotes;
        this.staffNotes.setValue(div.innerText);

        this.richDoctorNotes.setValue(res.doctorNotes);
        this.richStaffNotes.setValue(res.staffNotes);
        this.notesModal = true;
        this.toast.remove(tId);
      },
      (err) => this.toast.remove(tId)
    );
  }

  addNotes() {
    this.client
      .addNotes(this.appointmentId, {
        doctorNotes: this.richDoctorNotes.value,
        staffNotes: this.richStaffNotes.value,
      })
      .subscribe((res) => {
        this.cancel();
        this.message.success('Success', 'Notes Added');
      });
  }
}
