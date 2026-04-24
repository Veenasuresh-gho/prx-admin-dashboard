import {
  Component,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  inject,
  Input
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
import { HttpClient } from '@angular/common/http';
import { AddTenentUser } from './add-tenent-user/add-tenent-user';
import { AddTenantDoctor } from './add-tenant-doctor/add-tenant-doctor';
import { AddTenantSpeciality } from './add-tenant-speciality/add-tenant-speciality';

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
    TenantDetails,
    AddTenentUser,AddTenantDoctor,AddTenantSpeciality
  ],
  templateUrl: './doctor.html'
})
export class HospitalList implements AfterViewInit {

  srv = inject(GHOService);

  constructor(private cdr: ChangeDetectorRef,private http: HttpClient) { }

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
  searchTimeout: any;
   tenantTypes: any[] = [];
   selectedTenantType: any = null;
   selectedSpecialty: any = null;


  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() refreshTrigger: number = 0;

  

  ngOnInit(): void {
    this.getcntry();
    this.list();
    this.getTenantType();
    // this.filterTenants();
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

onEditSpecialty(sp: any) {
  console.log('From child:', sp);

  this.selectedSpecialty = sp;

  this.switchToSpecialtyTab();
}
switchToSpecialtyTab() {
  this.tbidx = 3;
}

onTenantTypeChange(value: any) {
  if (!value) return;
  // this.list(); 

  this.filterTenants();
}

refreshDetailsTrigger = 0;

onUserAdded() {
  this.tbidx = 1;          // switch to Tenant Details tab
  this.refreshTrigger++;   // trigger refresh in child
}

filterTenants() {

  this.loading = true;

  this.tv = [
    { T: 'dk1', V: this.fltr || '' },              // search (tenant name)
    { T: 'dk2', V: '' },                          // location (update if needed)
    { T: 'c1', V: this.selectedTenantType },      // tenant type
    { T: 'c10', V: '18' }                          // API mode
  ];

  this.srv.getdata('Tenants', this.tv).subscribe(r => {
    this.loading = false;

    console.log("FILTER RESPONSE:", r);

    if (r.Status === 1) {
      this.dataSource.data = r.Data[0];
      this.cdr.detectChanges();
    } else {
      this.dataSource.data = [];
    }
  });
}

  getTenantType() {
    this.tv = [{ T: 'c10', V: '1' }];

    this.srv.getdata('Tenants', this.tv).subscribe(r => {
      if (r.Status === 1) {
        this.tenantTypes = r.Data[0];
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
applySearch() {
  clearTimeout(this.searchTimeout);

  this.searchTimeout = setTimeout(() => {

    if (!this.fltr || this.fltr.trim() === '') {
      this.list(); // reset to full list
      return;
    }

    this.searchTenants(this.fltr);

  }, 500);
}
searchTenants(searchText: string) {

  this.loading = true;

  this.tv = [
    { T: 'dk1', V: searchText },     
    { T: 'c10', V: '17' }           
  ];

  this.srv.getdata('Tenants', this.tv).subscribe(r => {
    this.loading = false;

    if (r.Status === 1) {
      this.dataSource.data = r.Data[0];
      this.cdr.detectChanges();
    } else {
      this.dataSource.data = [];
    }
  });
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
onTenantUpdated(){
  this.list();
  // to go back to tab
  this.tbidx = 0;

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