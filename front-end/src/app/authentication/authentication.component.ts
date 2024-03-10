import { RouterOutlet } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authentication',
  template: `<app-header></app-header>
    <div class="provider pt-20" [@fade]="prepareRoute(outlet)">
      <div class="container z-0">
        <router-outlet #outlet="outlet"></router-outlet>
      </div>
    </div> `,
  animations: [
    trigger('fade', [
      transition('* <=> *', [style({ opacity: 0 }), animate(500)]),
    ]),
  ],
})
export class AuthenticationComponent implements OnInit {
  prepareRoute(outlet: RouterOutlet) {
    return outlet.activatedRoute.snapshot.url;
  }
  constructor() {}

  ngOnInit(): void {}
}
