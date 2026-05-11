import {
  Component,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  inject,
  Input,
  ElementRef,
  OnInit,
  NgZone
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatTableModule,
  MatTableDataSource
} from '@angular/material/table';

import {
  MatPaginator,
  MatPaginatorModule
} from '@angular/material/paginator';

import {
  MatSort,
  MatSortModule
} from '@angular/material/sort';

import {
  MatSelectChange,
  MatSelectModule
} from '@angular/material/select';

import { MatTabsModule } from '@angular/material/tabs';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import { MatInputModule } from '@angular/material/input';

import { HttpClient } from '@angular/common/http';

import { ActivatedRoute } from '@angular/router';

import { AddTenant } from './add-tenant/add-tenant';
import { TenantDetails } from './tenant-details/tenant-details';
import { AddTenentUser } from './add-tenent-user/add-tenent-user';
import { AddTenantDoctor } from './add-tenant-doctor/add-tenant-doctor';
import { AddTenantSpeciality } from './add-tenant-speciality/add-tenant-speciality';

import { GHOService } from '../services/ghosrvs';

import { tags } from '../model/ghomodel';

import {
  GHOdropdown,
  GHOInput
} from 'sk-ghocomps';

declare var google: any;

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
    MatTabsModule,
    MatProgressSpinnerModule,
    MatInputModule,

    GHOdropdown,
    GHOInput,

    AddTenant,
    TenantDetails,
    AddTenentUser,
    AddTenantDoctor,
    AddTenantSpeciality
  ],

  templateUrl: './doctor.html'
})

