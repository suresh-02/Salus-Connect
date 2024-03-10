import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Fader } from '../_helpers';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  animations: [Fader],
})
export class LandingPageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  search(data: any) {
    this.router.navigateByUrl('/search-doctor', { state: data });
  }
}
