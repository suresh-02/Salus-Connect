import { ProfileComponent } from './profile/profile.component';
import { LoginGuard } from './_helpers/login.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { TermsOfServiceComponent } from './components/terms-of-service/terms-of-service.component';
import { PatientFaqComponent } from './components/patient-faq/patient-faq.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { DrugInteractionComponent } from './components/drug-interaction/drug-interaction.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'di', component: DrugInteractionComponent },
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('./provider/provider.module').then((m) => m.ProviderModule),
  },
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('./patient/patient.module').then((m) => m.PatientModule),
  },
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('./static-pages/static-pages.module').then(
        (m) => m.StaticPagesModule
      ),
  },
  {
    path: 'account',
    component: ProfileComponent,
    canActivate: [LoginGuard],
  },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-of-use', component: TermsOfUseComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
  { path: 'patient-faq', component: PatientFaqComponent },
  { path: 'contact-us', component: ContactUsComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // Restore the last scroll position
      scrollPositionRestoration: 'enabled',
      scrollOffset: [0, 0],
      // Enable scrolling to anchors
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
