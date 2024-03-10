import { ApiService } from 'src/app/_services';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
  FormArray,
} from '@angular/forms';

import { Animate, InOut, SafeData, DataService } from 'src/app/_helpers';
import { Doctor} from 'src/app/_models';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-individual-edit',
  templateUrl: './individual-edit.component.html',
  styleUrls: ['./individual-edit.component.scss'],
  animations: [Animate, InOut],
})
export class IndividualEditComponent implements OnInit, SafeData {
  @Input('viewId') viewId: number;
  id = -1;
  individualForm: FormGroup;
  individualAddress: FormGroup;
  isAddressForm = false;

  doctor: Doctor;
  specialty: any;
  dropDownItems: string[] = [];
  fullName = '';
  isDropdown = false;
  authToken = localStorage.getItem('token');
  loading = false;

  formType = 'doctor';

  constructor(
    private fb: FormBuilder,
    private client: ApiService,
    private router: Router,
    private data: DataService,
    private message: NzNotificationService
  ) {
    this.data.fromChild({ isAddressForm: this.isAddressForm });
    this.data.receiveFromParent().subscribe((data) => {
      this.id = data.id;
    });
  }

  ngOnInit(): void {
    this.individualForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.minLength(2)]],
      lastName: [null, [Validators.required, Validators.minLength(2)]],
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
      isBackgroundCheck: [false],
      other: [''],
    });
    this.individualAddress = this.fb.group({
      addressId: null,
      addressLine1: [null, [Validators.required]],
      addressLine2: [''],
      city: ['', [Validators.required]],
      stateAbbr: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
    });
    if (this.id !== -1) this.loadData(this.id);

    if (this.viewId) {
      this.loadData(this.viewId);
      this.individualForm.disable();
      this.individualAddress.disable();
    }
  }

  loadData(id: number) {
    this.client.getDoctor(id).subscribe(
      (res) => {
        console.log(res);
        this.doctor = res;
        this.if.firstName.setValue(res.firstName);
        this.if.lastName.setValue(res.lastName);
        this.if.phoneNumber.setValue(res.phoneNumber);
        this.if.emailAddress.setValue(res.emailAddress);
        this.if.richBio.setValue(res.biography);
        const div = document.createElement('div');
        div.innerHTML = res.biography;
        this.if.biography.setValue(div.innerText);
        this.if.tags.setValue(res.tags);
        this.if.specialty.setValue(res.specialty);
        this.specialty = res.specialty;
        this.if.isBackgroundCheck.setValue(true);
        this.af.addressId.setValue(res.address?.addressId);
        this.af.addressLine1.setValue(res.address?.addressLine1);
        this.af.addressLine2.setValue(res.address?.addressLine2);
        this.af.city.setValue(res.address?.city);
        this.af.stateAbbr.setValue(res.address.stateAbbr);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  isDataSaved() {
    return this.individualForm.dirty || this.individualAddress.dirty;
  }

  get if(): { [key: string]: AbstractControl } {
    return this.individualForm.controls;
  }
  get af(): { [key: string]: AbstractControl } {
    return this.individualAddress.controls;
  }

  submit() {
    let formData: Doctor;
    delete this.individualForm.value.isBackgroundCheck;
    delete this.individualForm.value.other;
    formData = {
      ...this.individualForm.value,
    };
    // formData.tags = this.tagGroup;
    formData.specialty = this.specialty;
    formData = {
      ...formData,
      address: { ...this.individualAddress.value },
    };
    formData.firstName = formData.firstName.trim();
    formData.lastName = formData.lastName.trim();
    if (formData.richBio) formData.biography = formData.richBio.trim();

    formData.address.addressLine1 = formData.address.addressLine1.trim();
    if (formData.address.addressLine2)
      formData.address.addressLine2 = formData.address.addressLine2.trim();

    if (this.id !== -1) {
      formData.userId = this.id;
      this.loading = true;
      console.log(formData);
      this.client.putDoctor(this.id, formData).subscribe(
        (res) => {
          this.loading = false;
          this.message.success('Success', 'Provider info successfully updated');

          this.individualForm.reset();
          this.individualAddress.reset();
          this.router.navigate(['/provider/listing']);
        },
        () => {
          this.loading = false;
        }
      );
    } else {
      console.log(formData);
      this.loading = true;
      this.client.postDoctor(formData).subscribe(
        (res) => {
          this.loading = false;
          this.message.success('Success', 'Provider info successfully added');

          this.individualForm.reset();
          this.individualAddress.reset();
          this.router.navigate(['/provider/listing']);
        },
        () => {
          this.loading = false;
        }
      );
    }
  }

  continue() {
    this.isAddressForm = true;
    if (this.formType === 'doctor') {
      this.formType = 'address';
    }
    if (this.id === -1) {
      this.data.fromChild({ isAddressForm: this.isAddressForm });
    }
    if (this.id > -1) {
      this.data.fromChild({ isAddressForm: true });
    }
    this.fullName =
      this.individualForm.controls['firstName'].value +
      ' ' +
      this.individualForm.controls['lastName'].value;
  }
  previous() {
    this.isAddressForm = false;
    if (this.formType === 'address') {
      this.formType = 'doctor';
    }
    if (this.id === -1) {
      this.data.fromChild({ isAddressForm: this.isAddressForm });
    }
    if (this.id > -1) {
      this.data.fromChild({ isAddressForm: true });
    }
  }
}
