import { Observable } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { formatTime, DataService, treatmentDaysError } from 'src/app/_helpers';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import * as moment from 'moment';
import { Treatment } from 'src/app/_models';
import { NzTabsCanDeactivateFn } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-treatment',
  templateUrl: './treatment.component.html',
  styleUrls: ['./treatment.component.scss'],
})
export class TreatmentComponent implements OnInit {
  @Output() isSlot = new EventEmitter<boolean>();

  @Input() treatments: Treatment[] = [];

  _selectedTreatment = -1;
  defaultTreatment = -1;

  public get selectedTreatment(): number {
    return this._selectedTreatment;
  }

  public set selectedTreatment(v: number) {
    this._selectedTreatment = v;
    // console.log(this.treatments);
    // console.log(this._selectedTreatment);
    this.treatmentDays.forEach((td) => {
      td.checked = false;
    });
    this.treatmentForm.reset();
    this.tf.treatmentDays.setValue(this.treatmentDays);
    if (v >= 0) {
      let t = this.treatments[v];
      this.tf.nickname.setValue(t.nickname);
      this.tf.treatmentType.setValue(t.treatmentType);
      this.tf.description.setValue(t.description);
      this.tf.startTime.setValue(moment(t.timeRange[0], 'hh:mm a').toDate());
      this.tf.endTime.setValue(moment(t.timeRange[1], 'hh:mm a').toDate());
      this.tf.durationMinutes.setValue(t.durationMinutes);
      this.tf.excludeHolidays.setValue(t.excludeHolidays);
      this.tf.insuranceCoverage.setValue(t.insuranceCoverage);
      this.tf.isDefault.setValue(t.isDefault);
      if (t.feePerVisit) {
        this.tf.feePerVisit.setValue('amount');
        this.tf.feeAmount.setValue(t.feePerVisit);
        this.tf.feeAmount.enable();
      } else this.tf.feePerVisit.setValue('varies');
      if (t.breakMinutes) {
        this.tf.breakMinutes.setValue(t.breakMinutes);
        this.tf.breakMinutes.enable();
        this.tf.isBreak.setValue(true);
      }
      this.treatmentDays.forEach((td) => {
        if (t.treatmentDays.includes(td.value)) td.checked = true;
      });
    } else {
      this.tf.breakMinutes.disable();
      this.tf.feeAmount.disable();
    }
  }

  treatmentForm: FormGroup;

