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
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-tenant-doctors-list',
  imports: [CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule, MatChipsModule,
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

  statuses = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' },
  ];
  categoryList = [
    { ID: 1, categoryName: 'MBBS MD' },
    { ID: 2, categoryName: 'Wellness' },
    { ID: 3, categoryName: 'Nutrition' },
    { ID: 4, categoryName: 'Mental Health' }
  ];

  onFileSelected(event: any, row: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.imageFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      row.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  columns: string[] = ['FirstName', 'Category', 'Email', 'Phone', 'Status'];


  expandedRow: any = null;
  hidePassword: boolean = true; // default = hidden

  userId: string = '';

  ngOnInit() {
    this.getcntry();
    this.getSpecialty();

    const storedId = sessionStorage.getItem('id') || '';
    this.userId = storedId.replace(/^"+|"+$/g, '').trim();

  }



  getcntry() {
    this.tv = [{ T: 'c10', V: '99' }];

    this.srv.getdata('lists', this.tv).subscribe(r => {
      if (r.Status === 1) {
        this.cntrys = r.Data[0];

        this.tryLoadDoctors();
      }
    });
  }

  getSelectedCountryCode(countryId: number): string {
    const country = this.cntrys.find(c => c.CountryID === countryId);
    return country ? country.CountryCode : '';
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tenant'] && this.tenant) {
      this.tryLoadDoctors();
    }
  }
  tryLoadDoctors() {
    if (this.tenant && this.cntrys.length > 0) {
      this.getDoctorsList();
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

  phoneMaxLength = null

  onCountryChange(row: any) {
    const country = this.cntrys.find(
      c => Number(c.CountryID) === Number(row.CountryID)
    );

    if (country) {
      row.Currency = country.CurrencyCode;
      row.phoneMaxLength = country.MaxLength; // store per row
    }
  }

  limitPhoneLength(row: any) {
    if (row.Phone && row.phoneMaxLength) {
      row.Phone = row.Phone.toString().slice(0, row.phoneMaxLength);
    }
  }

  getCategoryId(name: string): number | null {
    if (!name) return null;

    const match = this.categoryList.find(c =>
      c.categoryName?.trim().toLowerCase() === name?.trim().toLowerCase()
    );

    return match ? match.ID : null;
  }

  getCategoryName(value: any): string {
    if (!value) return '';

    if (!isNaN(value)) {
      const match = this.categoryList.find(c => c.ID === Number(value));
      return match ? match.categoryName : '';
    }

    return value;
  }

  getSpecialtyIdByName(name: string): number | null {
    if (!name) return null;

    const match = this.specialtyList.find(s =>
      s.SpecialtyName?.toLowerCase().trim() === name?.toLowerCase().trim()
    );

    return match ? match.ID : null;
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
        this.dataSource = r.Data[0].map((item: any) => {


          const country = this.cntrys.find(
            c => Number(c.CountryID) === Number(item.CountryID)
          );

          const categoryId = this.getCategoryId(item.Category);

          return {
            TenantID: item.ID,
            DoctorIDAlt: item.DoctorID,

            FirstName: item.FirstName?.trim(),
            LastName: item.LastName?.trim(),

            DoctorSpecialtyID: item.DoctorSpecialtyID || 0,

            Email: item.Email,
            Phone: item.Phone,

            image: item._url || null,
            CountryID: item.CountryID,
            CountryCode: item.COuntryCode,

            Bio: item.Bio,
            Designation: item.Designation || '',
            Gender: item.Gender === 'M' ? 'Male' : 'Female',
            DOB: item.DOB || '',
            Location: item.Location || '',
            SpecialtyID: this.getSpecialtyIdByName(item.Specialty),
            Password: item.Password || '',
            Category: this.getCategoryId(item.Category) || item.Category || null,

            Address: item.Address || '',
            RoomNumber: item.RoomNumber || '',
            Longitude: item.Longitude || '',
            Latitude: item.Latitude || '',
            Currency: item.Currency || '',
            MaxBookingPerSlot: item.MaxBookingPerSlot || 0,
            ApptLength: item.ApptLength || 0,
            ConsultationFee: item.ConsultationFee || 0,

            phoneMaxLength: country?.MaxLength || 15,

            Status: item.IsActive?.trim().toLowerCase() === 'active' ? 1 : 0
          };
        });
        this.usersLoaded.emit(this.dataSource);
      } else {
        this.dataSource = [];
        this.usersLoaded.emit([]);
      }
    });
  }

  deleteDoctor(row: any, event: Event) {
    event.stopPropagation(); //  prevent row expand


    this.tv = [
      { T: 'dk2', V: row.TenantID },
      { T: 'c10', V: '4' }
    ];

    this.srv.getdata('Doctors', this.tv).subscribe(r => {
      const message = r?.Data?.[0]?.[0]?.msg || 'Deleted';

      if (r.Status === 1) {

        this.srv.openDialog('Success', 's', message);

        this.getDoctorsList();
      } else {
        this.srv.openDialog('Error', 'e', r.Info || 'Delete failed');
      }
    });
  }
  specialtyList: any[] = [];

  getSpecialty() {
    this.tv = [
      { T: 'c10', V: '3' }
    ];

    this.srv.getdata('specialty', this.tv).subscribe(r => {
      if (r.Status === 1) {
        this.specialtyList = r.Data[0];
      }
    });
  }

  getDoctorSpecialty(row: any) {

    row.isSpecialtyLoaded = false;

    const tv = [
      { T: 'dk1', V: row.DoctorSpecialtyID || '0' },
      { T: 'dk2', V: row.TenantID },
      { T: 'c10', V: '3' }
    ];

    this.srv.getdata('doctorspecialty', tv).subscribe(r => {
      if (r.Status === 1) {

        const data = r?.Data?.[0]?.[0];

        if (data) {
          row.SpecialtyID = Number(data.SpecialtyID);
          row.ConsultationFee = data.RateAmount;
          row.DoctorSpecialtyID = data.ID;
        }

        row.isSpecialtyLoaded = true;

      } else {
        console.error('Failed to fetch specialty');
      }
    });
  }

  saveDoctorSpecialty(row: any) {

    const isUpdate = row.DoctorSpecialtyID && row.DoctorSpecialtyID !== 0;

    const tv = [
      { T: 'dk1', V: isUpdate ? row.DoctorSpecialtyID : '0' },
      { T: 'dk2', V: row.TenantID },
      { T: 'c1', V: row.SpecialtyID },
      { T: 'c2', V: 'M' },
      { T: 'c3', V: row.ConsultationFee || '0' },
      { T: 'c10', V: isUpdate ? '2' : '1' }
    ];

    return this.srv.getdata('doctorspecialty', tv);
  }

  updateDoctor(row: any, event: Event) {

    event.stopPropagation();

    const payload = {
      FirstName: row.FirstName,
      LastName: row.LastName,
      Email: row.Email,
      Phone: row.Phone,
      Specialty: row.Specialty,

      CountryID: row.CountryID,
      Bio: row.Bio,
      Gender: row.Gender === 'Male' ? 'M' : 'F',
      DOB: row.DOB,
      Designation: row.Designation,

      Location: row.Location,
      Address: row.Address,
      Password: row.Password,

      Category: row.Category,
      RoomNumber: row.RoomNumber,
      Longitude: row.Longitude,
      Latitude: row.Latitude,

      Currency: row.Currency,
      MaxBookingPerSlot: row.MaxBookingPerSlot,
      ApptLength: row.ApptLength,
      RatePerVisit: row.ConsultationFee,

      IsActive: row.Status
    };

    this.tv = [
      { T: 'dk1', V: row.TenantID },
      { T: 'c1', V: JSON.stringify(payload) },
      { T: 'c10', V: '2' }
    ];

    this.srv.getdata('Doctors', this.tv).subscribe({
      next: async (r) => {

        const message = r?.Data?.[0]?.[0]?.msg || 'Updated';
        if (r.Status === 1) {

          this.saveDoctorSpecialty(row).subscribe(res => {

            if (res.Status === 1) {

              const newId = res?.Data?.[0]?.[0]?.id;
              if (newId) {
                row.DoctorSpecialtyID = Number(newId);
              }

            } else {
              console.error('Specialty failed', res);
            }

          });
          const doctorId = row.DoctorIDAlt;

          if (this.imageFile && doctorId && this.imageFile.name) {
            const success = await this.srv.handleFileUpload(
              doctorId,
              this.userId,
              this.imageFile,
              '11'
            );

            if (!success) {
              this.srv.openDialog('Warning', 'w', 'Doctor updated, but image upload failed');
            }
          }

          this.srv.openDialog('Success', 's', message);
          this.getDoctorsList();
          this.expandedRow = null;
          this.imageFile = null;
          this.imagePreview = null;

        } else {
          this.srv.openDialog('Error', 'e', r.Info || 'Update failed');
        }
      }
    });
  }

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

    this.tv = [
      { T: 'dk1', V: row.TenantUserIDAlt },
      { T: 'c1', V: JSON.stringify(payload) },
      { T: 'c10', V: '2' }
    ];


    this.srv.getdata('tenantuser', this.tv).subscribe(r => {
      const message = r?.Data?.[0]?.[0]?.msg;
      const Info = r?.Info || 'Update failed';

      if (r.Status === 1) {

        this.srv.openDialog('Success', 's', message);


        this.expandedRow = null;

      }

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
