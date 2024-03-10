import { ApiService } from 'src/app/_services';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { Animate, InOut, ErrorChecker } from 'src/app/_helpers';
import { Error } from 'src/app/_models';

@Component({
  selector: 'app-address-edit',
  templateUrl: './address-edit.component.html',
  styleUrls: ['./address-edit.component.scss'],
  animations: [Animate, InOut],
})
export class AddressEditComponent implements OnInit {
  @Input('form') addressForm: FormGroup;
  // @Input('editData') editData: any;
  addressLine1: Error = { name: 'addressLine1', label: 'Address Line 1' };
  debounce: any;
  isDropdown = false;
  authToken = localStorage.getItem('token');

  constructor(private client: ApiService) {}

  ngOnInit(): void {
    ErrorChecker(this.addressLine1, this.addressForm);
  }

  checkError(element: Error) {
    element = ErrorChecker(element, this.addressForm);
  }

  get af(): { [key: string]: AbstractControl } {
    return this.addressForm.controls;
  }
}
