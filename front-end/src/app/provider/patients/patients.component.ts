import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Patient } from 'src/app/_models';
import { ApiService } from '../../_services';
import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];

  loading = true;
  debounce: any;

  total: number;
  pageSize = 10;
  pageIndex = 1;
  sortField = '';
  sortDirection = '';
  _search = '';

  public get search(): string {
    return this._search;
  }

  public set search(v: string) {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      this._search = v;
      this.loadPatient();
    }, 300);
  }

  constructor(
    private client: ApiService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {}

  trackByFunction = (index: number, patient: Patient) => {
    return patient.userId;
  };

  loadPatient() {
    this.client
      .getAllPatient(
        this.pageIndex,
        this.pageSize,
        this.sortField,
        this.sortDirection,
        this.search
      )
      .subscribe((res) => {
        this.patients = res.data;
        this.total = res.rows;
        this.loading = false;
        console.log(res);
      });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '';
    let sortOrder = (currentSort && currentSort.value) || '';
    sortOrder =
      sortOrder === 'ascend' ? 'asc' : sortOrder === 'descend' ? 'desc' : '';

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.sortField = sortField;
    this.sortDirection = sortOrder;
    this.loadPatient();
  }

  changeStatus(id: number, status: boolean) {
    let statusString = status ? 'Active' : 'Inactive';
    this.client.updatePatientStatus(id, statusString).subscribe((res) => {
      this.message.success('Success', `Provider ${statusString} successfully`);
    });
  }
}
