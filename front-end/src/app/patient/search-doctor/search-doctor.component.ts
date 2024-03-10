import { environment } from './../../../environments/environment';
import { formatDate } from '@angular/common';
import { Fader, sortTimeArray, addMinute } from 'src/app/_helpers';
import { Component, OnInit } from '@angular/core';
import { ApiService, TokenStorageService } from 'src/app/_services';
import { Router } from '@angular/router';
import { SearchDoctor, Treatment } from 'src/app/_models';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface Filter {
  label: string;
  value: string;
  checked: boolean;
}
@Component({
  selector: 'app-search-doctor',
  templateUrl: './search-doctor.component.html',
  styleUrls: ['./search-doctor.component.scss'],
  animations: [Fader],
})
export class SearchDoctorComponent implements OnInit {
  public Editor = ClassicEditor;

  environment = environment;
  addMinute = addMinute;
  initialSearch = this.router.getCurrentNavigation()?.extras.state;
  tempDoctorData: SearchDoctor[] = [];
  doctorData: SearchDoctor[] = [];
  isOpen = false;

  availableSlots: string[] = [];
  isSeeMore = false;

  searchData: any;
  loading = false;

  facilityName: Filter[] = [];
  distance: string;

  treatments: { doctorId: number; treatment: Treatment }[] = [];

  isSelected = (id: number, treatment: Treatment) => {
    return this.treatments.filter(
      (t) =>
        t.doctorId == id && t.treatment.treatmentId == treatment.treatmentId
    );
  };

  selectedTreatment = (id: number): Treatment => {
    return this.treatments?.filter((t) => t.doctorId == id)[0]?.treatment;
  };

  constructor(
    private router: Router,
    private client: ApiService,
    private token: TokenStorageService
  ) {}

  ngOnInit(): void {}

  searchDoctor(data: any) {
    this.searchData = data;
    this.token.removeSearched();
    this.token.saveSearched(data);
    let city = data.selectedCity?.split(',');
    this.loading = true;
    let searchData: any = {
      specialty: data.selectedSpecialtyOrProvider,
      date: data.selectedDate,
    };
    if (city) {
      searchData = { ...searchData, city: city[0], province: city[1] };
    }
    this.client.searchProvider(searchData).subscribe((res) => {
      this.treatments = [];
      res.map((doctor) => {
        if (doctor.treatments?.length === 1) {
          doctor.treatments[0].isDefault = true;
        }
        doctor.treatments?.map((t) => {
          let id = doctor.id;
          if (t.isDefault) {
            this.treatments.push({ doctorId: id, treatment: t });
          }
        });

        doctor.isAvailable = doctor.slots?.filter((s, sId) => {
          if (
            formatDate(s.date, 'yyyy-MM-dd', 'en') ===
            formatDate(data.selectedDate, 'yyyy-MM-dd', 'en')
          ) {
            return (
              formatDate(s.date, 'yyyy-MM-dd', 'en') ===
              formatDate(data.selectedDate, 'yyyy-MM-dd', 'en')
            );
          } else return null;
        })[0];

        doctor.slots?.map((slot) => {
          slot.times = sortTimeArray(slot.times);
        });

        if (doctor.isAvailable) {
          doctor.isAvailable.times = sortTimeArray(doctor.isAvailable.times);
        }

        if (doctor.slots?.includes(doctor.isAvailable)) {
          let id = doctor.slots.indexOf(doctor.isAvailable);
          doctor.slots.splice(id, 1);
        }

        // console.log(this.facilityName);
        if (this.facilityName.length === 0 && doctor.facilityName) {
          this.facilityName.push({
            label: doctor.facilityName,
            value: doctor.facilityName,
            checked: false,
          });
        } else {
          this.facilityName.forEach((facility) => {
            if (facility.label !== doctor.facilityName && doctor.facilityName) {
              this.facilityName.push({
                label: doctor.facilityName,
                value: doctor.facilityName,
                checked: false,
              });
            }
          });
        }
      });
      // console.log('searchProvider', res);
      this.doctorData = res;
      this.tempDoctorData = res;
      this.loading = false;
    });
  }

  selectTreatment(id: number, t: Treatment) {
    if (this.isSelected(id, t).length <= 0)
      this.client
        .searchTreatmentSlot(
          id,
          t.treatmentId ? t.treatmentId : -1,
          formatDate(this.searchData.selectedDate, 'yyyy-MM-dd', 'en')
        )
        .subscribe((res) => {
          this.doctorData.forEach((d) => {
            if (d.id == id) {
              d.slots = res;
              d.isAvailable = d.slots?.filter((s, sId) => {
                if (
                  formatDate(s.date, 'yyyy-MM-dd', 'en') ===
                  formatDate(this.searchData.selectedDate, 'yyyy-MM-dd', 'en')
                ) {
                  return (
                    formatDate(s.date, 'yyyy-MM-dd', 'en') ===
                    formatDate(this.searchData.selectedDate, 'yyyy-MM-dd', 'en')
                  );
                } else return null;
              })[0];

              d.slots?.map((slot) => {
                slot.times = sortTimeArray(slot.times);
              });

              if (d.isAvailable) {
                d.isAvailable.times = sortTimeArray(d.isAvailable.times);
              }

              if (d.slots?.includes(d.isAvailable)) {
                let id = d.slots.indexOf(d.isAvailable);
                d.slots.splice(id, 1);
              }
            }
          });
        });
    this.treatments.forEach((treatment) => {
      if (treatment.doctorId == id) treatment.treatment = t;
    });
  }

  saveFilter() {
    let checked = this.facilityName.filter((fac) => {
      if (fac.checked) return fac;
      else return null;
    });
    console.log('SaveFilter', checked);

    if (checked.length <= 0) {
      console.log('0');
      this.doctorData = this.tempDoctorData;
    } else {
      console.log('>1');
      let filtered: SearchDoctor[] = [];
      this.tempDoctorData.map((doc) => {
        checked.filter((fac) => {
          if (doc.facilityName === fac.value) {
            filtered.push(doc);
          }
        });
      });
      this.doctorData = filtered;
    }
    this.isOpen = false;
  }

  clear() {
    this.doctorData = this.tempDoctorData;
    this.facilityName.forEach((fac) => {
      fac.checked = false;
    });
    this.isOpen = false;
  }

  route(id: number, date?: string, time?: string) {
    let selectedTreatment = this.treatments.filter((t) => t.doctorId === id)[0];
    let q: string = '';
    if (date && time)
      q = window.btoa(
        `dId=${id}&dt=${date}&time=${time}&tId=${selectedTreatment.treatment.treatmentId}`
      );
    else q = window.btoa(`dId=${id}`);
    this.router.navigate(['/doctor'], {
      queryParams: {
        q,
      },
    });
  }
}
