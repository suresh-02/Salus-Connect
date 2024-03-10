import { HomeComponent } from './home/home.component';
import { RequestDoctorComponent } from './request-doctor/request-doctor.component';
import { PatientComponent } from './patient.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SearchDoctorComponent } from './search-doctor/search-doctor.component';
import { BookingComponent } from './booking/booking.component';
import { BookingGuard, LoginGuard } from '../_helpers';

const routes: Routes = [
  {
    path: '',
    component: PatientComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [LoginGuard],
      },
      { path: 'search-doctor', component: SearchDoctorComponent },
      {
        path: 'doctor',
        component: RequestDoctorComponent,
      },
      {
        path: 'booking',
        component: BookingComponent,
        canActivate: [LoginGuard, BookingGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientRoutingModule {}
