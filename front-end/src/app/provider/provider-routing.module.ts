import { PatientsComponent } from './patients/patients.component';
import { HolidayEditComponent } from './holiday-edit/holiday-edit.component';
import { ChooseDoctorComponent } from './choose-doctor/choose-doctor.component';
import { SpecialtyEditComponent } from './specialty-edit/specialty-edit.component';
import { IndividualEditComponent } from './individual-edit/individual-edit.component';
import { NavigationGuard } from './../_helpers';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../_helpers';
import { AppointmentComponent } from './appointment/appointment.component';
import { HomeComponent } from './home/home.component';
import { ProvidersComponent } from './providers/providers.component';
import { ProviderComponent } from './provider.component';
import { RegisterComponent } from './register/register.component';
import { HospitalEditComponent } from './hospital-edit/hospital-edit.component';
import { InboxComponent } from './inbox/inbox.component';

const routes: Routes = [
  {
    path: 'provider',
    component: ProviderComponent,
    children: [
      { path: 'home', component: HomeComponent },
      {
        path: 'appointment',
        component: AppointmentComponent,
        canDeactivate: [NavigationGuard],
      },
      { path: 'inbox', component: InboxComponent },
      {
        path: 'business',
        loadChildren: () =>
          import('./business/business.module').then((m) => m.BusinessModule),
      },
      { path: 'choose', component: ChooseDoctorComponent },
      {
        path: 'register',
        component: RegisterComponent,

        children: [
          {
            path: '',
            redirectTo: 'individual',
            pathMatch: 'full',
          },
          {
            path: 'individual',
            canDeactivate: [NavigationGuard],
            component: IndividualEditComponent,
          },
          {
            path: 'hospital',
            component: HospitalEditComponent,
            canDeactivate: [NavigationGuard],
          },
          {
            path: 'clinic',
            component: HospitalEditComponent,
            canDeactivate: [NavigationGuard],
          },
        ],
      },
      {
        path: 'edit/:id',
        component: RegisterComponent,
        children: [
          {
            path: 'individual',
            component: IndividualEditComponent,
            canDeactivate: [NavigationGuard],
          },
          {
            path: 'hospital',
            component: HospitalEditComponent,
            canDeactivate: [NavigationGuard],
          },
          {
            path: 'clinic',
            component: HospitalEditComponent,
            canDeactivate: [NavigationGuard],
          },
        ],
      },
      { path: 'listing', component: ProvidersComponent },
      { path: 'specialty', component: SpecialtyEditComponent },
      { path: 'holiday', component: HolidayEditComponent },
      { path: 'patients', component: PatientsComponent },
    ],
    canActivate: [LoginGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProviderRoutingModule {}
