import { environment } from './../../environments/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { Error } from 'src/app/_models';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DataService, Animate } from 'src/app/_helpers';
import {
  Validators,
  FormBuilder,
  FormGroup,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { ApiService, TokenStorageService } from '../_services';
import { Component, OnInit } from '@angular/core';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [Animate],
})
export class ProfileComponent implements OnInit {
  environment = environment;
  public Editor = ClassicEditor;

  user = this.token.getUser();
  doctor = this.token.getDoctor();
  isBio = true;
  isAddress = false;
  showModal = false;
  isPatient = false;
  isStaff = false;
  addressForm: FormGroup;
  _isDoctor = false;
  phone = new FormControl(null, [
    Validators.required,
    Validators.maxLength(10),
    Validators.minLength(10),
    Validators.pattern('^[0-9,-]*$'),
  ]);
  richBio = new FormControl(null, [Validators.required]);
  bio = new FormControl(null, [
    Validators.required,
    Validators.maxLength(4000),
  ]);
  phoneNumber: Error = { name: 'phoneNumber', label: 'Phone Number' };
  debounce: any;

  public get isDoctor(): boolean {
    return this._isDoctor;
  }

  public set isDoctor(v: boolean) {
    this._isDoctor = v;
    if (v) {
      this.user = this.token.getDoctor();
      this.isBio = true;
    } else {
      this.user = this.token.getUser();
      this.isBio = false;
    }
    this.phone.setValue(this.user.phoneNumber);
    if (this.user.biography) this.richBio.setValue(this.user.biography);
    const div = document.createElement('div');
    div.innerHTML = this.user.biography;
    this.bio.setValue(div.innerText);
  }

  constructor(
    private fb: FormBuilder,
    private client: ApiService,
    private token: TokenStorageService,
    private data: DataService,
    private message: NzNotificationService,
    private toast: NzMessageService
  ) {}

  ngOnInit(): void {
    this.data.sendHeaderData({ isNavigation: true });

    this.addressForm = this.fb.group({
      addressLine1: [null, [Validators.required]],
      addressLine2: [''],
      postalCode: [
        null,
        [Validators.required, Validators.minLength(6), Validators.maxLength(7)],
      ],
      postalCodeId: [''],
      city: [{ value: '', disabled: true }, [Validators.required]],
      state: [{ value: '', disabled: true }, [Validators.required]],
    });

    if (this.user.role.roleName === 'Administrator') {
      this.isBio = false;
    } else if (this.user.role.roleName === 'Doctor') {
      this.client.getDoctor(this.user.userId).subscribe((res) => {
        this.user = { ...this.user, ...res };
        this.isAddress = res.address ? true : false;
        this.phone.setValue(this.user.phoneNumber);
        this.richBio.setValue(this.user.biography);
      });
    } else if (this.user.role.roleName === 'SupportStaff') {
      this.isBio = false;
      this.isStaff = true;
    } else if (this.user.role.roleName == 'Patient') {
      this.client.getPatient(this.user.userId).subscribe((res) => {
        this.user = { ...this.user, ...res };
        if (res.address) {
          this.user.address.addressLine2 = this.user?.address.addressLine2
            ? this.user.address.addressLine2
            : '';
          this.af.addressLine1.setValue(this.user.address.addressLine1);
          this.af.addressLine2.setValue(this.user.address.addressLine2);
          this.af.postalCode.setValue(this.user.address.postalCode);
          this.af.postalCodeId.setValue(this.user.address.postalCodeId);
          this.af.city.setValue(this.user.address.city);
          this.af.state.setValue(
            `${this.user.address.provinceAbbr}-${this.user.address.provinceName}`
          );
        }

        this.isBio = false;
        this.isAddress = true;
        this.isPatient = true;
      });
    }
    this.phone.setValue(this.user.phoneNumber);
    this.bio.setValue(this.user.biography);
  }

  get af(): { [key: string]: AbstractControl } {
    return this.addressForm.controls;
  }

  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    const div = document.createElement('div');
    div.innerHTML = data;
    this.bio.setValue(div.innerText);
  }

  onUpload(files: any) {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    // this.http is the injected HttpClient
    const uploadData = new FormData();
    uploadData.append('file', fileToUpload, fileToUpload.name);
    const toastId = this.toast.loading('Uploading profile image...').messageId;
    this.client.uploadProfileImage(this.user.userId, uploadData).subscribe(
      (res: any) => {
        let user;
        user = this.user;
        user.imageUrl = res.imageUrl;
        console.log('User: Before', user);
        if (this.isDoctor) {
          this.token.saveDoctor(user);
        } else {
          console.log('User: After', user);
          this.token.saveUser(user);
        }
        this.toast.remove(toastId);
        this.toast.success(`${fileToUpload.name} file uploaded successfully`);
      },
      (err) => this.toast.remove(toastId)
    );
  }

  removeProfile() {
    this.client.removeProfileImage(this.user.userId).subscribe((res) => {
      let user = this.user;
      delete user.imageUrl;
      if (this.isDoctor) this.token.saveDoctor(user);
      else this.token.saveUser(user);
      this.toast.success('Profile image removed successfully');
    });
  }

  checkPhoneAvailability = (element: Error) => {
    if (element.name === 'phoneNumber') {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.client
          .getIsPhoneAvailable(this.phone.value, this.user.userId)
          .subscribe((res) => {
            if (!res.isAvailable) {
              this.phoneNumber.check = false;
              this.phoneNumber.isError = true;
              this.phoneNumber.message = 'Phone number already exists';
              this.phone.setErrors({
                alreadyExist: true,
              });
            } else {
              this.phoneNumber.check = true;
              this.phoneNumber.isError = false;
              this.phoneNumber.message = '';
            }
          });
      }, 700);
    }
  };

  submit() {
    console.log(this.addressForm.value);
    let data = { ...this.addressForm.value };
    if (this.user.address) data.addressId = this.user.address.addressId;
    this.client.putPatientAddress(this.user.userId, data).subscribe((res) => {
      this.message.success('Success', 'Address updated successfully');
      this.showModal = false;
      this.user.address.addressLine1 = this.af.addressLine1.value;
      this.user.address.addressLine2 = this.af.addressLine2.value;
      this.user.address.postalCode = this.af.postalCode.value;
      this.user.address.postalCodeId = this.af.postalCodeId.value;
      this.user.address.city = this.af.city.value;
      this.user.address.provinceName = this.af.state.value.split('-')[1];
    });
  }

  savePersonalInfo() {
    let phone = this.phone.value;
    let bio = this.richBio.value;
    this.client
      .updateProfile(this.user.userId, this.phone.value, this.richBio.value)
      .subscribe((res) => {
        this.phone.reset();
        this.richBio.reset();
        this.bio.reset();
        this.phone.setValue(phone);
        this.richBio.setValue(bio);
        this.user.biography = bio;
        this.user.phone = phone;
        this.token.saveDoctor(this.user);
        this.message.success('Success', 'Profile updated successfully');
      });
  }

  cancel() {
    this.showModal = false;
    // this.addressForm.reset();
  }
}
