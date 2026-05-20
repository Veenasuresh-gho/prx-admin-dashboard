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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
import { GHOdropdown } from '../components/dropdown';
import { GHOInput } from '../components/input';

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

  srv = inject(GHOService);
  route = inject(ActivatedRoute);

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private ngZone: NgZone
  ) { }

  dataSource = new MatTableDataSource<any>();

  columns: string[] = [
    'Name',
    'Location',
    'Phone',
    'Address',
    'Type',
    'Status'
  ];

  hospitalList: any[] = [];
  tv: tags[] = [];
  cntrys: any[] = [];
  tenantTypes: any[] = [];

  tbidx = 0;
  loading = false;
  detailsTabEnabled = false;

  selectedTenant: any = null;
  selectedTenantType: any = null;
  selectedSpecialty: any = null;

  fltr = '';
  searchTimeout: any;
  cn = '0';

  locationSearch = '';
  selectedCity = '';

  private _paginator!: MatPaginator;

  @ViewChild(MatPaginator)
  set paginator(value: MatPaginator) {

    if (value) {

      this._paginator = value;

      this.dataSource.paginator = value;

      this.cdr.detectChanges();
    }
  }

  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild('locationInput')
  locationInput!: ElementRef;

  @Input()
  refreshTrigger = 0;

  refreshDetailsTrigger = 0;
  pageSizeOptions: number[] = [15];


  updatePageSizeOptions(totalLength: number) {

    const options: number[] = [];

    for (let i = 15; i < totalLength; i += 15) {
      options.push(i);
    }

    // Always include total count as last option if not already present
    if (totalLength > 0 && !options.includes(totalLength)) {
      options.push(totalLength);
    }

    this.pageSizeOptions = options.length
      ? options
      : [15];
  }

  ngOnInit(): void {

    this.getcntry();

    this.route.queryParams.subscribe(params => {

      const typeId = params['typeId'];

      this.selectedTenantType =
        typeId ? Number(typeId) : null;

    });

    this.getTenantType();
  }

  async ngAfterViewInit(): Promise<void> {

    this.dataSource.sort = this.sort;

    await this.srv.loadGoogleMaps();

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

    autocomplete.addListener(
      'place_changed',
      () => {

        this.ngZone.run(() => {

          const place =
            autocomplete.getPlace();

          let cityName =
            place.name || '';

          if (place.address_components) {

            for (const comp of place.address_components) {

              if (
                comp.types.includes('locality')
              ) {

                cityName =
                  comp.long_name;

                break;
              }

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

          this.locationSearch = cityName;
          this.selectedCity = cityName;

          this.loadTenants();

        });

      }
    );
  }

  selectTenant(row: any) {

    this.selectedTenant = row;
    this.detailsTabEnabled = true;
    this.tbidx = 1;
  }

  onEditSpecialty(sp: any) {

    this.selectedSpecialty = sp;
    this.tbidx = 3;
  }

  onUserAdded() {

    this.tbidx = 1;
    this.refreshTrigger++;
  }

  onTenantTypeChange(value: any) {

    this.selectedTenantType = value;

    this.selectedTenant = null;
    this.detailsTabEnabled = false;

    this.loadTenants();
  }

  loadTenants() {

    if (this.selectedTenantType) {
      this.filterTenants();
    } else {
      this.list();
    }

  }

  getTenantType() {

    this.tv = [
      { T: 'c10', V: '1' }
    ];

    this.srv
      .getdata('Tenants', this.tv)
      .subscribe(r => {

        if (r.Status === 1) {

          this.tenantTypes =
            r.Data[0];

          this.loadTenants();
        }

      });
  }

  filterTenants() {

    this.loading = true;

    this.tv = [

      {
        T: 'dk1',
        V: this.fltr?.trim() || ''
      },

      {
        T: 'dk2',
        V: this.selectedCity?.trim() || ''
      },

      {
        T: 'c1',
        V: this.selectedTenantType
          ? String(this.selectedTenantType)
          : ''
      },

      {
        T: 'c10',
        V: '18'
      }

    ];

    this.srv
      .getdata('Tenants', this.tv)
      .subscribe(r => {

        this.loading = false;

        const data =
          r.Status === 1
            ? r.Data[0] || []
            : [];

        this.dataSource.data = data;

        this.updatePageSizeOptions(data.length);

        setTimeout(() => {

          if (this._paginator) {

            this._paginator.length =
              data.length;

            this._paginator.firstPage();

          }

        });

      });

  }

  applySearch() {

    clearTimeout(this.searchTimeout);

    this.searchTimeout =
      setTimeout(() => {

        this.loadTenants();

      }, 500);

  }

  get(e: MatSelectChange) {

    this.cn = e.value;
    this.loadTenants();
  }

  getc(e: any) {

    this.cn = e;
    this.loadTenants();
  }

  getcntry() {

    this.tv = [
      { T: 'c10', V: '83' }
    ];

    this.srv
      .getdata('lists', this.tv)
      .subscribe(r => {

        if (r.Status === 1) {

          this.cntrys =
            r.Data[0];

        }

      });
  }

  onTenantUpdated() {

    this.tbidx = 0;

    this.loadTenants();
  }

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

        this.hospitalList =
          r.Status === 1
            ? r.Data[0] || []
            : [];

        this.dataSource.data =
          this.hospitalList;

          this.updatePageSizeOptions(this.hospitalList.length);

        setTimeout(() => {

          if (this._paginator) {

            this._paginator.length =
              this.hospitalList.length;

            this._paginator.firstPage();

          }

        });

      });

  }
}