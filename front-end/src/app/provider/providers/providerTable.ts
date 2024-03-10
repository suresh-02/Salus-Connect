import { NzTableSortOrder } from 'ng-zorro-antd/table';

interface ColumnItem {
  name: string;
  sortField: string;
  sortOrder: NzTableSortOrder | null;
  sortDirections: NzTableSortOrder[];
  width: string;
}

export let providerColumns: ColumnItem[] = [
  {
    name: 'Provider Name',
    sortField: 'providerName',
    sortOrder: 'ascend',
    sortDirections: ['ascend', 'descend', null],
    width: '195px',
  },
  {
    name: 'City',
    sortField: 'city',
    sortOrder: null,
    sortDirections: ['ascend', 'descend', null],
    width: '173px',
  },
  {
    name: 'State',
    sortField: 'stateAbbr',
    sortOrder: null,
    sortDirections: ['ascend', 'descend', null],
    width: '194px',
  },
  {
    name: 'Date Created',
    sortField: 'dateCreated',
    sortOrder: null,
    sortDirections: ['ascend', 'descend', null],
    width: '194px',
  },
  {
    name: 'Payment Type',
    sortField: 'paymentType',
    sortOrder: null,
    sortDirections: [null],
    width: '194px',
  },
  {
    name: 'Type',
    sortField: 'providerType',
    sortOrder: null,
    sortDirections: [null],
    width: '98px',
  },
  {
    name: 'Specialty',
    sortField: 'specialtyName',
    sortOrder: null,
    sortDirections: [null],
    width: '106px',
  },
  {
    name: 'Doctors',
    sortField: 'doctors',
    sortOrder: null,
    sortDirections: [null],
    width: '71px',
  },
  {
    name: 'Status',
    sortField: 'status',
    sortOrder: null,
    sortDirections: [null],
    width: '107px',
  },
];
