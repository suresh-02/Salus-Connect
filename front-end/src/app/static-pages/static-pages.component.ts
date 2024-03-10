import { RouterOutlet } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-static-pages',
  template: `<app-header></app-header>
    <div class="provider pt-20" [@fade]="prepareRoute(outlet)">
      <div class="z-0">
        <router-outlet #outlet="outlet"></router-outlet>
      </div>
    </div>
    <app-footer></app-footer>`,
  animations: [
    trigger('fade', [
      transition('* <=> *', [style({ opacity: 0 }), animate(500)]),
    ]),
  ],
})
export class StaticPagesComponent implements OnInit {
  prepareRoute(outlet: RouterOutlet) {
    return outlet.activatedRoute.snapshot.url;
  }
  constructor() {}

  ngOnInit(): void {}
}
