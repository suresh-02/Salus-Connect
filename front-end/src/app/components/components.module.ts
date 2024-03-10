import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgZorroModule } from './../NgZorro.module';
import { OrderByPipe } from './../_pipes/sort.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';

import { ProviderHeaderComponent } from './provider-header/provider-header.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DoctorSlotsComponent } from './doctor-slots/doctor-slots.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AlertComponent } from './alert/alert.component';
import { BookedSlotsComponent } from './booked-slots/booked-slots.component';
import { CardComponent } from './card/card.component';
import { RouterModule } from '@angular/router';
import { DoctorEditComponent } from './doctor-edit/doctor-edit.component';
import { AddressEditComponent } from './address-edit/address-edit.component';
import { SocialButtonComponent } from './social-button/social-button.component';
import { ProviderSearchComponent } from './provider-search/provider-search.component';
import { TreatmentComponent } from './treatment/treatment.component';
import { DateTimeSelectorComponent } from './date-time-selector/date-time-selector.component';
import { PreviewCalendarComponent } from './preview-calendar/preview-calendar.component';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { PatientFaqComponent } from './patient-faq/patient-faq.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

@NgModule({
  declarations: [
    DoctorSlotsComponent,
    AlertComponent,
    BookedSlotsComponent,
    CalendarComponent,
    CardComponent,
    FooterComponent,
    HeaderComponent,
    ProviderHeaderComponent,
    DoctorEditComponent,
    OrderByPipe,
    AddressEditComponent,
    SocialButtonComponent,
    ProviderSearchComponent,
    TreatmentComponent,
    DateTimeSelectorComponent,
    PreviewCalendarComponent,
    PrivacyPolicyComponent,
    TermsOfUseComponent,
    TermsOfServiceComponent,
    PatientFaqComponent,
    ContactUsComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    OverlayModule,
    NgZorroModule,
    CKEditorModule,
  ],
  exports: [
    DoctorSlotsComponent,
    AlertComponent,
    BookedSlotsComponent,
    CalendarComponent,
    CardComponent,
    FooterComponent,
    HeaderComponent,
    ProviderHeaderComponent,
    DoctorEditComponent,
    AddressEditComponent,
    SocialButtonComponent,
    ProviderSearchComponent,
    TreatmentComponent,
    DateTimeSelectorComponent,
    PreviewCalendarComponent,
  ],
  providers: [],
})
export class ComponentsModule {}
