import { ApiService } from 'src/app/_services';
import { Component, OnInit } from '@angular/core';
import { Specialties } from 'src/app/_models';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-specialty-edit',
  templateUrl: './specialty-edit.component.html',
  styleUrls: ['./specialty-edit.component.scss'],
})
export class SpecialtyEditComponent implements OnInit {
  specialties: Specialties[];
  id: number;
  addId: number;
  delId: number;
  editData = { categoryId: -1, specialtyId: -1, specialtyName: '' };
  addData = { categoryId: -1, specialtyId: 0, specialtyName: '' };

  constructor(
    private client: ApiService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.client.getSpecialties().subscribe((res) => {
      this.specialties = res;
    });
  }
  add() {
    this.addData.categoryId = this.addId;
    this.client.postSpecialty(this.addData).subscribe((res) => {
      console.log(res);
      this.addData = { categoryId: -1, specialtyId: 0, specialtyName: '' };
      this.loadData();
      this.message.success('Success', 'Specialty successfully added');
    });
    this.addId = -1;
  }
  edit() {
    this.client.putSpecialty(this.id, this.editData).subscribe((res) => {
      this.editData = {
        categoryId: -1,
        specialtyId: -1,
        specialtyName: '',
      };
      this.loadData();
    });
    this.id = -1;
  }

  editValue(cId: number, id: number, name: string) {
    this.id = id;
    this.editData.specialtyName = name;
    this.editData.categoryId = cId;
    this.editData.specialtyId = id;
  }

  delete() {
    this.client.deleteSpecialty(this.delId).subscribe((res) => {
      this.loadData();
      this.message.success('Success', 'Specialty successfully deleted');
    });
  }
}
