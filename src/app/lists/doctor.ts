import {
  Component,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddTenant } from './add-tenant/add-tenant';
import { TenantDetails } from './tenant-details/tenant-details';

import { GHOService } from '../services/ghosrvs';
import { tags } from '../model/ghomodel';
import { GHOdropdown, GHOInput } from "sk-ghocomps";

@Component({
  selector: 'admin-doctors',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    GHOdropdown,
    GHOInput,
    MatTabsModule,
    MatProgressSpinnerModule,
    AddTenant,
    TenantDetails
  ],
  templateUrl: './doctor.html'
})
export class HospitalList implements AfterViewInit {

  srv = inject(GHOService);

  constructor(private cdr: ChangeDetectorRef) { }

  tv: tags[] = [];
  cntrys: any[] = [];
  tbidx: number = 0;
  loading: boolean = false;
  selectedTenant: any = null;
  detailsTabEnabled: boolean = false;

  hospitalList: any[] = [];
  dataSource = new MatTableDataSource<any>();
  columns: string[] = ['Name', 'Location', 'Phone', 'Address', 'Type', 'Status'];

  cn: string = '0';
  fltr: string = '';

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getcntry();
    this.list();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  selectTenant(row: any) {
  this.selectedTenant = row;
  this.detailsTabEnabled = true;
  this.tbidx = 1;
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  get(e: MatSelectChange) {
    this.cn = e.value;
    this.list();
  }

  getc(e: any) {
    this.cn = e;
    this.list();
  }

  getcntry() {
    this.tv = [{ T: 'c10', V: '83' }];

    this.srv.getdata('lists', this.tv).subscribe(r => {
      if (r.Status === 1) {
        this.cntrys = r.Data[0];
      }
    });
  }


  list() {
    this.loading = true;

    this.tv = [
      { T: 'c1', V: this.cn },
      { T: 'c10', V: '11' }
    ];

    this.srv.getdata('Tenants', this.tv).subscribe(r => {
      this.loading = false;

      if (r.Status === 1) {
        this.hospitalList = r.Data[0];
        this.dataSource.data = this.hospitalList;

        this.cdr.detectChanges();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }
}