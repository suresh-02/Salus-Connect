import { SecurityComponent } from './security/security.component';
import { RequestToJoinComponent } from './request-to-join/request-to-join.component';
import { PricingComponent } from './pricing/pricing.component';
import { LearnMoreComponent } from './learn-more/learn-more.component';
import { CareersComponent } from './careers/careers.component';
import { AboutComponent } from './about/about.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaticPagesComponent } from './static-pages.component';

const routes: Routes = [
  {
    path: '',
    component: StaticPagesComponent,
    children: [
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'careers',
        component: CareersComponent,
      },
      {
        path: 'learn-more',
        component: LearnMoreComponent,
      },
      {
        path: 'pricing',
        component: PricingComponent,
      },
      {
        path: 'request-to-join',
        component: RequestToJoinComponent,
      },
      {
        path: 'security',
        component: SecurityComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaticPagesRoutingModule {}
