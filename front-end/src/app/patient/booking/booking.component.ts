import { addMinute } from 'src/app/_helpers';
import { TokenStorageService, ApiService } from 'src/app/_services';
import { Component, OnInit } from '@angular/core';
import { Location, formatDate } from '@angular/common';

@Component({
  selector: 'app-request',
  template: `<div
    class="bg-white border-1 border-medGray rounded p-8 relative my-4 pb-5"
  >
    <button
      *ngIf="isError"
      class="text-blue2 hover:text-blue1 absolute right-8"
      (click)="location.back()"
    >
      <i nz-icon nzType="arrow-left" nzTheme="outline"></i> back
    </button>
    <div>
      <div
        class="flex flex-col items-center justify-center mx-auto max-w-[1000px] gap-y-2"
      >
        <i
          *ngIf="isLoading"
          nz-icon
          [nzType]="'loading'"
          [nzTheme]="'outline'"
          class="text-6xl leading-none"
        ></i>
        <i
          *ngIf="!isLoading && isError"
          nz-icon
          [nzType]="'close-circle'"
          [nzTheme]="'twotone'"
          class="text-6xl leading-none"
        ></i>
        <i
          *ngIf="!isLoading && !isError"
          nz-icon
          [nzType]="'check-circle'"
          [nzTheme]="'twotone'"
          class="text-6xl leading-none"
        ></i>
        <h1 class="text-2xl font-medium text-center">
          {{
            isLoading
              ? 'Requesting appointment please wait...'
              : isError
              ? 'Appointment request failed!'
              : isAutoApprove
              ? 'Appointment Confirmed!'
              : 'Appointment requested!'
          }}
        </h1>
        <div class="gap-y-2" *ngIf="!isLoading && !isError">
          <p class="text-center" *ngIf="!isAutoApprove">
            A confirmation email of your appointment request will be sent to
            your
            {{ user.emailAddress }} once the doctor's office accepts it.
          </p>
          <p class="text-center" *ngIf="isAutoApprove">
            A confirmation email of your appointment request has been sent to
            {{ user.emailAddress }}
          </p>
          <div class="appointment">
            <div class="details">
              <span>appointment id</span>
              <span>{{ requestedDate.appointmentCode }}</span>
            </div>
            <div class="details">
              <span>provider</span>
              <span>{{ requestedDate.providerName }}</span>
            </div>
            <div class="details">
              <span>Address</span>
              <span>
                {{
                  requestedDate.addressLine2
                    ? requestedDate.addressLine1 + ','
                    : requestedDate.addressLine1
                }}
                <br />
                {{ requestedDate.addressLine2 }}
              </span>
            </div>
            <div class="details">
              <span>location</span>
              <span
                >{{
                  requestedDate.facilityName
                    ? requestedDate.facilityName + ','
                    : null
                }}
                <br />
                {{ requestedDate.city }} {{ requestedDate.provinceAbbr }}</span
              >
            </div>
            <div class="details">
              <span>Date</span>
              <span>{{
                formatDate(requestedDate.appointmentDate, 'dd MMMM yyyy', 'en')
              }}</span>
            </div>
            <div class="details">
              <span>Time</span>
              <span>{{ appointmentTime[0] }} - {{ appointmentTime[1] }}</span>
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="!isLoading && !isError">
        <nz-divider></nz-divider>
        <div class="flex flex-col items-start">
          <h1 class="text-2xl font-medium">What's next?</h1>
          <p *ngIf="!isAutoApprove">
            1. Your appointment is still pending and will be confirmed once the
            Doctor's office accepts your request.
          </p>
          <p *ngIf="!isAutoApprove">
            2. Upon successful acceptance, you will receive a confirmation email
            and contact information of the clinic.
          </p>
          <p *ngIf="isAutoApprove">
            1. Your appointment is confirmed and the Doctor’s office has
            received your booking request.
          </p>
          <p *ngIf="isAutoApprove">
            2. If you need any assistance, please contact the doctor’s office
            directly via email or phone.
          </p>
          <p>
            3. If the clinic requires any additional screening (e.g. COVID-19 or
            travel related), they will contact you directly.
          </p>
        </div>
      </div>
    </div>
  </div> `,
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  user: any;
  formatDate = formatDate;
  addMinute = addMinute;
  appointmentBooking: any;
  isLoading = true;
  isError = false;
  requestedDate: any;
  appointmentTime: string[];
  isAutoApprove = true;

  constructor(
    private token: TokenStorageService,
    private client: ApiService,
    public location: Location
  ) {}

  ngOnInit(): void {
    this.appointmentBooking = this.token.getAppointment();
    this.user = this.token.getUser();
    // console.log(this.user, this.appointmentBooking);
    // console.log({
    //   doctorId: this.appointmentBooking.doctorId,
    //   appointmentDate: this.appointmentBooking.date,
    //   appointmentTime: this.appointmentBooking.slot,
    //   symptoms: this.appointmentBooking.symptoms,
    //   treatmentId: this.appointmentBooking.treatmentId,
    // });
    this.client
      .requestAppointment(this.user.userId, {
        doctorId: this.appointmentBooking.doctorId,
        appointmentDate: this.appointmentBooking.date,
        appointmentTime: this.appointmentBooking.slot,
        symptoms: this.appointmentBooking.symptoms,
        treatmentId: this.appointmentBooking.treatmentId,
      })
      .subscribe(
        (res: any) => {
          console.log(res);
          this.token.removeAppointment();
          this.requestedDate = res;
          this.appointmentTime = addMinute(
            res.appointmentTime,
            res.durationMinutes
          );
          this.isAutoApprove = res.isAutoApprove;
          this.isLoading = false;
        },
        (err) => {
          this.isError = true;
          this.isLoading = false;
          this.token.removeAppointment();
        }
      );
  }
}
