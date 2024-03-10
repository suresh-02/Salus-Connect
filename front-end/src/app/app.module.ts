import { StaticPagesModule } from './static-pages/static-pages.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { BrowserModule } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ComponentsModule } from './components/components.module';
import { PatientModule } from './patient/patient.module';
import { ProviderModule } from './provider/provider.module';
import { NgZorroModule } from './NgZorro.module';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { ProfileComponent } from './profile/profile.component';

import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthInterceptorProvider, ErrorInterceptorProvider } from './_helpers';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';

import {
  LogoutOutline,
  CloseCircleTwoTone,
  CheckCircleTwoTone,
} from '@ant-design/icons-angular/icons';
import { DrugInteractionComponent } from './drug-interaction/drug-interaction.component';

const icons: IconDefinition[] = [
  LogoutOutline,
  CloseCircleTwoTone,
  CheckCircleTwoTone,
];

registerLocaleData(en);
@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    ProfileComponent,
    DrugInteractionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgZorroModule,
    AuthenticationModule,
    ProviderModule,
    ComponentsModule,
    PatientModule,
    StaticPagesModule,
    CKEditorModule,
    NzIconModule.forRoot(icons),
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    NzModalService,
    AuthInterceptorProvider,
    ErrorInterceptorProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
