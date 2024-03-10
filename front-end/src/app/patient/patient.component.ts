import { TokenStorageService } from './../_services/token.service';
import { Router, RouterOutlet } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient',
  template: `
    <app-header *ngIf="!isUser"></app-header>
    <app-provider-header *ngIf="isUser"></app-provider-header>
    <div class="provider" [@fade]="prepareRoute(outlet)">
      <div class="container z-0" [class]="isUser ? 'pt-24' : 'pt-20'">
        <router-outlet #outlet="outlet"></router-outlet>
      </div>
    </div>
    <div class="bottom-0 my-4 flex gap-4 justify-center items-center">
      <a routerLink="/terms-of-use" target="_blank">Terms of Use</a>
      <a routerLink="/privacy-policy" target="_blank">Privacy Policy</a>
      <a routerLink="/contact-us" target="_blank">Get Support</a>
    </div>
  `,
  animations: [
    trigger('fade', [
      transition('* <=> *', [style({ opacity: 0 }), animate(500)]),
    ]),
  ],
})
export class PatientComponent implements OnInit {
  isUser = this.token.getUser();
  constructor(private router: Router, private token: TokenStorageService) {}

  ngOnInit(): void {}

  prepareRoute(outlet: RouterOutlet) {
    return outlet.activatedRoute.snapshot.url;
  }
}
