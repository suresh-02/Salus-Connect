import { DirectivesModule } from './../_helpers/debounce';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { OverlayModule } from '@angular/cdk/overlay';
import { ChooseDoctorComponent } from './choose-doctor/choose-doctor.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { ProviderRoutingModule } from './provider-routing.module';

import { AppointmentComponent } from './appointment/appointment.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { SupportStaffComponent } from './hospital-edit/support-staff/support-staff.component';
import { ProvidersComponent } from './providers/providers.component';
import { ProviderComponent } from './provider.component';
import { DoctorComponent } from './hospital-edit/doctor/doctor.component';
import { IndividualEditComponent } from './individual-edit/individual-edit.component';
import { HospitalEditComponent } from './hospital-edit/hospital-edit.component';
import { SpecialtyEditComponent } from './specialty-edit/specialty-edit.component';
import { InboxComponent } from './inbox/inbox.component';
import { PatientsComponent } from './patients/patients.component';

import { ProviderSearchPipe } from '../_pipes/search.pipe';
import { NgZorroModule } from '../NgZorro.module';
import { HolidayEditComponent } from './holiday-edit/holiday-edit.component';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

FullCalendarModule.registerPlugins([dayGridPlugin, timeGridPlugin, listPlugin]);
@NgModule({
  declarations: [
    PatientsComponent,
    ProviderComponent,
    AppointmentComponent,
    HomeComponent,
    RegisterComponent,
    HospitalEditComponent,
    IndividualEditComponent,
    DoctorComponent,
    SupportStaffComponent,
    ProvidersComponent,
    ProviderSearchPipe,
    SpecialtyEditComponent,
    ChooseDoctorComponent,
    InboxComponent,
    HolidayEditComponent,
  ],
  imports: [
    CommonModule,
    ProviderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ComponentsModule,
    NgZorroModule,
    FullCalendarModule,
    OverlayModule,
    CKEditorModule,
    DirectivesModule,
  ],
  exports: [],
})
export class ProviderModule {}
