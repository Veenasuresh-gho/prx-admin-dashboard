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

  searchTerm: any = null;
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

          const place = autocomplete.getPlace();

          console.log('FULL PLACE OBJECT:', place);

          console.log(
            'FORMATTED ADDRESS:',
            place.formatted_address
          );

          console.log(
            'PLACE NAME:',
            place.name
          );

          console.log(
            'ADDRESS COMPONENTS:',
            place.address_components
          );

          let cityName = '';

          if (place.address_components) {

            place.address_components.forEach(
              (comp: any) => {

                console.log(
                  'COMPONENT:',
                  comp.long_name,
                  'TYPES:',
                  comp.types
                );

              }
            );

            const locality =
              place.address_components.find(
                (comp: any) =>
                  comp.types.includes('locality')
              );

            const postalTown =
              place.address_components.find(
                (comp: any) =>
                  comp.types.includes('postal_town')
              );

            const sublocality =
              place.address_components.find(
                (comp: any) =>
                  comp.types.includes('sublocality_level_1') ||
                  comp.types.includes('sublocality')
              );

            console.log('LOCALITY:', locality);
            console.log('POSTAL TOWN:', postalTown);
            console.log('SUBLOCALITY:', sublocality);

            if (locality) {

              cityName = locality.long_name;

            } else if (postalTown) {

              cityName = postalTown.long_name;

            } else if (sublocality) {

              cityName = sublocality.long_name;

            }

          }

          if (!cityName && place.formatted_address) {

            const parts =
              place.formatted_address
                .split(',')
                .map((p: string) => p.trim());

            console.log('ADDRESS PARTS:', parts);

            cityName =
              parts.length >= 3
                ? parts[parts.length - 4]
                : place.name || '';

          }

          console.log(
            'FINAL SELECTED CITY:',
            cityName
          );

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

    this.selectedTenantType =
      value === '' ? null : value;

    this.selectedTenant = null;
    this.detailsTabEnabled = false;

    this.loadTenants();
  }

  loadTenants() {

    if (
      this.selectedTenantType ||
      this.fltr?.trim() ||
      this.selectedCity?.trim()
    ) {

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
          this.tenantTypes = [
            {
              ID: '',
              Tenant: 'All'
            },
            ...r.Data[0]
          ];

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

        this.tv = [
          { T: 'dk1', V: this.fltr?.trim() || '' },
          { T: 'dk2', V: this.selectedCity || '' },
          { T: 'c1', V: this.selectedTenantType || '' },
          { T: 'c10', V: '18' }
        ];

        this.srv
          .getdata('Tenants', this.tv)
          .subscribe(r => {

            const data =
              r.Status === 1
                ? r.Data[0] || []
                : [];

            this.dataSource.data = data;

          });

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