import { Fader, Animate, SafeData } from 'src/app/_helpers';
import { TokenStorageService } from 'src/app/_services';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
  animations: [Fader, Animate],
})
export class AppointmentComponent implements OnInit, SafeData {
  doctor = this.token.getDoctor();
  isTreatment: boolean;
  isDateTimeSelector: boolean;

  isChanged: boolean;

  selectorData: any;
  treatmentData: any;

  constructor(private token: TokenStorageService) {}

  ngOnInit(): void {}

  isDataSaved() {
    return this.isChanged;
  }

  getSelector(data: any) {
    this.selectorData = data.exceptionDates;
    this.isDateTimeSelector = data.isSelector;
  }
  getTreatment(data: any) {
    this.treatmentData = data.treatments;
    this.isTreatment = data.isTreatment;
  }
}
