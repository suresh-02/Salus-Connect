import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DataService, ErrorChecker, Animate, Fader } from 'src/app/_helpers';
import { Error } from 'src/app/_models';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, TokenStorageService } from 'src/app/_services';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  animations: [Animate, Fader],
})
export class LoginFormComponent implements OnInit {
  redirectUrl: string;
  loginForm: FormGroup;

  hidePassword = 'password';
  emailAddress: Error = { name: 'emailAddress', label: 'Email address' };
  password: Error = { name: 'password', label: 'Password' };

  checkError = (element: Error) => {
    element = ErrorChecker(element, this.loginForm);
  };

  hideOrShowPassword() {
    if (this.hidePassword === 'text') this.hidePassword = 'password';
    else this.hidePassword = 'text';
  }

  constructor(
    private fb: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    private data: DataService,
    private auth: AuthService,
    private token: TokenStorageService
  ) {
    this.route.queryParams.subscribe((res) => {
      this.redirectUrl = res.redirectUrl;
    });
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      emailAddress: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
    ErrorChecker(this.emailAddress, this.loginForm);
    ErrorChecker(this.password, this.loginForm);
  }

  submit() {
    let data = this.loginForm.value;
    let appointment = this.token.getAppointment();
    this.auth.login(data).subscribe((res) => {
      this.token.saveToken(res.token);
      this.token.saveUser({ ...res.user, facility: res.facility });
      if (this.redirectUrl) {
        this.router.navigateByUrl(this.redirectUrl);
      } else {
        if (!appointment) {
          if (res.user.role.roleName === 'SupportStaff') {
            this.router.navigate(['/provider/choose']);
          } else if (res.user.role.roleName === 'Patient') {
            this.router.navigate(['/home']);
          } else {
            this.data.sendHeaderData({ isNavigation: true });
            this.router.navigate(['/provider/home']);
          }
        } else {
          this.router.navigate(['/booking']);
        }
      }
    });
  }
}
