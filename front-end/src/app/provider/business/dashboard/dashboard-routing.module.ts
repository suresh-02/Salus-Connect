import { RevenueComponent } from './revenue/revenue.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'appointment',
    pathMatch: 'full',
  },
  { path: 'appointment', component: AppointmentComponent },
  { path: 'revenue', component: RevenueComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
