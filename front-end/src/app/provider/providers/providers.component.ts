import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { providerColumns } from './providerTable';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { Provider } from '../../_models';
import { InOut } from 'src/app/_helpers';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/_services';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss'],
  animations: [InOut],
})
export class ProvidersComponent implements OnInit {
  providers: Provider[] = [];
  cols = providerColumns;
  loading = true;

  providerId: number;
  providerType: string;
  providerStatus: string;
  status: any = {
    Active: 'activated',
    Inactive: 'deactivated',
    Published: 'info published',
    Invited: 'invited',
  };

  _search = '';
  pageSize = 10;
  pageIndex = 1;
  total: number;
  sortField: string;
  sortOrder: string;

  viewId: number;
  viewType: string;
  showModal = false;

  listOfCurrentPageData: readonly Provider[] = [];
  checked = false;
  indeterminate = false;
  setOfCheckedId: string[] = [];
  @ViewChild('progress', { static: false }) template?: TemplateRef<{}>;
  percent: string;

  debounce: any;

  public get search(): string {
    return this._search;
  }

  public set search(v: string) {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      this._search = v;
      this.loadProvider();
    }, 300);
  }

  constructor(
    private message: NzNotificationService,
    private toast: NzMessageService,
    private client: ApiService
  ) {}

  ngOnInit(): void {}

  loadProvider() {
    this.loading = true;
    this.client
      .getProviders(
        this.pageIndex,
        this.pageSize,
        this.sortField,
        this.sortOrder,
        this.search
      )
      .subscribe(
        (res) => {
          console.log(res);
          this.providers = res.data;
          this.total = res.rows;
          this.loading = false;
        },
        (err) => {
          this.loading = false;
        }
      );
  }

  //! For provider table
  trackByFunction = (index: number, provider: Provider) => {
    return provider.providerId;
  };
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
    this.sortOrder = sortOrder;
    this.loadProvider();
  }
  next(dt: any) {
    this.pageSize = dt.nzPageSize;
    this.pageIndex = dt.nzPageIndex + 1;
  }
  prev(dt: any) {
    this.pageSize = dt.nzPageSize;
    this.pageIndex = dt.nzPageIndex - 1;
  }
  //! For selection in provider table
  onCurrentPageDataChange(listOfCurrentPageData: readonly Provider[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }
  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.push(id);
    } else {
      this.setOfCheckedId = this.setOfCheckedId.filter((cid) => cid !== id);
    }
  }
  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(
      ({ providerId, providerType }) =>
        this.setOfCheckedId.includes(`${providerId}${providerType[0]}`)
    );
    this.indeterminate =
      this.listOfCurrentPageData.some(({ providerId, providerType }) =>
        this.setOfCheckedId.includes(`${providerId}${providerType[0]}`)
      ) && !this.checked;
  }
  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }
  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach(({ providerId, providerType }) =>
      this.updateCheckedSet(`${providerId}${providerType[0]}`, checked)
    );
    this.refreshCheckedStatus();
  }
  getSelected(): Provider[] {
    this.loading = true;
    return this.providers.filter((data, index) =>
      this.setOfCheckedId.includes(`${data.providerId}${data.providerType[0]}`)
    );
  }
  onSelectedFunctionFinish(
    msgId: string,
    isLoadProvider: boolean,
    calls: number
  ) {
    const selectedProviders = this.getSelected();
    this.percent = ((calls * 100) / selectedProviders.length).toFixed(0);
    // console.log(this.percent, calls);
    if (calls === selectedProviders.length) {
      this.loading = false;
      this.message.remove(msgId);
      this.percent = '0';
      this.setOfCheckedId = [];
      this.refreshCheckedStatus();
      if (isLoadProvider) this.loadProvider();
    }
  }

  findStatus(
    activeD: number | undefined,
    doctorC: number | undefined,
    status: string
  ) {
    if (activeD === 0) {
      return status;
    } else if (activeD === doctorC) {
      return status.toLocaleLowerCase() == 'invited' ? 'Active' : status;
    } else {
      return 'In Progress';
    }
  }

  sendInviteSelected() {
    const requestData = this.getSelected();
    let msgId = this.message.template(this.template!, {
      nzData: 'Sending invite to',
      nzDuration: 0,
    }).messageId;
    let calls = 0;
    requestData.forEach((provider) => {
      this.client
        .sendInviteToProvider({
          id: provider.providerId,
          providerType: provider.providerType,
        })
        .subscribe((res) => {
          calls += 1;
          this.onSelectedFunctionFinish(msgId, false, calls);
        });
    });
  }

  activateProvider(status: string) {
    this.client
      .updateProviderStatus(this.providerType, this.providerId, status)
      .subscribe(() => {
        this.loadProvider();
        this.message.success(
          'Success',
          `Provider ${this.status[status]} successfully`
        );
      });
  }

  sendInvite() {
    const id = this.toast.loading('Action in progress..', {
      nzDuration: 0,
    }).messageId;

    this.client
      .sendInviteToProvider({
        id: this.providerId,
        providerType: this.providerType,
      })
      .subscribe(
        (res) => {
          this.toast.remove(id);
          this.message.success('Success', 'Invite sent successfully');
          this.loadProvider();
        },
        (err) => {
          this.toast.remove(id);
        }
      );
  }

  setData(data: any) {
    const { pId, pType, status, pTypeConversion } = data;
    if (pId) this.providerId = pId;
    if (status) this.providerStatus = status;
    if (pType) {
      if (pTypeConversion) {
        if (pType.toLowerCase() === 'individual') this.providerType = 'doctors';
        else this.providerType = 'facilities';
      } else this.providerType = pType;
    }
  }

  deleteProvider() {
    this.client
      .deleteProviders(this.providerType.toLowerCase(), this.providerId)
      .subscribe(() => {
        this.loadProvider();
        this.message.success('Success', 'Provider deleted successfully');
      });
  }

  viewProvider(id: number, type: string) {
    this.viewId = id;
    this.viewType = type;
    this.showModal = true;
  }
}
