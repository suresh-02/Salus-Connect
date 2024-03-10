import { ApiService } from 'src/app/_services';
import { Fader } from 'src/app/_helpers';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { Error } from '../../_models';
import { ErrorChecker, Animate } from '../../_helpers';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  animations: [Animate, Fader],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  id: any;
  email: string;

  hidePassword = 'password';
  hideConfirmPassword = 'password';

  password: Error = { name: 'password', label: 'Password' };
  confirmPassword: Error = {
    name: 'confirmPassword',
    label: 'Confirm Password',
  };

  constructor(
    private fb: FormBuilder,
    private client: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private message: NzNotificationService
  ) {
    this.resetForm = this.fb.group({
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
          ),
        ],
      ],
      confirmPassword: [null, [Validators.required]],
    });
    this.route.queryParams.subscribe((params) => {
      this.id = params.id;
      this.email = params.email;
    });
  }

  ngOnInit(): void {}

  checkError = (element: Error) => {
    element = ErrorChecker(element, this.resetForm, this.confirmPassword);
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

  reset() {
    let formData = {
      resetPasswordCode: this.id,
      emailAddress: this.email,
      password: this.resetForm.controls['password'].value,
    };
    this.client.resetPassword(formData).subscribe(
      (res) => {
        {
          console.log(res);
          this.message.success(
            'Success',
            'Your password was reset successfully.'
          );
          this.router.navigate(['/login']);
        }
      },
      (error) => {
        console.log(error);
        this.message.success('Error', error.error.message);
      }
    );
  }
}
