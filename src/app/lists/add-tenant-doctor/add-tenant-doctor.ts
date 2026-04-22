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

@Component({
  selector: 'app-add-tenant-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,MatChipsModule,
    MatButtonModule],
  templateUrl: './add-tenant-doctor.html',
  styleUrls: ['./add-tenant-doctor.css'],
})
export class AddTenantDoctor {
  @Input() tenant: any;

  fieldStyle: any = 'outline';
  loading: boolean = false;

  // @Output() Added=new EventEmitter<void>();

  srv = inject(GHOService);
  tv: tags[] = [];
  cntrys: any[] = [];
  tenantTypes: any[] = [];

  imageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  statuses = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ];
  selectedStatus = '';
specialtiesList: any[] = [];     // dropdown data
selectedSpecialties: any[] = []; // selected chips

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
    Location: '',
    
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

    this.getSpecialties(); 
  }
}

  ngOnInit() {
    this.getcntry();
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
  // speciality
getSpecialties() {
  console.log('tenent',this.tenant.TenantIDAlt);
  

  if (!this.tenant?.TenantIDAlt) return;

  this.tv = [
    { T: 'dk1', V: this.tenant.TenantIDAlt },
    { T: 'c10', V: '8' }
  ];

  console.log('REQUEST:', this.tv);

  this.srv.getdata('specialty', this.tv).subscribe(r => {
    console.log('SPECIALTY RESPONSE:', r);

    if (r.Status === 1) {
      this.specialtiesList = r.Data?.[0] || [];
    }
  });
}

onSelectSpecialty(sp: any) {

  const exists = this.selectedSpecialties.find(x => x.ID === sp.ID);
  if (exists) return;

  this.selectedSpecialties.push(sp);

  // 🔥
  //  CALL UPDATE API
  this.updateSpecialty(sp);
}

addSpecialty(event: any) {
  console.log('add specialty');

  const value = (event.value || '').trim();
  if (!value) return;

  this.tv = [
    { T: 'c1', V: value },
    { T: 'c2', V: 'M' },
    { T: 'c3', V: '' },
    { T: 'c4', V: '0' },
    { T: 'c5', V: this.tenant?.TenantIDAlt }, // ✅ FIX
    { T: 'c10', V: '1' }
  ];

  console.log('ADD REQUEST:', this.tv);

  this.srv.getdata('specialty', this.tv).subscribe(r => {
    console.log('ADD RESPONSE:', r);

    if (r.Status === 1) {
      this.getSpecialties();
    }
  });
}

removeSpecialty(sp: any) {

  this.tv = [
    { T: 'dk1', V: sp.ID },
    { T: 'c10', V: '7' }
  ];

  console.log('DELETE REQUEST:', this.tv);

  this.srv.getdata('specialty', this.tv).subscribe(r => {
    console.log('DELETE RESPONSE:', r);

    if (r.Status === 1) {
      this.selectedSpecialties =
        this.selectedSpecialties.filter(x => x.ID !== sp.ID);
    }
  });
}

updateSpecialty(sp: any) {
  console.log('update specialty');

  this.tv = [
    { T: 'dk1', V: sp.ID },
    { T: 'c1', V: sp.SpecialtyName },
    { T: 'c2', V: sp.SpecialtyType || 'M' },
    { T: 'c3', V: sp.Description || '' },
    { T: 'c4', V: sp.RateAmount || '0' },
    { T: 'c10', V: '2' }
  ];

  console.log('UPDATE REQUEST:', this.tv);

  this.srv.getdata('specialty', this.tv).subscribe(res => {
    console.log('UPDATE RESPONSE:', res);
  });
}


  // add doctor
  saveUser() {

    if (!this.tenant?.TenantIDAlt) {
      console.error('Tenant not found');
      return;
    }

    this.loading = true;

    // 🔹 Build request body (c1 expects STRINGIFIED JSON)
const payload = {
  DoctorID: this.model.DoctorID || 0,
  TenantID: this.tenant?.TenantID,   // from parent

  FirstName: this.model.FirstName,
  LastName: this.model.LastName,
  Email: this.model.Email,

  CountryID: String(this.model.CountryID),
  Phone: this.model.Phone,

  Bio: this.model.Bio,
  Gender: this.model.Gender,
  DOB: this.model.DOB,
  Designation: this.model.Designation,

  Location: this.model.Location,   // NOT LocationName
Specialty: this.selectedSpecialties,
  Apptlength: this.model.Apptlength,
  MaxBookingPerSlot: this.model.MaxBookingPerSlot,
  RatePerVisit: this.model.RatePerVisit,
  Currency: this.model.Currency,

  RoomNumber: this.model.RoomNumber,
  Longitude: this.model.Longitude,
  Latitude: this.model.Latitude,

  Status: this.model.Status || 'Active'
};
    console.log('doctor-payload added', payload);


    this.tv = [
      { T: 'dk2', V: this.tenant.TenantIDAlt },
      { T: 'c1', V: JSON.stringify(payload) },
      { T: 'c10', V: '1' } // create user
    ];

    console.log('REQUEST:', this.tv);

    this.srv.getdata('Doctors', this.tv).subscribe(res => {
      this.loading = false;

      console.log('RESPONSE:', res);
      const message = res?.Data?.[0]?.[0]?.msg || 'Added';
      const Info = res?.Data?.[0]?.[0]?.info || 'Pending';

      if (res.Status === 1) {
        // this.Added.emit();
        const message = res?.Data?.[0]?.[0]?.msg || 'User added successfully';

        this.srv.openDialog('Success', 's', message);

        this.resetForm();
        this.selectedStatus = '';
        this.imagePreview = null;
        this.imageFile = null;

      } else {

        const errorMsg = res.Info || 'Something went wrong';

        this.srv.openDialog('Error', 'e', errorMsg);
      }
    });

  }
}