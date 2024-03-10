import { NzTableQueryParams } from 'ng-zorro-antd/table';
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import {
  Treatment,
  AppointmentByPhone,
} from './../../_models/appointment.model';
import { Slot } from './../../_models/doctor.model';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { formatDate } from '@angular/common';
import { ApiService, TokenStorageService } from 'src/app/_services';
import { Component, OnInit } from '@angular/core';
import { AppointmentList } from 'src/app/_models';
import { addMinute, amOrPm } from 'src/app/_helpers';
import * as moment from 'moment';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit {
  public Editor = ClassicEditor;

  filterStatus = [
    { text: 'All', value: '' },
    { text: 'Requested', value: 'Requested' },
    { text: 'Accepted', value: 'Accepted' },
    { text: 'Rejected', value: 'Rejected' },
    { text: 'New Time Proposed', value: 'ProposeNew' },
    { text: 'Confirmed', value: 'Confirmed' },
    { text: 'Cancelled', value: 'Cancelled' },
  ];

  addMinute = addMinute;
  formatDate = formatDate;
  appointments: AppointmentList[];
  user = this.token.getUser();
  doctor = this.token.getDoctor();

  phoneAppointmentForm: FormGroup;

  loading = false;
  status: string[] = [];

  modalTitle = '';
  FPModal = false;
  notesModal = false;
  phoneModal = false;
  treatmentLoad = false;

  mark: string[] = [];
  today = new Date();

  richDoctorNotes = new FormControl('');
  doctorNotes = new FormControl(''); // , [Validators.maxLength(4000)]

  dateRange: Date[] = [this.today, moment(this.today).add(29, 'days').toDate()];

  treatments: Treatment[];
  doctorSlots: Slot[];
  includedDates: string[] = [];
  availableSlots: any[];
  selectedSlot: string;
  isSeeMore = false;
  disabledDate = (current: Date): boolean => {
    return !this.includedDates.includes(
      formatDate(current, 'yyyy-MM-dd', 'en')
    );
  };

  // disabledStartDate = (current: Date): boolean =>
  //   differenceInCalendarDays(current, new Date()) < 0;

  appointmentId: number;

  billedAmount: number[] = [];
  formatterDollar = (value: number): string => `C$ ${value}`;
  parserDollar = (value: string): string => value.replace('C$ ', '');

  searchDebounce: any;

  total: number;
  pageSize = 10;
  pageIndex = 1;
  statusFilter: string = '';
  sortField = '';
  sortDirection = '';
  _search = '';

  public get search(): string {
    return this._search;
  }

  public set search(v: string) {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this._search = v;
      this.loadData();
    }, 300);
  }

  private _selectedDate: Date;
  get selectedDate() {
    return this._selectedDate;
  }
  set selectedDate(date: any) {
    this._selectedDate = date;
    this.selectedSlot = '';
    if (date) {
      this.refreshSlots();
    }
  }

  private _selectedTreatment: number;
  get selectedTreatment() {
    return this._selectedTreatment;
  }
  set selectedTreatment(treatment: number) {
    this._selectedTreatment = treatment;
    this.includedDates = [];
    this.doctorSlots = [];
    this.selectedSlot = '';
    if (treatment) this.selectTreatment(treatment);
  }

  constructor(
    private fb: FormBuilder,
    private client: ApiService,
    private token: TokenStorageService,
    private toast: NzMessageService,
    private message: NzNotificationService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    if (this.user.role.roleName === 'SupportStaff') {
      this.user = this.token.getDoctor();
    }
    this.phoneAppointmentForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phoneNumber: [
        null,
        [
          //Validators.required,
          Validators.pattern('^[0-9,-]*$'),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      symptoms: ['', [Validators.maxLength(255)]],
      emailConsent: false,
    });
    // this.loadData();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '';
    let sortOrder = (currentSort && currentSort.value) || '';
    sortOrder =
      sortOrder === 'ascend' ? 'asc' : sortOrder === 'descend' ? 'desc' : '';

    // this.statusFilter = filter[0].value;

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.sortField = sortField;
    this.sortDirection = sortOrder;
    this.loadData();
  }

  loadData() {
    this.loading = true;
    if (this.dateRange.length === 2) {
      let from = formatDate(this.dateRange[0], 'yyyy-MM-dd', 'en');
      let to = formatDate(this.dateRange[1], 'yyyy-MM-dd', 'en');
      this.client
        .getDoctorAppointmentPagination(this.user.userId, from, to, {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          sortField: this.sortField,
          sortDirection: this.sortDirection,
          search: this.search,
          status: this.statusFilter,
        })
        .subscribe((res) => {
          this.loading = false;
          this.appointments = res.data;
          this.total = res.rows;
          // this.client.markAsRead(this.user.userId, 'doctors');
        });
    }
  }

  trackByFunction = (index: number, apppointment: AppointmentList) => {
    return apppointment.appointmentId;
  };

  submitStatus(id: number, statusIndex: number) {
    let data = {
      appointmentId: id,
      appointmentStatus: this.status[statusIndex],
      notifyParty: 'Patient',
    };
    const tId = this.toast.loading('Action in progress..', {
      nzDuration: 0,
    }).messageId;
    this.client.appointmentStatus(id, data).subscribe(
      (res) => {
        this.loadData();
        this.toast.remove(tId);
        this.status[statusIndex] = '';
      },
      (err) => {
        this.toast.remove(tId);
      }
    );
  }

  refreshSlots() {
    let slots = this.doctorSlots.filter(
      (s) =>
        s.date === formatDate(new Date(this.selectedDate), 'yyyy-MM-dd', 'en')
    )[0].times;
    this.availableSlots = slots.map((s) => amOrPm(s));
  }

  selectTreatment(tid: number | any) {
    if (tid >= 0) {
      this.treatmentLoad = true;
      this.client
        .searchTreatmentSlot(this.user.userId, tid)
        .subscribe((res) => {
          this.doctorSlots = res;
          res.map((slot) => {
            this.includedDates.push(slot.date);
          });
          if (this.modalTitle) {
            this.FPModal = true;
          }
          if (this.selectedDate) this.refreshSlots();
          this.treatmentLoad = false;
        });
    }
  }

  openFPModal(id: number, title: string, tid: number) {
    this.modalTitle = title;
    this.appointmentId = id;
    this.selectedDate = null;
    this.includedDates = [];
    this.doctorSlots = [];
    if (title === 'Follow Up') {
      this.client.getTreatments(this.user.userId).subscribe((res) => {
        this.treatments = res;
      });
    }
    this.selectedTreatment = tid;
  }

  openNotesModal(id: number, dn: any) {
    this.notesModal = !this.notesModal;
    this.appointmentId = id;
    if (dn) {
      const div = document.createElement('div');
      div.innerHTML = dn;
      this.doctorNotes.setValue(div.innerText);
      this.richDoctorNotes.setValue(dn);
    }
  }

  openPhoneModal() {
    this.client.getTreatments(this.user.userId).subscribe((res) => {
      this.treatments = res;
      this.phoneModal = true;
    });
  }

  cancel() {
    this.status = [];
    this.phoneModal = false;
    this.FPModal = false;
    this.notesModal = false;
    this.appointmentId = -1;
    this.selectedTreatment = -1;
    this.selectedDate = null;
    this.selectedSlot = '';
    this.includedDates = [];
    this.availableSlots = [];
    this.modalTitle = '';
    this.doctorNotes.setValue('');
    this.richDoctorNotes.setValue('');
    this.phoneAppointmentForm.reset();
    this.phoneAppointmentForm.controls['emailConsent'].setValue(false);
  }

  proposeNewTime() {
    let data = {
      appointmentId: this.appointmentId,
      appointmentStatus: 'ProposeNew',
      notifyParty: 'Patient',
      newAppointmentTime: '',
    };
    let date = `${formatDate(this.selectedDate, 'yyyy-MM-dd', 'en')} ${
      this.selectedSlot
    }`;
    data.newAppointmentTime = date;
    const tId = this.toast.loading('Action in progress..', {
      nzDuration: 0,
    }).messageId;
    this.client.appointmentStatus(this.appointmentId, data).subscribe(
      (res) => {
        console.log(res);
        this.cancel();
        this.loadData();
        this.toast.remove(tId);
      },
      (err) => {
        this.toast.remove(tId);
      }
    );
  }

  followUp() {
    let data = {
      appointmentId: this.appointmentId,
      appointmentDate: '',
      appointmentTime: this.selectedSlot,
      treatmentId: this.selectedTreatment,
    };
    let date = formatDate(this.selectedDate, 'yyyy-MM-dd', 'en');
    data.appointmentDate = date;
    console.log(data);
    const tId = this.toast.loading('Action in progress..', {
      nzDuration: 0,
    }).messageId;
    this.client.followup(data).subscribe(
      (res) => {
        this.loadData();
        this.cancel();
        this.toast.remove(tId);
      },
      (err) => {
        this.toast.remove(tId);
      }
    );
  }

  appointmentByPhone() {
    let data: AppointmentByPhone;
    let formData = this.phoneAppointmentForm.value;
    data = { ...formData };
    data.treatmentId = this.selectedTreatment;
    data.appointmentDate = formatDate(this.selectedDate, 'yyyy-MM-dd', 'en');
    data.appointmentTime = this.selectedSlot;
    const tId = this.toast.loading('Action in progress..', {
      nzDuration: 0,
    }).messageId;
    console.log(data);
    this.client.requestAppointmentByPhone(this.user.userId, data).subscribe(
      (res) => {
        this.message.success('Success', 'Appointment added successfully');
        this.cancel();
        this.loadData();
        this.toast.remove(tId);
      },
      (err) => {
        this.toast.remove(tId);
      }
    );
  }

  markAsComplete(status: any, id: number) {
    this.client.markAsComplete(id, status).subscribe((res) => {
      this.message.success(
        'Success',
        status === 'Complete'
          ? 'This appointment is Marked Complete.'
          : 'This appointment is marked as a No Show.'
      );
      this.loadData();
    });
  }

  changeStatus(id: number, statusIndex: number) {
    this.FPModal = false;
    this.modal.confirm({
      nzTitle: 'Are you sure want to change the status?',
      nzOkText: 'Yes',
      nzOnOk: () => this.submitStatus(id, statusIndex),
      nzCancelText: 'No',
      nzOnCancel: () => (this.status[statusIndex] = ''),
    });
  }

  public onChange({ editor }: ChangeEvent, notes: string) {
    const data = editor.getData();
    const div = document.createElement('div');
    div.innerHTML = data;
    if (notes === 'doctor') this.doctorNotes.setValue(div.innerText);
  }

  addNotes() {
    this.client
      .addNotes(this.appointmentId, {
        doctorNotes: this.richDoctorNotes.value,
      })
      .subscribe((res) => {
        this.message.success('Success', 'Notes Added');
        this.cancel();
        this.loadData();
      });
  }

  addBilledAmount(id: number, index: number) {
    if (this.billedAmount[index] > 0)
      this.client
        .addBilledAmount(id, {
          billedAmount: this.billedAmount[index],
        })
        .subscribe((res) => {
          this.message.success('Success', 'Billed Amount saved successfully');
          this.cancel();
        });
  }
}
