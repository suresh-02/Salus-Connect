import { ApiService } from 'src/app/_services';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ErrorChecker, Animate, SafeData, DataService } from 'src/app/_helpers';

import {
  Doctor,
  Error,
  Facility,
} from 'src/app/_models';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-hospital-form',
  templateUrl: './hospital-edit.component.html',
  styleUrls: ['./hospital-edit.component.scss'],
  animations: [Animate],
})
export class HospitalEditComponent implements OnInit, SafeData {
  @Input('viewId') viewId: number = -1;
  id: number = -1;
  type: any = this.route.routeConfig?.path;
  hospitalForm: FormGroup;
  hospitalAddress: FormGroup;
  doctorForm: FormGroup;
  doctorsData: any[] = [];

  isAddressForm = true;
  isHeader = true;

  formType = 'hospital';
  prevTooltip = 'Hospital details';
  nextTooltip = 'Add doctors';
  text = '';
  hospital: string;

  facilityName: Error = { name: 'facilityName', label: this.text };
  authToken = localStorage.getItem('token');

  loading = false;

  constructor(
    private fb: FormBuilder,
    private client: ApiService,
    private router: Router,
    public route: ActivatedRoute,
    private data: DataService,
    private message: NzNotificationService
  ) {
    this.data.fromChild({ isAddressForm: !this.isAddressForm });
    this.data.receiveFromParent().subscribe((data) => {
      this.id = data.id;
      this.type = data.registerType;
    });
  }

  ngOnInit(): void {
    this.hospitalForm = this.fb.group({
      facilityName: [null, [Validators.required]],
    });

    this.hospitalAddress = this.fb.group({
      addressId: null,
      addressLine1: [null, [Validators.required]],
      addressLine2: '',
      city: ['', [Validators.required]],
      stateAbbr: ['', [Validators.required]],
    });
    this.doctorForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.minLength(3)]],
      lastName: [null, [Validators.required, Validators.minLength(3)]],
      middleName: '',
      phoneNumber: [
        null,
        [
          Validators.required,
          Validators.pattern('^[0-9,-]*$'),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      emailAddress: [null, [Validators.required, Validators.email]],
      biography: [null, [Validators.required, Validators.maxLength(4000)]],
      richBio: [null, [Validators.required]],
      tags: [null, [Validators.required]],
      specialty: ['', [Validators.required]],
      isBackgroundCheck: [false, [Validators.required]],
      other: [''],
    });
    this.text = this.type + ' Name';

    if (this.id !== -1) {
      this.loadData(this.id);
    }
    if (this.viewId != -1) {
      this.loadData(this.viewId);
      this.hospitalForm.disable();
      this.hospitalAddress.disable();
    }
    this.facilityName.label = this.text;
  }

  checkAuth: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let docs = group.get('authDoctors')?.value;
    return group.get('platformUsage')?.value === 'FullAccess'
      ? docs?.length > 0
        ? null
        : { auth: true }
      : null;
  };

  loadData(id: number) {
    this.loading = true;
    this.client.getFacility(id).subscribe((res) => {
      this.hf.facilityName.setValue(res.facilityName);
      this.af.addressId.setValue(res.address.addressId);
      this.af.addressLine1.setValue(res.address.addressLine1);
      this.af.addressLine2.setValue(res.address.addressLine2);
      this.doctorsData = res.doctors;
      this.af.city.setValue(res.address.city);
      this.af.stateAbbr.setValue(res.address.stateAbbr);
      this.loading = false;
    });
  }

  get hf(): { [key: string]: AbstractControl } {
    return this.hospitalForm.controls;
  }
  get af(): { [key: string]: AbstractControl } {
    return this.hospitalAddress.controls;
  }
  isDataSaved() {
    return (
      this.hospitalForm.dirty ||
      this.hospitalAddress.dirty ||
      this.doctorForm.dirty
    );
  }

  checkError = (element: Error) => {
    element = ErrorChecker(element, this.hospitalForm);
  };

  submit() {
    this.type = this.route.routeConfig?.path;
    this.type =
      this.type[0].toUpperCase() + this.type.slice(1, this.type.length);
    let formData: Facility;
    this.doctorsData.forEach((d: Doctor) => {
      d.firstName = d.firstName.trim();
      d.lastName = d.lastName.trim();
      d.biography = d.biography.trim();
    });
    console.log(this.doctorsData);
    formData = {
      ...this.hospitalForm.value,
      address: this.hospitalAddress.value,
      doctors: this.doctorsData,
      facilityType: this.type,
    };
    formData.facilityName = formData.facilityName.trim();
    formData.address.addressLine1 = formData.address.addressLine1.trim();
    formData.address.addressLine2 = formData.address.addressLine2?.trim();

    if (this.id !== -1) {
      formData.facilityId = this.id;
      this.loading = true;
      this.client.putFacility(this.id, formData).subscribe(
        (res) => {
          // console.log(res);
          this.loading = false;
          this.message.success(
            'Success',
            `${this.type} info successfully updated`
          );
          this.hospitalForm.reset();
          this.doctorForm.reset();
          this.hospitalAddress.reset();
          this.router.navigate(['/provider/listing']);
        },
        () => {
          this.loading = false;
        }
      );
      console.log(formData);
    } else {
      console.log(formData);
      this.loading = true;
      this.client.postFacility(formData).subscribe(
        (res) => {
          // console.log(res);
          this.loading = false;
          this.message.success(
            'Success',
            `${this.type} info successfully added`
          );
          this.hospitalForm.reset();
          this.doctorForm.reset();
          this.hospitalAddress.reset();
          this.router.navigate(['/provider/listing']);
        },
        () => {
          this.loading = false;
        }
      );
    }
  }

  setTooltip() {
    if (this.formType === 'hospital') {
      this.nextTooltip = 'Add doctors';
    } else{
      this.prevTooltip = 'Hospital details';
    }
  }

  continue() {
    if (this.formType === 'hospital') {
      this.formType = 'doctor';
      this.isAddressForm = false;
      this.isHeader = false;
    }
    this.setTooltip();
    this.hospital = this.hospitalForm.controls['facilityName'].value;
    this.data.fromChild({
      isAddressForm: !this.isAddressForm,
      isHeader: !this.isHeader,
    });
  }

  previous() {
    if (this.formType === 'doctor') {
      this.formType = 'hospital';
      if (this.id !== -1) this.isAddressForm = false;
      else this.isAddressForm = true;
      this.isHeader = true;
    }
    this.setTooltip();
    this.data.fromChild({
      isAddressForm: !this.isAddressForm,
      isHeader: !this.isHeader,
    });
  }
}
