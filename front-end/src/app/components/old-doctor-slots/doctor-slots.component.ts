import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { formatDate } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { differenceInCalendarDays } from 'date-fns';

import { ApiService, TokenStorageService } from 'src/app/_services';
import {
  DataService,
  Animate,
  formatTime,
  fromToDate,
  addDate,
  timeStringToDate,
} from 'src/app/_helpers';
import { Appointment, SlotException, Treatment } from '../../_models';

@Component({
  selector: 'app-doctor-slots',
  templateUrl: './doctor-slots.component.html',
  styleUrls: ['./doctor-slots.component.scss'],
  animations: [Animate],
})
export class DoctorSlotsComponent implements OnInit {
  @Output() isTreatment = new EventEmitter();
  @Output() isDateTime = new EventEmitter();

  doctor = this.token.getDoctor();
  user = this.doctor ? this.doctor : this.token.getUser();
  // custom = false;
  slotOption = '';

  startDate = new Date();

  isEndBy = true;
  isEndAfter = false;
  isAcceptNew = true;
  isAutoApprove = false;
  cancellationDays = 1;

  slotDurations = [15, 30, 45, 60];

  entireCalender: FormGroup;
  customCalender: FormGroup;
  isEdit = false;

  customDates: SlotException[] = [];
  treatments: Treatment[] = [];
  formData: Appointment = {
    doctorId: 0,
    isAcceptNew: true,
    isAutoApprove: this.isAutoApprove,
    cancellationPolicyDays: this.cancellationDays,
    treatments: this.treatments,
    dateRange: [],
    slotExeptions: [],
  };
  errors = {
    startDate: false,
    endBy: false,
    endAfter: false,
    endByMessage: 'required',
  };

  disabledStartDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) < 0;

  disabledEndDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date(this.ef.startDate.value)) < 0;

  constructor(
    private fb: FormBuilder,
    private client: ApiService,
    private data: DataService,
    private message: NzNotificationService,
    private modal: NzModalService,
    private token: TokenStorageService
  ) {
    this.loadAppointment();
  }

  ngOnInit(): void {
    this.entireCalender = this.fb.group(
      {
        startDate: [this.startDate, [Validators.required]],
        endDate: [null, [Validators.required]],
        endOccurrence: [1, [Validators.min(1), Validators.max(365)]],
        daysOrWeeks: ['day'],
      },
      {
        validator: [fromToDate('startDate', 'endDate')],
      }
    );
    this.ef.endOccurrence.disable();
    this.customCalender = this.fb.group({
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      durationMinutes: [null, [Validators.required]],
    });
    this.data.receiveDateTimeData().subscribe((data) => {
      this.customDates = data;
    });
    this.data.receiveTreatmentData().subscribe((data) => {
      this.treatments = data;
      // console.log(data);
    });
  }

  loadAppointment() {
    this.client.getAppointment(this.user.userId).subscribe((res) => {
      // console.log(res);
      // this.data.sendAppointmentData(res);
      // if (res) {
      //   this.slotOption = res.slotOption;
      //   this.isEdit = true;
      //   this.treatments = res.treatments;
      //   if (res.slotOption === 'EntireCalendar') {
      //     this.entireCalender.reset();
      //     if (res.dateRange) {
      //       this.ef.startDate.setValue(new Date(`${res.dateRange[0]}T00:00`));
      //       this.ef.endDate.setValue(new Date(`${res.dateRange[1]}T00:00`));
      //     }
      //     this.ef.endOccurrence.setValue(1);
      //     this.ef.daysOrWeeks.setValue('day');
      //     this.isEndBy = true;
      //     this.isEndAfter = false;
      //     this.ef.endOccurrence.disable();
      //     this.ef.endDate.enable();
      //     this.isAcceptNew = res.isAcceptNew;
      //     this.isAutoApprove = res.isAutoApprove;
      //     this.cancellationDays = res.cancellationPolicyDays;
      //   } else if (
      //     res.slotOption === 'CustomDates' &&
      //     res.dateSlots &&
      //     res.dateSlots.length > 0
      //   ) {
      //     this.custom = true;
      //     this.customDates = res.dateSlots;
      //     this.isAcceptNew = res.isAcceptNew;
      //     this.isAutoApprove = res.isAutoApprove;
      //     this.cancellationDays = res.cancellationPolicyDays;
      //     if (res.timeRange) {
      //       this.cf.startTime.setValue(timeStringToDate(res.timeRange[0]));
      //       this.cf.endTime.setValue(timeStringToDate(res.timeRange[1]));
      //     }
      //     this.cf.durationMinutes.setValue(res.durationMinutes);
      //   }
      // }
    });
  }
  get ef(): { [key: string]: AbstractControl } {
    return this.entireCalender.controls;
  }

  get cf(): { [key: string]: AbstractControl } {
    return this.customCalender.controls;
  }

  endDateChange(type: any) {
    if (type == 'endBy') {
      this.isEndAfter = false;
      this.isEndBy = true;
      this.ef.endDate.enable();
      this.ef.endOccurrence.disable();
    } else if (type == 'endAfter') {
      this.isEndAfter = true;
      this.isEndBy = false;
      this.ef.endOccurrence.enable();
      this.ef.endDate.disable();
      this.ef.endDate.reset();
    } else {
      this.isEndBy = false;
      this.isEndAfter = false;
      this.ef.endDate.disable();
      this.ef.endDate.reset();
      this.ef.endOccurrence.disable();
      this.entireCalender.markAsDirty();
    }
  }

  startDateChange() {
    if (this.isEndBy) {
      this.entireCalender.controls['endDate'].setValue(null);
    }
  }

  scheduleChange(custom?: string) {
    if (custom) this.custom = true;
    else this.custom = false;
    // this.data.sendCalendarData({ custom: this.custom });
  }

  checkError() {
    if (this.isEndBy && this.ef.endDate.errors) {
      this.errors.endBy = true;
      this.errors.endAfter = false;
    } else if (this.isEndAfter && this.ef.endOccurrence.errors) {
      this.errors.endAfter = true;
      this.errors.endBy = false;
    } else {
      this.errors.endBy = false;
      this.errors.endAfter = false;
    }

    if (this.entireCalender.hasError('startEndDate')) {
      this.errors.endBy = true;
      this.errors.endByMessage = 'End date must greater than start date';
    }
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
        'By pressing Confirm and Publish, your Calendar will be published and will be visible on the SalusConnect platform. All previously saved calendar availability information will be updated with your latest selection.',
      nzOnOk: () => {
        this.submit();
      },
      nzOkText: 'Confirm and Publish',
      nzCancelText: 'Close',
    });
  }

  submit() {
    this.checkError();
    // if (
    //   !this.custom &&
    //   this.entireCalender.valid &&
    //   !this.entireCalender.hasError('startEndDate')
    // ) {
    // if (this.isEndAfter) {
    //   console.log(this.ef.daysOrWeeks.value);
    //   this.ef.endDate.setValue(
    //     addDate(
    //       this.ef.startDate.value,
    //       this.ef.endOccurrence.value,
    //       this.ef.daysOrWeeks.value
    //     )
    //   );
    // }
    // if (!this.isEndAfter && !this.isEndBy) {
    //   this.ef.endDate.setValue(addDate(this.ef.startDate.value, 365, 'day'));
    // }
    // this.formData.dateRange = [];
    // this.formData.dateRange[0] = formatDate(
    //   this.ef.startDate.value,
    //   'yyyy-MM-dd',
    //   'en'
    // );
    // this.formData.dateRange[1] = formatDate(
    //   this.ef.endDate.value,
    //   'yyyy-MM-dd',
    //   'en'
    // );
    //   this.formData.slotOption = 'EntireCalendar';
    //   this.formData.doctorId = this.user.userId;
    //   this.formData.isAcceptNew = this.isAcceptNew;
    //   this.formData.isAutoApprove = this.isAutoApprove;
    //   this.formData.treatments = this.treatments;
    //   this.formData.cancellationPolicyDays = this.cancellationDays;
    //   console.log(this.formData);
    //   if (this.isEdit) this.editAppointment();
    //   else this.addAppointment();
    // } else if (this.custom) {
    //   // this.nextDate();
    //   this.formData.slotOption = 'CustomDates';
    //   this.formData.doctorId = this.user.userId;
    //   this.formData.isAcceptNew = this.isAcceptNew;
    //   this.formData.isAutoApprove = this.isAutoApprove;
    //   this.formData.timeRange = [];
    //   this.formData.timeRange[0] = formatTime(this.cf.startTime.value);
    //   this.formData.timeRange[1] = formatTime(this.cf.endTime.value);
    //   this.formData.dateSlots = this.customDates;
    //   this.formData.durationMinutes = this.cf.durationMinutes.value;
    //   this.formData.treatments = this.treatments;
    //   this.formData.cancellationPolicyDays = this.cancellationDays;
    //   console.log(this.formData);
    //   if (this.isEdit) this.editAppointment();
    //   else this.addAppointment();
    // }
  }
}
