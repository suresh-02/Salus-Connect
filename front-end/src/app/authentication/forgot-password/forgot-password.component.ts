import { Fader } from 'src/app/_helpers';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/_services';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [Fader],
})
export class ForgotPasswordComponent implements OnInit {
  loading = false;
  emailAddress = new FormControl(null, [Validators.email]);

  constructor(
    private client: ApiService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {}

  sendMail() {
    this.loading = true;
    this.client.forgotPassword(this.emailAddress.value).subscribe(
      (res) => {
        this.loading = false;
        this.message.success('Success', 'Email sent successfully');
      },
      (error) => {
        this.loading = false;
      }
    );
  }
}
