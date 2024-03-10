import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { ErrorChecker, Animate, Fader } from 'src/app/_helpers';
import { Error, Patient } from 'src/app/_models';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_services';

@Component({
  selector: 'app-register-form',
  templateUrl: './patient-register-form.component.html',
  styleUrls: ['./patient-register-form.component.scss'],
  animations: [Animate, Fader],
})
export class PatientRegisterFormComponent implements OnInit {
  form: FormGroup;
  loading = false;

  hidePassword = 'password';
  hideConfirmPassword = 'password';

  firstName: Error = { name: 'firstName', label: 'First Name' };
  lastName: Error = { name: 'lastName', label: 'Last Name' };
  phoneNumber: Error = { name: 'phoneNumber', label: 'Phone Number' };
  emailAddress: Error = { name: 'emailAddress', label: 'Email Address' };
  password: Error = { name: 'password', label: 'Password' };
  confirmPassword: Error = {
    name: 'confirmPassword',
    label: 'Confirm Password',
  };

  phdebounce: any;
  emdebounce: any;

  checkError = (element: Error) => {
    if (element == this.password || element == this.confirmPassword) {
      element = ErrorChecker(element, this.form, this.confirmPassword);
    } else element = ErrorChecker(element, this.form);

    if (element.name === 'phoneNumber') {
      clearTimeout(this.phdebounce);
      this.phdebounce = setTimeout(() => {
        this.client
          .getIsPhoneAvailable(this.form.controls['phoneNumber'].value)
          .subscribe((res) => {
            if (!res.isAvailable) {
              this.phoneNumber.check = false;
              this.phoneNumber.isError = true;
              this.phoneNumber.message = 'Phone number already exists';
              this.form.controls['phoneNumber'].setErrors({
                alreadyExist: true,
              });
            }
          });
      }, 700);
    }

    if (element.name === 'emailAddress') {
      clearTimeout(this.emdebounce);
      this.emdebounce = setTimeout(() => {
        this.client
          .getIsEmailAvailable(this.form.controls['emailAddress'].value)
          .subscribe((res) => {
            console.log(res);
            if (!res.isAvailable) {
              this.emailAddress.check = false;
              this.emailAddress.isError = true;
              this.emailAddress.message = 'Email already exists';
              this.form.controls['emailAddress'].setErrors({
                alreadyExist: true,
              });
            }
          });
      }, 700);
    }
  };

  hideOrShowPassword(element: string) {
    if (element === 'password') {
      if (this.hidePassword === 'text') this.hidePassword = 'password';
      else this.hidePassword = 'text';
    }
    if (element === 'confirmPassword') {
      if (this.hideConfirmPassword === 'text')
        this.hideConfirmPassword = 'password';
      else this.hideConfirmPassword = 'text';
    }
  }

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private client: ApiService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [null, [Validators.required, Validators.minLength(3)]],
      lastName: [null, [Validators.required, Validators.minLength(3)]],
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
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{7,}'
          ),
        ],
      ],
      confirmPassword: [null, [Validators.required]],
      emailCheckbox: [false, Validators.requiredTrue],
      agreeCheckbox: [false, Validators.requiredTrue],
    });
    // ErrorChecker(this.firstName, this.form);
    // ErrorChecker(this.lastName, this.form);
    // ErrorChecker(this.phoneNumber, this.form);
    // ErrorChecker(this.email, this.form);
    // ErrorChecker(this.password, this.form);
    // ErrorChecker(this.confirmPassword, this.form);
  }
  submit() {
    console.log(this.form.value);
    let formData: Patient;
    formData = {
      ...this.form.value,
    };
    formData = {
      ...formData,
    };
    formData.firstName = formData.firstName.trim();
    formData.lastName = formData.lastName.trim();
    this.loading = true;
    this.client.postPatient(formData).subscribe(
      (res) => {
        this.loading = false;
        this.router.navigate(['/request'], {
          queryParams: { email: formData.emailAddress },
        });
      },
      (err) => {
        this.loading = false;
      }
    );
  }
}
