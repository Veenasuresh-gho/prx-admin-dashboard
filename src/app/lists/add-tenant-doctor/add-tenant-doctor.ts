import { Component, inject, Input } from '@angular/core';
import { GHOService } from '../../services/ghosrvs';
import { tags } from '../../model/ghomodel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-add-tenant-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatChipsModule, MatIcon,
    MatButtonModule],
  templateUrl: './add-tenant-doctor.html',
  styleUrls: ['./add-tenant-doctor.css'],
})
export class AddTenantDoctor {
  @Input() tenant: any;

  fieldStyle: any = 'outline';
  loading: boolean = false;

  srv = inject(GHOService);
  tv: tags[] = [];
  cntrys: any[] = [];
  tenantTypes: any[] = [];

  imageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  statuses = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' },
  ];
  selectedStatus = '';
  specialtiesList: any[] = [];     // dropdown data
  selectedSpecialties: any[] = []; // selected chips
  hidePassword: boolean = true; // default = hidden


  categoryList = [
    { ID: 1, categoryName: 'MD' },
    { ID: 2, categoryName: 'Wellness' },
    { ID: 3, categoryName: 'Nutrition' },
    { ID: 4, categoryName: 'Mental Health' }
  ];

  model = {
    DoctorID: '',
    TenantID: '',
    FirstName: '',
    LastName: '',
    Email: '',
    CountryID: null,
    Phone: '',
    Bio: '',
    Gender: '',
    DOB: '',
    Status: '',
    Designation: '',
    Password: '',
    Address: '',
    ConsultationFee: null,
    Location: '',
    Category: null,
    Apptlength: null,
    MaxBookingPerSlot: null,
    RatePerVisit: null,
    Currency: '',
    RoomNumber: '',
    Longitude: '',
    Latitude: ''
  };

  ngOnChanges() {
    if (this.tenant) {
      this.model.TenantID = this.tenant.TenantID;

    }
  }

  userId: string = '';

  ngOnInit() {
    this.getcntry();

    const storedId = sessionStorage.getItem('id') || '';
    this.userId = storedId.replace(/^"+|"+$/g, '').trim();
  }

  phoneMaxLength = null

  onCountryChange() {
    const country = this.cntrys.find(
      c => Number(c.CountryID) === Number(this.model.CountryID)
    );

    console.log('Selected country:', country); // 👈 debug

    if (country) {
      this.model.Currency = country.CurrencyCode;
      this.phoneMaxLength = country.MaxLength;
    }
  }

  limitPhoneLength() {
    if (this.model.Phone && this.phoneMaxLength) {
      this.model.Phone = this.model.Phone.toString().slice(0, this.phoneMaxLength);
    }
  }

  // img

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

  // country
  getcntry() {
    this.tv = [{ T: 'c10', V: '99' }];

    this.srv.getdata('lists', this.tv).subscribe(r => {
      if (r.Status === 1) {
        this.cntrys = r.Data[0];

        this.model.CountryID = 102;
        this.onCountryChange();
      }
    });
  }
  getSelectedCountryCode(): string {
    const country = this.cntrys.find(
      c => c.CountryID === this.model.CountryID
    );
    return country ? country.CountryCode : '';
  }

  getSelectedCountryName(): string {
    const c = this.cntrys.find(x => x.CountryID === this.model.CountryID);
    return c ? c.CountryName : '';
  }

  // reset form
  resetForm() {
    this.model = {
      DoctorID: '',
      TenantID: '',
      FirstName: '',
      LastName: '',
      Email: '',
      CountryID: null,
      Phone: '',
      Bio: '',
      Gender: '',
      DOB: '',
      Status: '',
      Designation: '',
      Password: '',
      Category: null,
      ConsultationFee: null,
      Address: '',
      Location: '',
      Apptlength: null,
      MaxBookingPerSlot: null,
      RatePerVisit: null,
      Currency: '',
      RoomNumber: '',
      Longitude: '',
      Latitude: ''

    }
  }
  modelApt = {
    Apptlength: 15
  };


  onSelectSpecialty(sp: any) {

    const exists = this.selectedSpecialties.find(x => x.ID === sp.ID);
    if (exists) return;

    this.selectedSpecialties.push(sp);

  }

  // add doctor

//   saveUser() {

//     if (!this.tenant?.TenantIDAlt) {
//       console.error('Tenant not found');
//       return;
//     }

