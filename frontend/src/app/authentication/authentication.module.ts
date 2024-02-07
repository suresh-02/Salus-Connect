import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { NgZorroModule } from '../NgZorroModule.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, NgZorroModule],
  exports: [LoginComponent],
})
export class AuthenticationModule {}
