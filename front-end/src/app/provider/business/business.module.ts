import { NgZorroModule } from './../../NgZorro.module';
import { BusinessComponent } from './business.component';
import { BusinessRoutingModule } from './business-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [BusinessComponent],
  imports: [CommonModule, BusinessRoutingModule, NgZorroModule],
})
export class BusinessModule {}
