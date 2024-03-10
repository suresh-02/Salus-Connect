import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from './../components/components.module';
import { AboutComponent } from './about/about.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticPagesRoutingModule } from './static-pages-routing.module';
import { StaticPagesComponent } from './static-pages.component';
import { CareersComponent } from './careers/careers.component';
import { LearnMoreComponent } from './learn-more/learn-more.component';
import { PricingComponent } from './pricing/pricing.component';
import { RequestToJoinComponent } from './request-to-join/request-to-join.component';
import { SecurityComponent } from './security/security.component';

import { NzSwitchModule } from 'ng-zorro-antd/switch';

@NgModule({
  declarations: [
    StaticPagesComponent,
    AboutComponent,
    CareersComponent,
    LearnMoreComponent,
    PricingComponent,
    RequestToJoinComponent,
    SecurityComponent,
  ],
  imports: [
    CommonModule,
    StaticPagesRoutingModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    NzSwitchModule,
  ],
})
export class StaticPagesModule {}