  slotDuration: string;
  slotDurations = [
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '1 hr', value: 60 },
    { label: '1h 15min', value: 75 },
    { label: '1h 30min', value: 90 },
    { label: '1h 45min', value: 105 },
    { label: '2 hrs', value: 120 },
  ];

  isBreak: boolean;
  breakDurations = [
    { label: '5 min', value: 5 },
    { label: '10 min', value: 10 },
    { label: '15 min', value: 15 },
    { label: '20 min', value: 20 },
    { label: '25 min', value: 25 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '1 hr', value: 60 },
  ];

  treatmentDays: { label: string; value: number; checked?: boolean }[] = [
    { label: 'Mondays', value: 1 },
    { label: 'Tuesdays', value: 2 },
    { label: 'Wednesdays', value: 3 },
    { label: 'Thursdays', value: 4 },
    { label: 'Fridays', value: 5 },
    { label: 'Saturdays', value: 6 },
    { label: 'Sundays', value: 7 },
  ];

  insuranceCoverage: string;
  insuranceCoverages = ['Full', 'Partial', 'None'];

  canDeactivate: NzTabsCanDeactivateFn = (
    fromIndex: number,
    toIndex: number
  ) => {
    switch (fromIndex) {
      default:
        if (this.treatmentForm.dirty) {
          return new Observable((observer) => {
            this.modal.confirm({
              nzTitle: 'Unsaved Changes',
              nzOkText: 'Yes',
              nzCancelText: 'No',
              nzContent:
                'You have unsaved changes. Are you sure you want to leave this page?',
              nzOnOk: () => {
                this.selectedTreatment = toIndex - 1;
                if (this.treatments[this.defaultTreatment]) {
                  this.tf.isDefault.setValue(true);
                  this.treatments[this.defaultTreatment].isDefault = true;
                  this.treatmentForm.markAsPristine();
                }
                observer.next(true);
                observer.complete();
              },
              nzOnCancel: () => {
                observer.next(false);
                observer.complete();
              },
            });
          });
        } else {
          this.selectedTreatment = toIndex - 1;
          return true;
        }
    }
  };

  isDaysValid = () => {
    let isValid = false;
    this.treatmentDays.forEach((d) => {
      if (d.checked) {
        isValid = true;
      }
    });
    return isValid;
  };

  getDefaultTreatmentId = () => {
    let isDefault = -1;
    this.treatments.forEach((t, index) => {
      if (t.isDefault) {
        isDefault = index;
      }
    });
    return isDefault;
  };

  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private message: NzNotificationService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.treatmentForm = this.fb.group(
      {
        nickname: [null, [Validators.required, Validators.maxLength(15)]],
        treatmentType: [null, [Validators.required, Validators.maxLength(25)]],
        description: ['', [Validators.required, Validators.maxLength(300)]],
        startTime: [null, [Validators.required]],
        endTime: [null, [Validators.required]],
        durationMinutes: [null, [Validators.required]],
        breakMinutes: [null, [Validators.required]],
        treatmentDays: [null, [Validators.required]],
        excludeHolidays: false,
        insuranceCoverage: [null, [Validators.required]],
        feePerVisit: [null, [Validators.required]],
        isDefault: [false, [Validators.required]],
        isBreak: false,
        feeAmount: [null, [Validators.required]],
      },
      {
        validator: [treatmentDaysError(this.treatmentDays)],
      }
    );
    this.tf.breakMinutes.disable();
    this.tf.feeAmount.disable();
    this.tf.treatmentDays.setValue(this.treatmentDays);
  }

  get tf(): { [key: string]: AbstractControl } {
    return this.treatmentForm.controls;
  }

  enableBreakOrFees(enable: string) {
    if (enable === 'fees') {
      if (this.tf.feePerVisit.value === 'amount') this.tf.feeAmount.enable();
      else this.tf.feeAmount.disable();
    }
    if (enable === 'break') {
      if (this.tf.isBreak.value === true) this.tf.breakMinutes.enable();
      else this.tf.breakMinutes.disable();
    }
  }

  onDefaultChange() {
    let treatmentId = this.getDefaultTreatmentId();
    this.defaultTreatment = treatmentId; //this.isTreatmentDefault();
    if (treatmentId >= 0 && treatmentId !== this.selectedTreatment) {
      let t = this.treatments[treatmentId];
      this.modal.confirm({
        nzTitle: `${t?.nickname} is a default treatment. Do yo want to make ${
          this.treatments[this.selectedTreatment]?.nickname
        } as a default treatment?`,
        nzOnOk: () => {
          t.isDefault = false;
          this.tf.isDefault.setValue(true);
        },
        nzOnCancel: () => {
          if (treatmentId === this.selectedTreatment)
            this.tf.isDefault.setValue(t.isDefault);
          else this.tf.isDefault.setValue(false);
        },
      });
    }
  }

  submit() {
    let data: Treatment = {
      nickname: '',
      treatmentType: '',
      description: '',
      durationMinutes: 0,
      timeRange: [],
      treatmentDays: [],
      excludeHolidays: false,
      insuranceCoverage: '',
      feePerVisit: 0,
      isDefault: false,
      breakMinutes: 0,
    };

    let timeRange = [];
    timeRange.push(formatTime(this.tf.startTime.value));
    timeRange.push(formatTime(this.tf.endTime.value));

    let treatmentDays: number[] = [];
    this.treatmentDays.forEach((t) => {
      if (t.checked) treatmentDays.push(t.value);
    });

    data.nickname = this.tf.nickname.value;
    data.treatmentType = this.tf.treatmentType.value;
    data.description = this.tf.description.value;
    data.durationMinutes = this.tf.durationMinutes.value;
    data.timeRange = timeRange;
    data.treatmentDays = treatmentDays;
    data.excludeHolidays = this.tf.excludeHolidays.value;
    data.insuranceCoverage = this.tf.insuranceCoverage.value;
    data.isDefault = this.tf.isDefault.value;
    if (!this.tf.isBreak.value) data.breakMinutes = 0;
    else {
      data.breakMinutes = this.tf.breakMinutes.value;
      data.isBreak = true;
      this.tf.isBreak.setValue(true);
    }
    if (this.tf.feePerVisit.value === 'amount')
      data.feePerVisit = this.tf.feeAmount.value;
    else data.feePerVisit = null;
    console.log(data);
    if (this.selectedTreatment === -1) {
      this.treatments.push(data);
      this.message.success('Success', 'Treatment added successfully');
      this.treatmentForm.reset();
    } else {
      data.treatmentId = this.treatments[this.selectedTreatment].treatmentId;
      this.treatments[this.selectedTreatment] = data;
      this.message.success('Success', 'Treatment saved successfully');
    }
    this.treatmentDays = [...this.treatmentDays];
    this.treatmentForm.markAsPristine();
  }
  exit() {
    if (this.treatmentForm.dirty) {
      this.modal.confirm({
        nzTitle: 'Unsaved Changes',
        nzOkText: 'Yes',
        nzCancelText: 'No',
        nzContent:
          'You have unsaved changes. Are you sure you want to leave this page?',
        nzOnOk: () => {
          this.isSlot.emit(false);
          this.data.sendTreatmentData(this.treatments);
        },
      });
    } else {
      this.isSlot.emit(false);
      this.data.sendTreatmentData(this.treatments);
    }
  }
  deletetreatment() {
    this.modal.confirm({
      nzTitle: 'Are you sure, you want to delete this treatment?',
      nzOnOk: () => {
        this.treatments = this.treatments.filter(
          (t, id) => id !== this.selectedTreatment
        );
        this.selectedTreatment = -1;
        this.treatmentForm.reset();
      },
    });
  }
}
