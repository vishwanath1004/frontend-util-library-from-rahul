import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GenericTableService } from '../../generic-table.service';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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
  sortType ="ASC";
  sortColumn: any;
  columns :any= [];
  isDownload :boolean = false;
  noData:boolean = false;
  data :any= [];
  searchColmn :any =[]
  searchText :any =[]
  filterColmn :any =[]
  filterText :any =[]
  options = [{ label: 'Lable 1', value: 'label1' }, { label: 'Lable 1', value: 'label1' }];
  showPopup = false;
  startDate: any;
  endDate: any;
  dateError = false;

  private searchSubject = new Subject<{ event: any, key: any }>();

  constructor(private apiService: GenericTableService, private dialog: MatDialog,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    console.log("getTableData == ngOnInit");
    setTimeout(() => {
      this.url +=`&search_column=${this.searchColmn}&search_value=${this.searchText}&sort_column=${this.sortColumn}&sort_type=${this.sortType}&filter_column=${this.filterColmn}&filter_value=${this.filterText}&download_csv=${this.isDownload}`;
      this.getTableData(this.url);
    }, 100);

    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(({ event, key }) => {
      this.performSearch(event, key);
    });
  }

  getTableData(apiUrl:any) {
    const paylaod = { url: apiUrl, headers: this.headers }
    this.apiService.get(paylaod).then((data: any) => {
      if (data.result?.data) {
        this.isDownload = false;
        this.columns = data.result.config ? data.result.config.columns :[];
        this.data = data.result.data ? data.result.data : []; 
        this.initializeTable();
      }
    })
  }

  onSort(data: any) {
    this.sortColumn = data;
    this.sortType = this.sortType === "ASC" ? "DESC" : "ASC";
    this.getTableData(this.url);
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  initializeTable(): void {
    this.dataSource.data = this.data;
    if(this.data?.length){
      this.displayedColumns = Object.keys(this.data[0]);
    }
  }

  getHeaderLabel(columnKey: string): string {
    const column = this.columns.find((col: any) => col.key === columnKey);
    return column ? column.label : columnKey;
  }

  filteredData = [...this.data];

  onSearch(event: any, key: any) {
    this.searchSubject.next({ event, key });
  }

  performSearch(event: any, key: any) {
    if (event.target.value && !this.searchColmn.includes(key)) {
      this.searchColmn.push(key);
      this.searchText.push(event.target.value);
    }
    if (!event.target.value) {
      const index = this.searchColmn.indexOf(key);
      if (index > -1) {
        this.searchColmn.splice(index, 1); 
        this.searchText.splice(index, 1); 
      }
    }
    this.url = this.url.replace(/search_column=[^&]*/, `search_column=${this.searchColmn}`);
    this.url = this.url.replace(/search_value=[^&]*/, `search_value=${ this.searchText}`);
    this.getTableData(this.url);
  }

  onFilter(event: any, key: string) {
    const value = event.value;
    if (value.length && !this.filterColmn.includes(key)) {
      this.filterColmn.push(key);
      this.filterText.push(value);
    }else 
    if(value.length && this.filterColmn.includes(key)){
      this.filterText.push(value);
    }else 
    if (!value?.length) {
      const index = this.filterColmn.indexOf(key);
      if (index > -1) {
        this.filterColmn.splice(index, 1); 
        this.filterText.splice(index, 1); 
      }
    }
    this.url = this.url.replace(/filter_column=[^&]*/, `filter_column=${this.filterColmn}`);
    this.url = this.url.replace(/filter_value=[^&]*/, `filter_value=${ this.filterText}`);
    this.getTableData(this.url);
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
      const startDateEpoch = this.startDate.getTime() / 1000;
      const endDateEpoch = this.endDate.getTime() / 1000;
      this.downloadCSV(startDateEpoch,endDateEpoch);
    }
  }
  downloadCSV(startDate :any, endDate:any){
    this.url =  this.url.replace(/start_date=[^&]*/, `start_date=${startDate}`);
    this.url =  this.url.replace(/end_date=[^&]*/, `end_date=${endDate}`);
    this.url =  this.url.replace(/download_csv=[^&]*/, `download_csv=true`);
    this.apiService.get({url :  this.url, headers: this.headers}).then((data:any)=>{  
      if(data.result && data.result.reportsDownloadUrl){
        this.noData = false;

        const link = document.createElement('a');
        link.href = data.result.reportsDownloadUrl;
        const timestamp: number = new Date().getTime();
        link.download = `${this.title}${timestamp}.csv`; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.closePopup();
      }else{
        this.noData = true;
      }
    })
  }
  formatDate(date: Date | null): string {
    return date ? this.datePipe.transform(date, 'dd/MM/yyyy') || '' : '';
  }
}
