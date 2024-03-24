import { NavigationEnd, Router } from '@angular/router';
import { Component, isDevMode, OnInit } from '@angular/core';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  template: ` <router-outlet #outlet="outlet"></router-outlet> `,
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  title = 'salusconnect';

  ngOnInit(): void {
    console.log(`appVersion: ${environment.appVersion}`);
    if (!isDevMode()) {
      this.setUpAnalytics();
    }
  }

  setUpAnalytics() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        gtag('config', 'G-XC3WY1Q0FV', {
          page_path: event.urlAfterRedirects,
        });
      });
  }
}
