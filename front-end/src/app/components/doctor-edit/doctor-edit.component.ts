import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { ApiService } from 'src/app/_services';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ErrorChecker, Animate, InOut } from 'src/app/_helpers';

import { Error } from '../../_models';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-doctor-edit',
  templateUrl: './doctor-edit.component.html',
  styleUrls: ['./doctor-edit.component.scss'],
  animations: [Animate, InOut],
})
export class DoctorEditComponent implements OnInit {
  @Input('individualForm') individualForm: FormGroup;
  // @Output('sendTagGroup') sendTagGroup = new EventEmitter<any>();
  @Output('sendSpecialty') sendSpecialty = new EventEmitter<any>();
  // @Input('tagGroup') tagGroup: string[] = [];
  @Input('selectedSpecialty') selectedSpecialty: any;
  @Input('isView') isView = false;
  @Input('id') id = -1;

  public Editor = ClassicEditor;

  firstName: Error = { name: 'firstName', label: 'First Name' };
  lastName: Error = { name: 'lastName', label: 'Last Name' };
  middleName: Error = { name: 'middleName', label: 'Middle Name' };
  phoneNumber: Error = { name: 'phoneNumber', label: 'Phone Number' };
  emailAddress: Error = { name: 'emailAddress', label: 'Email' };
  bio: Error = { name: 'biography', label: 'Bio' };
  tags: Error = { name: 'tags', label: 'Speciality' };
  specialty: Error = { name: 'specialty', label: 'Specialty' };

  isDropdown = false;
  dropdownPosition = 'bottom';
  isOther = false;
  debounce: any;
  phdebounce: any;
  emdebounce: any;
  specialtyData: any[] = [];
  isFormDirty = false;

  listOfOption: Array<{ value: string; label: string }> = [];

  constructor(private client: ApiService) {}

  ngOnInit(): void {
    console.log(this.id);
    let dropdown: any = document.getElementById('dropdown');

    dropdown?.addEventListener('keydown', (event: any) => {
      if (event.keyCode == 32 || event.keyCode == 13) {
        this.openDropdown();
      }
    });

    this.client.getSpecialties().subscribe((res) => {
      this.specialtyData = res;
    });
    this.client.getTags().subscribe((res) => {
      this.listOfOption = res.tags.map((item) => ({
        value: item,
        label: item,
      }));
      // console.log(this.listOfOption);
    });
  }

  isNotSelected(value: string): boolean {
    if (this.individualForm.controls['tags'].value) {
      return this.individualForm.controls['tags'].value.indexOf(value) === -1;
    } else {
      return true;
    }
  }

  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    const div = document.createElement('div');
    div.innerHTML = data;
    this.individualForm.controls['biography'].setValue(div.innerText);
    this.bio = ErrorChecker(this.bio, this.individualForm);
  }

  checkError = (element: Error) => {
    element = ErrorChecker(element, this.individualForm);
    this.isFormDirty = this.individualForm.dirty;
    if (element.name === 'phoneNumber' && !this.isView) {
      clearTimeout(this.phdebounce);
      this.phdebounce = setTimeout(() => {
        this.client
          .getIsPhoneAvailable(
            this.individualForm.controls['phoneNumber'].value,
            this.id
          )
          .subscribe((res) => {
            if (!res.isAvailable) {
              this.phoneNumber.check = false;
              this.phoneNumber.isError = true;
              this.phoneNumber.message = 'Phone number already exists';
              this.individualForm.controls['phoneNumber'].setErrors({
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
            this.individualForm.controls['emailAddress'].value,
            this.id
          )
          .subscribe((res) => {
            if (!res.isAvailable) {
              this.emailAddress.check = false;
              this.emailAddress.isError = true;
              this.emailAddress.message = 'Email already exists';
              this.individualForm.controls['emailAddress'].setErrors({
                alreadyExist: true,
              });
            }
          });
      }, 700);
    }
  };

  setSpecialty(data: any) {
    let { name, sId, cId } = data;
    // console.log({ categoryId: cId, specialtyId: sId, specialtyName: name });
    this.selectedSpecialty = {
      categoryId: cId,
      specialtyId: sId,
      specialtyName: name,
    };
    this.individualForm.controls['specialty'].setValue(this.selectedSpecialty);
    if (name !== 'Other') {
      this.sendSpecialty.emit(this.selectedSpecialty);
      this.isOther = false;
    } else {
      this.isOther = true;
    }
    this.isDropdown = false;
    this.specialty.isError = false;
    this.specialty.message = '';
    this.specialty.check = true;
  }
  checkSpecialty() {
    if (!this.individualForm.controls['specialty'].value) {
      this.specialty.isError = true;
      this.specialty.message = 'Please select your specialty';
    }
    this.isDropdown = false;
  }
  setOther() {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      let other = this.individualForm.controls['other'].value;
      this.selectedSpecialty.specialtyName = other;
      this.sendSpecialty.emit(this.selectedSpecialty);
    }, 700);
  }

  findSpecialty(id: number) {
    let selectedSpecialty;
    this.specialtyData.map((category) => {
      category.specialties.filter((specialty: any) => {
        if (specialty.specialtyId === id) {
          selectedSpecialty = { ...specialty, categoryId: category.categoryId };
        }
      });
    });
    if (selectedSpecialty) {
      this.individualForm.controls['specialty'].setValue(selectedSpecialty);
    }
    return selectedSpecialty;
  }

  openDropdown() {
    this.isDropdown = !this.isDropdown;
    let dropdown: any = document.getElementById('dropdown');
    if (
      document.documentElement.clientHeight -
        dropdown.getBoundingClientRect().bottom >=
      150
    ) {
      this.dropdownPosition = 'bottom';
    } else {
      this.dropdownPosition = 'top';
    }
  }
}
