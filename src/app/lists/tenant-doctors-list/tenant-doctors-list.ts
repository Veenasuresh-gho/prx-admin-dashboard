import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { GHOService } from '../../services/ghosrvs';
import { tags } from '../../model/ghomodel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tenant-doctors-list',
  imports: [ CommonModule,
    FormsModule,
    MatTableModule,        
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule],
  templateUrl: './tenant-doctors-list.html',
  styleUrl: './tenant-doctors-list.css',
})
export class TenantDoctorsList {

   srv = inject(GHOService);

  loading = false;
  tv: tags[] = [];
  @Input() tenant: any;
  @Output() usersLoaded = new EventEmitter<any[]>();


  dataSource: any[] = [];
  fieldStyle: any = 'outline';
  cntrys: any[] = [];
  selectedRole = '';
  selectedStatus = '';
    imageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

    onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.imageFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

columns: string[] = ['FirstName', 'Speciality', 'Email', 'Phone', 'Status'];

  expandedRow: any = null;
  hidePassword: boolean = true; // default = hidden

  ngOnInit() {
    this.getCountries();
  }

  getCountries() {
    this.tv = [{ T: 'c10', V: '99' }];

    this.srv.getdata('lists', this.tv).subscribe(r => {
      if (r.Status === 1) {
        this.cntrys = r.Data[0];
        console.log('Countries:', this.cntrys);
      }
    });
  }


  getSelectedCountryCode(countryId: number): string {
    const country = this.cntrys.find(c => c.CountryID === countryId);
    return country ? country.CountryCode : '';
  }

ngOnChanges(changes: SimpleChanges): void {
  if (changes['tenant'] && this.tenant) {
    this.getDoctorsList();   // 👈 changed
  }
}

  toggleRow(row: any) {
    this.expandedRow = this.expandedRow === row ? null : row;
  }

  mapRole(role: string): string {
    if (!role) return '';

    const r = role.toLowerCase().trim();

    if (r === 'admin') return 'A';
    if (r === 'nurse') return 'N';

    return role;
  }
getDoctorsList() {
  this.loading = true;

  this.tv = [
    { T: 'dk1', V: this.tenant?.TenantIDAlt || '' },
    { T: 'c10', V: '15' }
  ];

  this.srv.getdata('Doctors', this.tv).subscribe(r => {
    this.loading = false;

    if (r.Status === 1) {
this.dataSource = r.Data[0].map((item: any) => ({
  TenantID: item.ID,
  DoctorIDAlt: item.ID, // API uses ID, not DoctorIDAlt

  // ✅ FIX NAME
  FirstName: item.FirstName?.trim(),
  LastName: item.LastName?.trim(),

  // ✅ FIX SPECIALITY
  Speciality: item.Specialty || '-',

  Email: item.Email,
  Phone: item.Phone,

  CountryID: item.CountryID,
  CountryCode: item.COuntryCode, // ⚠️ API typo (capital O)

  // ✅ FIX STATUS (string not boolean)
  Status: item.IsActive === 'Active' ? 'ACTIVE' : 'INACTIVE'
}));

      console.log('Doctors list:', this.dataSource);
      this.usersLoaded.emit(this.dataSource);

    } else {
      this.dataSource = [];
      this.usersLoaded.emit([]);
    }
  });
}

  // deleteTenant(row: any, event: Event) {
  //   event.stopPropagation(); //  prevent row expand

  //   console.log('Deleting user:', row);

  //   this.tv = [
  //     { T: 'dk1', V: row.TenantUserIDAlt }, //  THIS IS YOUR ID
  //     { T: 'c10', V: '4' }
  //   ];

  //   this.srv.getdata('tenantuser', this.tv).subscribe(r => {
  //     const message = r?.Data?.[0]?.[0]?.msg || 'Deleted';

  //     if (r.Status === 1) {
  //       console.log('updtaed tenentuser', r);

  //       this.srv.openDialog('Success', 's', message);

  //       //  refresh list
  //       this.getTenantUsersList();
  //     } else {
  //       this.srv.openDialog('Error', 'e', r.Info || 'Delete failed');
  //     }
  //   });
  // }

  updateTenant(row: any, event: Event) {
    event.stopPropagation();

    const payload = {
      FirstName: row.FirstName,
      TenantUserIDAlt: row.TenantUserIDAlt,
      LastName: row.LastName,
      Email: row.Email,
      Role: row.Role,
      Phone: row.Phone,
      CountryID: row.CountryID,
      Password: row.Password,
      Status: row.Status
    };
    console.log('data from update call', payload);

    this.tv = [
      { T: 'dk1', V: row.TenantUserIDAlt },
      { T: 'c1', V: JSON.stringify(payload) },
      { T: 'c10', V: '2' }
    ];
    console.log('data called tv', this.tv);


    this.srv.getdata('tenantuser', this.tv).subscribe(r => {
      const message = r?.Data?.[0]?.[0]?.msg;
      const Info = r?.Info || 'Update failed';

      if (r.Status === 1) {
        console.log('updated data', r);

        this.srv.openDialog('Success', 's', message);

        // refresh list

        // optionally close expanded row
        this.expandedRow = null;

      }
      //  if (r.Status === 0) {
      //         this.srv.openDialog('Warning', 'w', 'Update failed');

      // }

      else {
        this.srv.openDialog('Error', 'e', message || 'Update failed');
      }
    });
  }
  getSelectedCountryName(countryId: number): string {
    const c = this.cntrys.find(x => x.CountryID === countryId);
    return c ? c.CountryName : '';
  }
 


}
