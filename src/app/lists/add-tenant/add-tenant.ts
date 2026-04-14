import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { GHOService } from '../../services/ghosrvs';
import { tags } from '../../model/ghomodel';
import { MatButtonModule, MatButton } from '@angular/material/button';


@Component({
  selector: 'add-tenant',
  imports: [MatIconModule, MatDividerModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, MatButton, MatButtonModule],
  templateUrl: './add-tenant.html',
  styleUrl: './add-tenant.css',
})


export class AddTenant implements OnInit {

  model = {
    TenantName: '',
    Email: '',
    CountryID: null,
    Phone: '',
    Slug: '',
    TenantTypeID: null,
    About: '',
    Address: '',
    LocationName: '',
    PostalCode: ''
  };

  srv = inject(GHOService);
  tv: tags[] = [];
  cntrys: any[] = [];
  tenantTypes: any[] = [];

  ngOnInit(): void {
    this.getcntry();
    this.getTenantType();
  }

  getTenantType() {
    this.tv = [{ T: 'c10', V: '1' }];

    this.srv.getdata('Tenants', this.tv).subscribe(r => {
      if (r.Status === 1) {
        this.tenantTypes = r.Data[0];
      }
    });
  }
  resetForm() {
    this.model = {
      TenantName: '',
      Email: '',
      CountryID: null,
      Phone: '',
      Slug: '',
      TenantTypeID: null,
      About: '',
      Address: '',
      LocationName: '',
      PostalCode: ''
    };
  }

  submit() {
    this.tv = [
      { T: 'c1', V: JSON.stringify(this.model) },
      { T: 'c10', V: '3' }
    ];

    this.srv.getdata('Tenants', this.tv).subscribe(r => {
      if (r.Status === 1) {
        this.srv.openDialog('Success', 's', r.Data[0]?.[0].msg);
      }
    });
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
}
