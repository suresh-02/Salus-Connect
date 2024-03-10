import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Animate, DataService } from 'src/app/_helpers';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [Animate],
})
export class RegisterComponent implements OnInit {
  isAddressForm = true;
  registerType: string = 'individual';
  isHeader = true;
  id = -1;

  constructor(public route: ActivatedRoute, private data: DataService) {}

  ngOnInit(): void {
    let params = this.route.snapshot.params;
    this.registerType = String(this.route.firstChild?.routeConfig?.path);
    if (params.id) {
      this.id = params.id;
      this.isAddressForm = false;
    }
    this.data.fromParent({
      id: this.id,
      registerType: this.registerType,
    });
    this.data.receiveFromChild().subscribe((data) => {
      this.isAddressForm = !data.isAddressForm;
      this.isHeader = !data.isHeader;
      this.registerType = String(this.route.firstChild?.routeConfig?.path);
    });
  }
}
