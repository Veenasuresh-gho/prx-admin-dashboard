import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GHOService } from '../../services/ghosrvs';
import { tags } from '../../model/ghomodel';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-tenent-user',
  standalone: true,   // 
  imports: [CommonModule, FormsModule, MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule, MatIconModule],
  templateUrl: './add-tenent-user.html',
  styleUrl: './add-tenent-user.css',
})
export class AddTenentUser {
  @Input() tenant: any;
  fieldStyle: any = 'outline';
  loading: boolean = false;
  @Output() Added = new EventEmitter<void>();

  srv = inject(GHOService);
  tv: tags[] = [];
  cntrys: any[] = [];
  tenantTypes: any[] = [];
  roles: any[] = [];
  getRoles() {
    this.tv = [
      { T: 'dk1', V: 'TENANTUSERROLE' },
      { T: 'c10', V: '5' }
    ];

    this.srv.getdata('lists', this.tv).subscribe(res => {
      if (res.Status === 1) {
        this.roles = res.Data[0];
        console.log("roles",this.roles)
      }
    });
  }


  model = {
    FirstName: '',
    LastName: '',
    Phone: '',
    Email: '',
    EmployeeID: '',
    CountryID: null,
    About: '',
    Password: '',
    Status: '',
  }

  resetForm() {
    this.model = {
      FirstName: '',
      LastName: '',
      Phone: '',
      Email: '',
      EmployeeID: '',
      CountryID: null,
      About: '',
      Password: '',
      Status: ''
    };
    
    this.imgReset();
  }

  ngOnInit(): void {
    this.getcntry();
    this.getRoles();

  }

  imageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  selectedRole = '';
  selectedStatus = '';

  imgReset() {
    this.imagePreview = null;
    this.imageFile = null;
  }

  // roles = [
  //   { value: 'A', label: 'Admin' },
  //   { value: 'N', label: 'Nurse' }
  // ];
  statuses = [
    { value: 'APPROVED', label: 'Approved' },
    { value: 'PENDING', label: 'Pending' },
  ];

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

  saveUser() {

    if (!this.tenant?.TenantIDAlt) {
      console.error('Tenant not found');
      return;
    }
    this.loading = true;

    const payload = {
      FirstName: this.model.FirstName,
      LastName: this.model.LastName,
      Email: this.model.Email,
      Role: this.selectedRole,     // 'A' | 'D' | 'S'
      CountryID: String(this.model.CountryID),
      Phone: this.model.Phone,
      Status: this.model.Status,
      Password: this.model.Password
    };

    this.tv = [
      { T: 'dk1', V: this.tenant.TenantIDAlt },
      { T: 'c1', V: JSON.stringify(payload) },
      { T: 'c10', V: '1' } // create user
    ];


    // 🔹 API call
    this.srv.getdata('tenantuser', this.tv).subscribe(res => {
      this.loading = false;

      const message = res?.Data?.[0]?.[0]?.msg || 'Added';
      const Info = res?.Data?.[0]?.[0]?.info || 'Pending';

      if (res.Status === 1) {
        this.Added.emit();
        const message = res?.Data?.[0]?.[0]?.msg || 'User added successfully';

        this.srv.openDialog('Success', 's', message);

        this.resetForm();
        this.selectedRole = '';
        this.selectedStatus = '';
        this.imagePreview = null;
        this.imageFile = null;

      } else {

        // 🔥 ERROR HANDLING
        const errorMsg = res.Info || 'Something went wrong';

        this.srv.openDialog('Error', 'e', errorMsg);
      }
    });

  }

}