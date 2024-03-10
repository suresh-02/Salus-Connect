import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from './../../_services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-request',
  template: `<div class="bg-white border-1 border-medGray rounded p-8">
    <div class="mx-auto max-w-[800px]">
      <div class="flex flex-col items-center justify-center">
        <i
          nz-icon
          nzType="exclamation-circle"
          nzTheme="twotone"
          class="text-6xl leading-none"
        ></i>
        <h1 class="text-lg text-center">
          One last step before your account is registered...
        </h1>
        <p class="text-center text-darkGray mb-2">
          Please check your email ({{ email }}) for a confirmation link. The
          link verifies your account after which you can book your medical
          appointments through SimplyDoc.
        </p>
        <a
          class="text-blue2 hover:text-blue1 transition-colors"
          (click)="sendInvite()"
          >Didn't recieve the email? Send again</a
        >
      </div>
    </div>
  </div> `,
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnInit {
  email: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private client: ApiService,
    private message: NzNotificationService,
    private toast: NzMessageService
  ) {
    this.route.queryParams.subscribe((res) => {
      this.email = res.email;
      if (!res.email) {
        this.router.navigate(['/']);
      }
      console.log(res);
    });
  }

  ngOnInit(): void {}

  sendInvite() {
    const id = this.toast.loading('Action in progress..', {
      nzDuration: 0,
    }).messageId;
    this.client.sendInvite({ emailAddress: this.email }).subscribe((res) => {
      this.toast.remove(id);
      this.message.success('Success', 'Invite sent successfuly');
    });
  }
}
