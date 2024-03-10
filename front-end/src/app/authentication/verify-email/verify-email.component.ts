import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/_services';
import { ActivatedRoute } from '@angular/router';
import { TokenStorageService } from './../../_services/token.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  loading = false;
  error = false;
  sendLoading = false;
  email: string;
  id: string;
  isPatient: boolean;

  constructor(
    private client: ApiService,
    private route: ActivatedRoute,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params.email;
      this.id = params.id;
      this.loading = true;
      this.client
        .verifyEmail({
          emailAddress: params.email,
          confirmEmailCode: params.id,
        })
        .subscribe(
          (res: any) => {
            this.isPatient = res.role.roleName === 'Patient';
            this.loading = false;
            console.log(res);
          },
          (err) => {
            this.loading = false;
            this.error = true;
          }
        );
    });
  }
  sendInvite() {
    this.sendLoading = true;
    this.client
      .sendInvite({
        emailAddress: this.email,
      })
      .subscribe((res) => {
        this.sendLoading = false;
        this.message.success('Success', 'Email sent successfully');
      });
  }
}
