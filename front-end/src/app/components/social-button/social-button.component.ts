import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-social-button',
  templateUrl: './social-button.component.html',
  styleUrls: ['./social-button.component.scss'],
})
export class SocialButtonComponent implements OnInit {
  @Input('sign') sign: string;
  constructor() {}

  ngOnInit(): void {}
}
