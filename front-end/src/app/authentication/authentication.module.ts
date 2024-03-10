import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';

import { PatientRegisterFormComponent } from './patient-register-form/patient-register-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from '../components/components.module';
import { NgZorroModule } from '../NgZorro.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationComponent } from './authentication.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { RequestComponent } from './request/request.component';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';

const icons: IconDefinition[] = [];

@NgModule({
  declarations: [
    PatientRegisterFormComponent,
    LoginFormComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AuthenticationComponent,
    VerifyEmailComponent,
    RequestComponent,
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgZorroModule,
    ComponentsModule,
    NzIconModule.forChild(icons),
  ],
})
export class AuthenticationModule {}
