import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/_services';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Error, SupportStaff } from 'src/app/_models';
import { ErrorChecker, clearForm, Animate } from 'src/app/_helpers';

@Component({
  selector: 'app-support-staff',
  templateUrl: './support-staff.component.html',
  styleUrls: ['./support-staff.component.scss'],
  animations: [Animate],
})
export class SupportStaffComponent implements OnInit {
  @Input('isView') isView: boolean;
  @Input('suppStaffData') suppStaff: SupportStaff[] = [];
  @Output('suppStaffData') suppStaffData = new EventEmitter<any>();
  @Input('hospitalName') hospitalName: any;
  @Input() suppStaffForm: FormGroup;
  showModal = false;
  id: number;
  title: string;

  firstName: Error = { name: 'firstName', label: 'First Name' };
  lastName: Error = { name: 'lastName', label: 'Last Name' };
  middleName: Error = { name: 'middleName', label: 'Middle Name' };
  phoneNumber: Error = { name: 'phoneNumber', label: 'Phone Number' };
  emailAddress: Error = { name: 'emailAddress', label: 'Email Address' };
  elements = {
    firstName: this.firstName,
    lastName: this.lastName,
    middleName: this.middleName,
    phoneNumber: this.phoneNumber,
    emailAddress: this.emailAddress,
  };

  phdebounce: any;
  emdebounce: any;

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

  get sf(): { [key: string]: AbstractControl } {
    return this.suppStaffForm.controls;
  }

  trackByFunction = (index: number, doctor: any) => {
    return doctor.id;
  };

  save() {
    // console.log(this.id);
    if (this.id === -1) {
      if (this.suppStaffForm.valid) {
        this.showModal = !this.showModal;
        let data: SupportStaff = { ...this.suppStaffForm.value };
        this.suppStaff = [...this.suppStaff, data];
        data.sequence = this.suppStaff.length;
        clearForm(this.suppStaffForm, this.elements);
      }
    } else {
      this.showModal = !this.showModal;
      let data = this.suppStaff[this.id];
      let formData = this.suppStaffForm.value;
      data.firstName = formData.firstName;
      data.lastName = formData.lastName;
      data.middleName = formData.middleName;
      data.phoneNumber = formData.phoneNumber;
      data.emailAddress = formData.emailAddress;
    }
    this.suppStaffData.emit(this.suppStaff);
  }
  delete() {
    this.suppStaff = this.suppStaff.filter((d, id) => id !== this.id);
    this.suppStaffForm.markAsDirty();
    this.suppStaffData.emit(this.suppStaff);
  }

  toggleModal(id?: any) {
    this.showModal = !this.showModal;
    this.id = id;
    clearForm(this.suppStaffForm, this.elements);
    if (id >= 0) {
      this.title = 'Edit';
      let data = this.suppStaff[id];
      // this.suppStaffForm.setValue(data);
      this.sf.firstName.setValue(data.firstName);
      this.sf.lastName.setValue(data.lastName);
      this.sf.middleName.setValue(data.middleName);
      this.sf.phoneNumber.setValue(data.phoneNumber);
      this.sf.emailAddress.setValue(data.emailAddress);
    } else {
      this.title = 'Add';
    }
  }

  checkError = (element: Error) => {
    element = ErrorChecker(element, this.suppStaffForm);

    if (element.name === 'phoneNumber' && !this.isView) {
      clearTimeout(this.phdebounce);
      this.phdebounce = setTimeout(() => {
        this.client
          .getIsPhoneAvailable(
            this.suppStaffForm.controls['phoneNumber'].value,
            this.suppStaff[this.id].userId
          )
          .subscribe((res) => {
            if (!res.isAvailable) {
              this.phoneNumber.check = false;
              this.phoneNumber.isError = true;
              this.phoneNumber.message = 'Phone number already exists';
              this.suppStaffForm.controls['phoneNumber'].setErrors({
                alreadyExist: true,
              });
            }
          });
      }, 700);
    }

    if (element.name === 'emailAddress' && !this.isView) {
      clearTimeout(this.emdebounce);
      this.emdebounce = setTimeout(() => {
        this.client
          .getIsEmailAvailable(
            this.suppStaffForm.controls['emailAddress'].value,
            this.suppStaff[this.id].userId
          )
          .subscribe((res) => {
            if (!res.isAvailable) {
              this.emailAddress.check = false;
              this.emailAddress.isError = true;
              this.emailAddress.message = 'Email already exists';
              this.suppStaffForm.controls['emailAddress'].setErrors({
                alreadyExist: true,
              });
            }
          });
      }, 700);
    }
  };

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
        let staff = this.suppStaff.filter(
          (doc) => doc.userId === this.providerId
        )[0];
        staff.status = status;
        this.suppStaffData.emit(this.suppStaff);
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
          let staff = this.suppStaff.filter(
            (doc) => doc.userId === this.providerId
          )[0];
          staff.status = 'Invited';
          this.suppStaffData.emit(this.suppStaff);
          this.toast.remove(id);
          this.message.success('Success', 'Invite sent successfully');
        },
        (err) => {
          this.toast.remove(id);
        }
      );
  }
}
