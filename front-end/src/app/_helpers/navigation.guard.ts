import { Injectable } from '@angular/core';
import { CanDeactivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { NzModalService } from 'ng-zorro-antd/modal';
export interface SafeData {
  isDataSaved(): boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NavigationGuard implements CanDeactivate<SafeData> {
  constructor(private modal: NzModalService) {}
  canDeactivate(
    component: SafeData
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!component.isDataSaved()) {
      return true;
    }

    return new Promise((resolve, reject) => {
      this.modal.confirm({
        nzTitle: 'Unsaved Changes',
        nzContent:
          'You have unsaved changes. If you leave this page without Saving, changes will be lost. Do you want to proceed?',
        nzOnOk: () => {
          resolve(true);
        },
        nzOnCancel: () => {
          resolve(false);
        },
      });
    });
  }
}
