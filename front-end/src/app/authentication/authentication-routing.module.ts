import { RequestComponent } from './request/request.component';
import { LoginPageGuard } from './../_helpers/login.guard';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { PatientRegisterFormComponent } from './patient-register-form/patient-register-form.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetGuard } from '../_helpers';
import { AuthenticationComponent } from './authentication.component';

const routes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    children: [
      { path: 'register', component: PatientRegisterFormComponent },
      {
        path: 'login',
        component: LoginFormComponent,
        canActivate: [LoginPageGuard],
      },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      {
        path: 'verify-email',
        component: VerifyEmailComponent,
      },
      {
        path: 'request',
        component: RequestComponent,
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        canActivate: [ResetGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
