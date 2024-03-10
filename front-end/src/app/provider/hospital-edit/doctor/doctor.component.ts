import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/_services';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Error, Doctor } from 'src/app/_models';
import { clearForm, Animate, InOut } from 'src/app/_helpers';
@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss'],
  animations: [Animate, InOut],
})
export class DoctorComponent implements OnInit {
  @Input('isView') isView: boolean;
  @Input('doctorsData') doctors: Doctor[];
  @Input('hospitalName') hospitalName: any;
  @Output('doctorData') doctorData = new EventEmitter<any>();
  @Input() doctorForm: FormGroup;
  showModal = false;
  id: number;
  title: string;
  isDropdown = false;

  firstName: Error = { name: 'firstName', label: 'First Name' };
  lastName: Error = { name: 'lastName', label: 'Last Name' };
  phoneNumber: Error = { name: 'phoneNumber', label: 'Phone Number' };
  emailAddress: Error = { name: 'emailAddress', label: 'Email Address' };
  biography: Error = { name: 'biography', label: 'Biography' };
  specialty: Error = { name: 'specialty', label: 'Specialty' };
  tags: Error = { name: 'tags', label: 'Specialities' };
  specialtyData: any;
  elements = {
    firstName: this.firstName,
    lastName: this.lastName,
    phoneNumber: this.phoneNumber,
    emailAddress: this.emailAddress,
    biography: this.biography,
    specialty: this.specialty,
    tags: this.tags,
  };

  providerId: any;
  providerStatus: any;
  providerType: string;
  status: any = {
    Active: 'activated',
    Inactive: 'deactivated',
    Published: 'info published',
    Invited: 'invited',
  };

  constructor(
    private client: ApiService,
    private message: NzNotificationService,
    private toast: NzMessageService
  ) {}

  ngOnInit(): void {}
  get df(): { [key: string]: AbstractControl } {
    return this.doctorForm.controls;
  }

  trackByFunction = (index: number, doctor: any) => {
    return doctor.id;
  };

  getSpecialty(e: any) {
    if (e.specialtyName !== null) {
      this.specialtyData = e;
    }
  }

  save() {
    // console.log(this.id);
    if (this.id === -1) {
      if (this.doctorForm.valid) {
        this.doctorForm.controls['specialty'].setValue(this.specialtyData);
        let data: Doctor = { ...this.doctorForm.value };
        delete data.other;
        if (data.richBio) data.biography = data.richBio;
        this.doctors = [...this.doctors, data];
        data.sequence = this.doctors.length;
        this.showModal = !this.showModal;
        // console.log(data);
      }
    } else {
      let data = this.doctors[this.id];
      let formData = this.doctorForm.value;
      data.firstName = formData.firstName;
      data.lastName = formData.lastName;
      data.phoneNumber = formData.phoneNumber;
      data.emailAddress = formData.emailAddress;
      data.biography = formData.richBio;
      data.specialty = this.specialtyData;
      data.tags = formData.tags;
      data.isBackgroundCheck = formData.isBackgroundCheck;
      this.showModal = !this.showModal;
    }
    this.doctorData.emit(this.doctors);
  }
  delete() {
    this.doctors = this.doctors.filter((d, id) => id !== this.id);
    this.doctorForm.markAsDirty();

    this.doctorData.emit(this.doctors);
  }

  toggleModal(id?: any) {
    this.id = id;
    clearForm(this.doctorForm, this.elements);
    if (id >= 0) {
      this.title = 'Edit';
      let data = this.doctors[id];
      // console.log(data);
      this.specialtyData = data.specialty;
      this.df.firstName.setValue(data.firstName);
      this.df.lastName.setValue(data.lastName);
      this.df.phoneNumber.setValue(data.phoneNumber);
      this.df.emailAddress.setValue(data.emailAddress);
      this.df.tags.setValue(data.tags);
      this.df.richBio.setValue(data.biography);
      let bio = document.createElement('div');
      bio.innerHTML = data.biography;
      this.df.biography.setValue(bio.innerText);
      this.df.isBackgroundCheck.setValue(true);
      this.df.specialty.setValue(data.specialty);
    } else {
      this.title = 'Add';
    }

    this.showModal = !this.showModal;
  }

  setData(data: any) {
    const { pId, pType, status, pTypeConversion } = data;
    if (pId) this.providerId = pId;
    if (status) this.providerStatus = status;
    if (pType) {
      if (pTypeConversion) {
        if (pType.toLowerCase() === 'individual') this.providerType = 'doctors';
        else this.providerType = 'facilities';
      } else this.providerType = pType;
    }
  }

  activateProvider(status: string) {
    this.client
      .updateProviderStatus(this.providerType, this.providerId, status)
      .subscribe(() => {
        let doctor = this.doctors.filter(
          (doc) => doc.userId === this.providerId
        )[0];
        doctor.status = status;
        this.doctorData.emit(this.doctors);
        this.message.success(
          'Success',
          `Provider ${this.status[status]} successfully`
        );
      });
  }

  sendInvite() {
    const id = this.toast.loading('Action in progress..', {
      nzDuration: 0,
    }).messageId;

    this.client
      .sendInviteToProvider({
        id: this.providerId,
        providerType: this.providerType,
      })
      .subscribe(
        (res) => {
          let doctor = this.doctors.filter(
            (doc) => doc.userId === this.providerId
          )[0];
          doctor.status = 'Invited';
          this.doctorData.emit(this.doctors);
          this.toast.remove(id);
          this.message.success('Success', 'Invite sent successfully');
        },
        (err) => {
          this.toast.remove(id);
        }
      );
  }
}