//     this.loading = true;

//     const payload = {
//       DoctorID: this.model.DoctorID,
//       TenantID: this.tenant?.TenantIDAlt,
//       FirstName: this.model.FirstName,
//       LastName: this.model.LastName,
//       Email: this.model.Email,

//       CountryID: String(this.model.CountryID),
//       Phone: this.model.Phone,

//       Bio: this.model.Bio,
//       Gender: this.model.Gender,
//       DOB: this.model.DOB,
//       Designation: this.model.Designation,
//       Category: Number(this.model.Category),
//       Location: this.model.Location,
//       Apptlength: this.model.Apptlength,
//       MaxBookingPerSlot: this.model.MaxBookingPerSlot,
//       RatePerVisit: this.model.RatePerVisit,
//       Currency: this.model.Currency,
//       Password: this.model.Password,
//       RoomNumber: this.model.RoomNumber,
//       Longitude: this.model.Longitude,
//       Latitude: this.model.Latitude,

//       Status: this.model.Status
//     };

//     console.log('dr. payload', payload);

//     this.tv = [
//       { T: 'dk2', V: this.tenant.TenantIDAlt },
//       { T: 'c1', V: JSON.stringify(payload) },
//       { T: 'c10', V: '1' }
//     ];

//   this.srv.getdata('Doctors', this.tv).subscribe({
// next: async (res) => {

//   console.log('Add dr. responds', res);

//   if (res.Status === 1) {
//     const data = res?.Data?.[0]?.[0];

// const doctorId = data?.id;


//     if (this.imageFile && doctorId) {
//       await this.srv.handleFileUpload(
//         doctorId,
//         this.userId,
//         this.imageFile,
//         '11'
//       );
//     }

//     const message = res?.Data?.[0]?.[0]?.msg || 'Doctor added successfully';
//     this.srv.openDialog('Success', 's', message);

//     this.resetForm();
//     this.selectedSpecialties = [];
//     this.selectedStatus = '';
//     this.imagePreview = null;
//     this.imageFile = null;

//   } else {
//     const errorMsg = res.Info || 'Something went wrong';
//     this.srv.openDialog('Error', 'e', errorMsg);
//   }

//   this.loading = false; 
// },
//   error: () => {
//     this.loading = false;
//   }
// });
//   }
// add doctor
saveUser() {

  if (!this.tenant?.TenantIDAlt) {
    console.error('Tenant not found');
    return;
  }

  this.loading = true;

  const payload = {
    DoctorID: this.model.DoctorID,
    TenantID: this.tenant?.TenantIDAlt,
    FirstName: this.model.FirstName,
    LastName: this.model.LastName,
    Email: this.model.Email,

    CountryID: String(this.model.CountryID),
    Phone: this.model.Phone,

    Bio: this.model.Bio,
    Gender: this.model.Gender,
    DOB: this.model.DOB,
    Designation: this.model.Designation,
    Category: Number(this.model.Category),
    Location: this.model.Location,
    Apptlength: this.model.Apptlength,
    MaxBookingPerSlot: this.model.MaxBookingPerSlot,
    RatePerVisit: this.model.RatePerVisit,
    Currency: this.model.Currency,
    Password: this.model.Password,
    RoomNumber: this.model.RoomNumber,
    Longitude: this.model.Longitude,
    Latitude: this.model.Latitude,

    Status: this.model.Status
  };

  console.log('dr. payload', payload);

  this.tv = [
    { T: 'dk2', V: this.tenant.TenantIDAlt },
    { T: 'c1', V: JSON.stringify(payload) },
    { T: 'c10', V: '1' }
  ];

  this.srv.getdata('Doctors', this.tv).subscribe({
    next: (res) => {

      console.log('Add dr. responds', res);

      if (res.Status === 1) {

        const message = res?.Data?.[0]?.[0]?.msg || 'Doctor added successfully';
        this.srv.openDialog('Success', 's', message);

        this.resetForm();
        this.selectedSpecialties = [];
        this.selectedStatus = '';
        this.imagePreview = null;
        this.imageFile = null;

      } else {
        const errorMsg = res.Info || 'Something went wrong';
        this.srv.openDialog('Error', 'e', errorMsg);
      }

      this.loading = false;
    },
    error: () => {
      this.loading = false;
    }
  });
}
}