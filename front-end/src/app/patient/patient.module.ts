import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';
import { NgZorroModule } from './../NgZorro.module';
import { ComponentsModule } from './../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';

import { SearchDoctorComponent } from './search-doctor/search-doctor.component';
import { PatientComponent } from './patient.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { BookingComponent } from './booking/booking.component';
import { TimePipe } from '../_pipes/sort.pipe';
import { NoResultComponent } from './no-result/no-result.component';
import { RequestDoctorComponent } from './request-doctor/request-doctor.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    SearchDoctorComponent,
    PatientComponent,
    BookingComponent,
    TimePipe,
    NoResultComponent,
    RequestDoctorComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PatientRoutingModule,
    ComponentsModule,
    NgZorroModule,
    OverlayModule,
    CKEditorModule,
  ],
})
export class PatientModule {}
