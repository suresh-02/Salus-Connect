import { formatDate } from '@angular/common';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Appointment } from 'src/app/_models';
import { ApiService, TokenStorageService } from 'src/app/_services';
import { differenceInCalendarDays } from 'date-fns';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  Animate,
  stringToDate,
  DataService,
  fromToDate,
  addDate,
} from 'src/app/_helpers';

@Component({
  selector: 'app-doctor-slots',
  templateUrl: './doctor-slots.component.html',
  styleUrls: ['./doctor-slots.component.scss'],
  animations: [Animate],
})
export class DoctorSlotsComponent implements OnInit {
  @Output() isTreatment = new EventEmitter();
  @Output() isDateTime = new EventEmitter();
  @Output() isChanged = new EventEmitter<boolean>();

  doctor = this.token.getDoctor();
  user = this.doctor ? this.doctor : this.token.getUser();

  form: FormGroup;

  isEndBy = true;
  isEndAfter = false;

  disabledStartDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) < 0;

  disabledEndDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date(this.f.startDate.value)) < 0;

  isEdit = false;
  formData: Appointment = {
    doctorId: this.user.userId,
    cancellationPolicyDays: 0,
    dateRange: [],
    slotExceptions: [],
    treatments: [],
  };

  constructor(
    private fb: FormBuilder,
    private client: ApiService,
    private token: TokenStorageService,
    private data: DataService,
    private message: NzNotificationService,
    private modal: NzModalService
  ) {
    this.form = fb.group(
      {
        startDate: [new Date(), [Validators.required]],
        endDate: [null, [Validators.required]],
        endOccurrence: [1, [Validators.min(1), Validators.max(365)]],
        daysOrWeeks: ['day'],
        cancellationPolicyDays: [1, [Validators.required]],
        slotExceptions: [],
        treatments: [],
      },
      {
        validator: [fromToDate('startDate', 'endDate')],
      }
    );
    this.f.endOccurrence.disable();
    this.form.valueChanges.subscribe((value) => {
      this.isChanged.emit(this.form.dirty);
    });
  }

  ngOnInit(): void {
    this.loadAppointment();
    this.data.receiveDateTimeData().subscribe((data) => {
      // this.exceptionDates = data;
      this.f.slotExceptions.setValue(data);
      this.isChanged.emit(true);
    });
    this.data.receiveTreatmentData().subscribe((data) => {
      // this.treatments = data;
      this.f.treatments.setValue(data);
      this.isChanged.emit(true);
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  loadAppointment() {
    this.client.getAppointment(this.user.userId).subscribe((res) => {
      if (res) {
        console.log(res);
        this.isEdit = true;
        this.f.cancellationPolicyDays.setValue(res.cancellationPolicyDays);
        this.f.treatments.setValue(res.treatments);
        this.f.slotExceptions.setValue(res.slotExceptions);
        if(res.dateRange){
          this.f.startDate.setValue(stringToDate(res.dateRange[0]));
          this.f.endDate.setValue(stringToDate(res.dateRange[1]));
        }
        this.isChanged.emit(false);
      }
    });
  }

  endDateChange(type: any) {
    if (type == 'endBy') {
      this.isEndAfter = false;
      this.isEndBy = true;
      this.f.endDate.enable();
      this.f.endOccurrence.disable();
    } else if (type == 'endAfter') {
      this.isEndAfter = true;
      this.isEndBy = false;
      this.f.endOccurrence.enable();
      this.f.endDate.disable();
      this.f.endDate.reset();
    } else {
      this.isEndBy = false;
      this.isEndAfter = false;
      this.f.endDate.disable();
      this.f.endDate.reset();
      this.f.endOccurrence.disable();
      this.form.markAsDirty();
      this.createFormData();
    }
  }

  startDateChange() {
    if (this.isEndBy) {
      this.form.controls['endDate'].setValue(null);
    }
    this.createFormData();
  }

  addAppointment() {
    this.client
      .postAppointment(this.user.userId, this.formData)
      .subscribe((res) => {
        // console.log(res);
        this.loadAppointment();
        this.message.success(
          'Success',
          'Calendar schedule updated successfully'
        );
      });
  }

  editAppointment() {
    this.client
      .putAppointment(this.user.userId, this.formData)
      .subscribe((res) => {
        // console.log(res);
        this.loadAppointment();
        this.message.success(
          'Success',
          'Calendar schedule updated successfully'
        );
      });
  }

  confirmAppointment() {
    this.modal.confirm({
      nzTitle: 'Confirm and Publish',
      nzContent:
        'By pressing Confirm and Publish, your Calendar will be published and will be visible on the SimplyDoc platform. All previously saved calendar availability information will be updated with your latest selection.',
      nzOnOk: () => {
        this.submit();
      },
      nzOkText: 'Confirm and Publish',
      nzCancelText: 'Close',
    });
  }

  createFormData() {
    this.formData.doctorId = this.user.userId;
    this.formData.cancellationPolicyDays = this.f.cancellationPolicyDays.value;
    this.formData.dateRange[0] = formatDate(
      this.f.startDate.value,
      'yyyy-MM-dd',
      'en'
    );
    if (this.isEndAfter) {
      this.formData.dateRange[1] = addDate(
        this.f.startDate.value,
        this.f.endOccurrence.value,
        this.f.daysOrWeeks.value
      );
    } else if (!this.isEndAfter && !this.isEndBy) {
      this.formData.dateRange[1] = addDate(this.f.startDate.value, 365, 'day');
    } else
      this.formData.dateRange[1] = formatDate(
        this.f.endDate.value,
        'yyyy-MM-dd',
        'en'
      );

    this.formData.slotExceptions = this.f.slotExceptions.value;
    this.formData.treatments = this.f.treatments.value;
    this.data.sendAppointmentData(this.formData);
  }

  submit() {
    this.createFormData();
    // console.log(this.formData);
    if (this.isEdit) this.editAppointment();
    else this.addAppointment();
  }
}
