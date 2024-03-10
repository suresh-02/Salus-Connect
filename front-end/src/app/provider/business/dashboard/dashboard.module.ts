import { FormsModule } from '@angular/forms';
import { NgZorroModule } from './../../../NgZorro.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { AppointmentComponent } from './appointment/appointment.component';
import { RevenueComponent } from './revenue/revenue.component';

@NgModule({
  declarations: [AppointmentComponent, RevenueComponent],
  imports: [
    CommonModule,
    OverlayModule,
    DashboardRoutingModule,
    NgZorroModule,
    FormsModule,
  ],
})
export class DashboardModule {}
