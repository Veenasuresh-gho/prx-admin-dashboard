import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { tags } from '../../model/ghomodel';
import { GHOService } from '../../services/ghosrvs';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { TenantUserList } from '../tenant-user-list/tenant-user-list';
import { TenantDoctorsList } from '../tenant-doctors-list/tenant-doctors-list';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'tenant-details',
  templateUrl: './tenant-details.html',
  imports: [CommonModule,
    FormsModule, MatTableModule,
    MatIcon,
    MatFormFieldModule,
    MatInputModule, MatSelectModule, TenantUserList, TenantDoctorsList],
  styleUrl: './tenant-details.css',
})
export class TenantDetails implements OnChanges {
  srv = inject(GHOService);
  tv: tags[] = [];
  details: any;
  @Input() tenant: any;
  loading: boolean = false;
  isEditMode: boolean = false;
  tenantTypes: any[] = [];
  cntrys: any[] = [];
  @Output() updated = new EventEmitter<void>();
  @Output() editSpecialty = new EventEmitter<any>();

  selectedSpecialty: any = null;

  constructor(private dialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tenant'] && this.tenant) {
      this.loadAllData();
    }
  }
  loadAllData() {
    this.getTenantType();
  }

  getTenantType() {
    this.tv = [{ T: 'c10', V: '1' }];

    this.srv.getdata('Tenants', this.tv).subscribe(r => {
      if (r.Status === 1) {
        this.tenantTypes = r.Data[0];

        this.getTenantDetails();
        this.getCountries();
      }
    });
  }

  tenantUsersList: any[] = [];

  onUsersLoaded(users: any[]) {
    console.log('Received users from child:', users);
    this.tenantUsersList = users;
  }

  // openSpecialtyEditor(row: any) {
  //   console.log('Selected specialty:', row);

  //   this.editSpecialty.emit(row); 
  // }

  deleteTenant() {

    this.tv = [
      { T: 'dk1', V: this.tenant?.TenantIDAlt },
      { T: 'c10', V: '4' }
    ];

    this.srv.getdata('Tenants', this.tv).subscribe(r => {
      const message = r?.Data?.[0]?.[0]?.Msg || 'Deleted';

      if (r.Status === 1) {
        this.srv.openDialog('Success', 's', message);
      }
    });
  }
  getCountries() {
    this.tv = [{ T: 'c10', V: '99' }];

    this.srv.getdata('lists', this.tv).subscribe(r => {
      if (r.Status === 1) {
        this.cntrys = r.Data[0];
        this.getTenantDetails();

        if (this.details?.CountryID) {
          this.details.CountryID = Number(this.details.CountryID);
        }

        console.log('Countries loaded, CountryID:', this.details?.CountryID);
      }
    });
  }

  mapType() {
    if (!this.details || !this.tenantTypes?.length) return;

    const match = this.tenantTypes.find(
      t => t.Tenant === this.details.Type
    );

    if (match) {
      this.details.Type = match.ID;
    }

    console.log('Mapped Type:', this.details.Type);
  }

  getTenantDetails() {
    this.loading = true;

    this.tv = [
      { T: 'dk1', V: this.tenant?.TenantIDAlt },
      { T: 'c10', V: '11' }
    ];

    this.srv.getdata('Tenants', this.tv).subscribe(r => {
      this.loading = false;

      if (r.Status === 1) {
        this.details = r.Data[0][0];
        this.details.CountryID = Number(this.details.CountryID);

        console.log('API RAW TYPE:', this.details.Type);

        if (this.tenantTypes?.length) {
          const match = this.tenantTypes.find(
            t => t.Tenant === this.details.Type
          );

          if (match) {
            this.details.Type = match.ID;
          }
        }

        console.log('MAPPED TYPE:', this.details.Type);
        console.log('country is', this.details.CountryID);
      }
    });
  }

  fieldStyle: any = 'outline';
  res: any;


  onCountryChange(value: number) {
    this.details.CountryID = value;
  }
  getSelectedCountryCode(): string {
    const country = this.cntrys.find(
      c => c.CountryID === this.details?.CountryID
    );
    return country ? country.CountryCode : '';
  }

  updateTenant() {

    const payload = {
      TenantName: this.details['TenantName'],
      TenantTypeID: this.details['Type'],
      About: this.details['About'],
      Email: this.details['Email'],
      CountryID: this.details['CountryID'],
      Phone: this.details['Phone'],
      WebsiteLink: this.details['WebsiteLink'],
      Address: this.details['Address'],
      LocationName: this.details['Location'],

      MapUrl: this.details['MapUrl'],
      IsActive: this.details['IsActive']
    };

    this.tv = [
      { T: 'dk1', V: this.details['TenantIDAlt'] },
      { T: 'c1', V: JSON.stringify(payload) },
      { T: 'c10', V: '9' }
    ];

    this.srv.getdata('Tenants', this.tv).subscribe(r => {
      const message = r?.Data?.[0]?.[0]?.msg || 'Updated';

      if (r.Status === 1) {
        this.updated.emit();
        this.srv.openDialog('Success', 's', message);

        this.getTenantDetails();
      }
    });
  }



}