import { Animate } from './../../_helpers/fadeAnimation';
import { AppointmentList } from './../../_models/appointment.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-booked-slots',
  templateUrl: './booked-slots.component.html',
  styleUrls: ['./booked-slots.component.scss'],
  animations: [Animate],
})
export class BookedSlotsComponent implements OnInit {
  @Input('date') dt: string | Date;
  @Input() appointments: AppointmentList[];
  constructor() {}

  ngOnInit(): void {}
}
