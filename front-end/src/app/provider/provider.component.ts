import { RouterOutlet } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-provider',
  template: `<app-provider-header></app-provider-header>
    <div class="provider z-0" [@fade]="prepareRoute(outlet)">
      <div class="container pt-24">
        <router-outlet #outlet="outlet"></router-outlet>
      </div>
    </div>
    <div class="bottom-0 my-4 flex gap-4 justify-center items-center">
      <a routerLink="/terms-of-use" target="_blank">Terms of Use</a>
      <a routerLink="/privacy-policy" target="_blank">Privacy Policy</a>
      <a routerLink="/contact-us" target="_blank">Get Support</a>
    </div> `,
  animations: [
    trigger('fade', [
      transition('* <=> *', [style({ opacity: 0 }), animate(600)]),
    ]),
  ],
})
export class ProviderComponent implements OnInit {
  prepareRoute(outlet: RouterOutlet) {
    if (outlet.activatedRoute.snapshot.url.length >= 1)
      return outlet.activatedRoute.snapshot.url;
    return false;
  }
  constructor() {}

  ngOnInit(): void {}
}
