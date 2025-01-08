import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GenericTableService } from '../../generic-table.service';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'lib-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() url: any;
  @Input() headers: any;
  @Input() labels: any;
  @Input() legends: any;
  @Input() showDownload: boolean = true;
  @Input() title: any = true;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];

  columns = [
    { key: 'id', label: 'Id', search: true, filter: false },
    { key: 'name1', label: 'Name', search: true, filter: false },
    { key: 'age', label: 'Age', search: false, filter: true },
    { key: 'department', label: 'Department Name', search: false, filter: true },
    { key: 'salaryAmount', label: 'Salary Amount', search: false, filter: true },
  ];

  data = [
    { id: 'abc', name1: 'Alice', age: 25, department: 'Engineering', salaryAmount: 2500 },
    { id: 2, name1: 'Bob', age: 30, department: 'Marketing', salaryAmount: 3000 },
    { id: 3, name1: 'Charlie', age: 35, department: 'HR', salaryAmount: 2800 },
    { id: 4, name1: 'Dave', age: 28, department: 'Finance', salaryAmount: 3200 },
  ];

  options = [{ label: 'Lable 1', value: 'label1' }, { label: 'Lable 1', value: 'label1' }];
  showPopup = false;
  startDate: any;
  endDate: any;
  dateError = false;

  constructor(private apiService: GenericTableService, private dialog: MatDialog) { }

  ngOnInit(): void {
    console.log("getTableData == ngOnInit");
    setTimeout(() => {
      this.getTableData();
    }, 100);
  }

  getTableData() {
    const paylaod = { url: this.url, headers: this.headers }
    this.apiService.get(paylaod).then((data: any) => {
      if (data.result) {
        // this.columns = data.result.config ? data.result.config.columns :[];
        // this.data = data.result.data ? data.result.data : []; 
        this.initializeTable();
      }
    })
  }

  onSort(data: any) {
    console.log("on sort", data);
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  initializeTable(): void {
    this.dataSource.data = this.data;
    this.displayedColumns = Object.keys(this.data[0]);
  }

  getHeaderLabel(columnKey: string): string {
    const column = this.columns.find((col: any) => col.key === columnKey);
    return column ? column.label : columnKey;
  }

  filteredData = [...this.data];

  onSearch(event: any, key: string) {
    const value = event.target.value.toLowerCase();
    this.filteredData = this.data.filter((item: any) =>
      item[key].toString().toLowerCase().includes(value)
    );
  }

  onFilter(event: any, key: string) {
    const value = event.target.value;
    this.filteredData = value
      ? this.data.filter((item: any) => item[key].toString() === value)
      : [...this.data];
  }

  getFilterOptions(key: string) {
    return [{ label: 'Lable 1', value: 'label1' }, { label: 'Lable 1', value: 'label1' }];
  }

  isSearchable(columnKey: any) {
    const column = this.columns.find((col: any) => col.key === columnKey);
    return column?.search
  }
  isFilterable(columnKey: any) {
    const column = this.columns.find((col: any) => col.key === columnKey);
    return column?.filter
  }

  openPopup() {
    console.log("openPopup");
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }

  validateDates() {
    if (this.startDate && this.endDate) {
      this.dateError = this.endDate < this.startDate;
    } else {
      this.dateError = false;
    }
  }

  submitDates() {
    if (!this.dateError) {
      // const startEpoch = moment(this.startDate).unix();
      // const endEpoch = moment(this.endDate).unix();
      console.log('Start Date (Epoch):', this.startDate);
      console.log('End Date (Epoch):', this.endDate);
      this.closePopup();
    }
  }
}