export class HospitalList
  implements OnInit, AfterViewInit {

  // =========================
  // INJECT
  // =========================

  srv = inject(GHOService);

  route = inject(ActivatedRoute);

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private ngZone: NgZone
  ) { }

  // =========================
  // TABLE
  // =========================

  dataSource =
    new MatTableDataSource<any>();

  columns: string[] = [
    'Name',
    'Location',
    'Phone',
    'Address',
    'Type',
    'Status'
  ];

  hospitalList: any[] = [];

  // =========================
  // DATA
  // =========================

  tv: tags[] = [];

  cntrys: any[] = [];

  tenantTypes: any[] = [];

  // =========================
  // STATE
  // =========================

  tbidx: number = 0;

  loading: boolean = false;

  detailsTabEnabled: boolean = false;

  selectedTenant: any = null;

  selectedTenantType: any = null;

  selectedSpecialty: any = null;

  // =========================
  // SEARCH
  // =========================

  fltr: string = '';

  searchTimeout: any;

  cn: string = '0';

  // =========================
  // LOCATION
  // =========================

  locationSearch: string = '';

  selectedCity: string = '';

  // =========================
  // VIEWCHILD
  // =========================

  @ViewChild('paginator')
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild('locationInput')
  locationInput!: ElementRef;

  @Input()
  refreshTrigger: number = 0;

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.getcntry();

    this.getTenantType();

    this.route.queryParams.subscribe(params => {

      const typeId = params['typeId'];

      if (typeId) {

        this.selectedTenantType = +typeId;

        this.filterTenants();

      } else {

        this.list();

      }

    });

  }

  // =========================
  // AFTER VIEW INIT
  // =========================

  async ngAfterViewInit(): Promise<void> {

    this.dataSource.paginator =
      this.paginator;

    this.dataSource.sort =
      this.sort;

    // LOAD GOOGLE MAPS

    await this.srv.loadGoogleMaps();

    // AUTOCOMPLETE

    const autocomplete =
      new google.maps.places.Autocomplete(
        this.locationInput.nativeElement,
        {
          types: ['geocode'],

          componentRestrictions: {
            country: 'in'
          },

          fields: [
            'address_components',
            'formatted_address',
            'name'
          ]
        }
      );

    // FIX SLOW UI

    autocomplete.addListener(
      'place_changed',
      () => {

        this.ngZone.run(() => {

          const place =
            autocomplete.getPlace();

          console.log(place);

          // DEFAULT VALUE

          let cityName =
            place.name || '';

          // GET BETTER AREA NAME

          if (place.address_components) {

            for (const comp of place.address_components) {

              // LOCALITY

              if (
                comp.types.includes('locality')
              ) {

                cityName =
                  comp.long_name;

                break;
              }

              // SUBLOCALITY (Edappally etc)

              if (
                comp.types.includes('sublocality') ||
                comp.types.includes('sublocality_level_1')
              ) {

                cityName =
                  comp.long_name;

                break;
              }

            }

          }

          // SET INPUT VALUE

          this.locationSearch =
            cityName;

          this.selectedCity =
            cityName;

          // FAST FILTER

          this.filterTenants();

        });

      }
    );
  }

  // =========================
  // SELECT TENANT
  // =========================

  selectTenant(row: any) {

    this.selectedTenant = row;

    this.detailsTabEnabled = true;

    this.tbidx = 1;

  }

  // =========================
  // SPECIALTY
  // =========================

  onEditSpecialty(sp: any) {

    this.selectedSpecialty = sp;

    this.switchToSpecialtyTab();

  }

  switchToSpecialtyTab() {

    this.tbidx = 3;

  }

  // =========================
  // USER ADDED
  // =========================

  refreshDetailsTrigger = 0;

  onUserAdded() {

    this.tbidx = 1;

    this.refreshTrigger++;

  }

  // =========================
  // TENANT TYPE
  // =========================

  onTenantTypeChange(value: any) {

    if (!value) return;

    this.filterTenants();

  }

  getTenantType() {

    this.tv = [
      { T: 'c10', V: '1' }
    ];

    this.srv
      .getdata('Tenants', this.tv)
      .subscribe(r => {

        if (r.Status === 1) {

          this.tenantTypes = r.Data[0];

        }

      });

  }

  // =========================
  // FILTER TENANTS
  // =========================

  filterTenants() {

    this.loading = true;

    this.tv = [

      {
        T: 'dk1',
        V: this.fltr || ''
      },

      {
        T: 'dk2',
        V: this.selectedCity || ''
      },

      {
        T: 'c1',
        V: this.selectedTenantType || ''
      },

      {
        T: 'c10',
        V: '18'
      }

    ];

    console.log(this.tv);

    this.srv
      .getdata('Tenants', this.tv)
      .subscribe(r => {

        this.loading = false;

        if (r.Status === 1) {

          this.dataSource.data =
            r.Data[0];

          this.cdr.detectChanges();

        } else {

          this.dataSource.data = [];

        }

      });

  }

  // =========================
  // SEARCH
  // =========================

  applySearch() {

    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {

      if (!this.fltr?.trim()) {

        this.list();

        return;

      }

      this.searchTenants(this.fltr);

    }, 500);

  }

  searchTenants(searchText: string) {

    this.loading = true;

    this.tv = [

      {
        T: 'dk1',
        V: searchText
      },

      {
        T: 'c10',
        V: '17'
      }

    ];

    this.srv
      .getdata('Tenants', this.tv)
      .subscribe(r => {

        this.loading = false;

        if (r.Status === 1) {

          this.dataSource.data =
            r.Data[0];

          this.cdr.detectChanges();

        } else {

          this.dataSource.data = [];

        }

      });

  }

  // =========================
  // FILTER TABLE
  // =========================

  applyFilter(event: Event) {

    const filterValue =
      (event.target as HTMLInputElement)
        .value;

    this.dataSource.filter =
      filterValue
        .trim()
        .toLowerCase();

  }

  // =========================
  // COUNTRY
  // =========================

  get(e: MatSelectChange) {

    this.cn = e.value;

    this.list();

  }

  getc(e: any) {

    this.cn = e;

    this.list();

  }

  getcntry() {

    this.tv = [
      { T: 'c10', V: '83' }
    ];

    this.srv
      .getdata('lists', this.tv)
      .subscribe(r => {

        if (r.Status === 1) {

          this.cntrys = r.Data[0];

        }

      });

  }

  // =========================
  // UPDATE
  // =========================

  onTenantUpdated() {

    this.list();

    this.tbidx = 0;

  }

  // =========================
  // LIST
  // =========================

  list() {

    this.loading = true;

    this.tv = [

      {
        T: 'c1',
        V: this.cn
      },

      {
        T: 'c10',
        V: '11'
      }

    ];

    this.srv
      .getdata('Tenants', this.tv)
      .subscribe(r => {

        this.loading = false;

        if (r.Status === 1) {

          this.hospitalList =
            r.Data[0];

          this.dataSource.data =
            this.hospitalList;

          this.cdr.detectChanges();

          this.dataSource.paginator =
            this.paginator;

          this.dataSource.sort =
            this.sort;

        }

      });

  }

}