import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select';
import { GHOService } from '../services/ghosrvs';
import { ghoresult, tags } from '../model/ghomodel';
import { DateDDLComponent } from "../features/dates/date";
import { MatFormFieldAppearance } from '@angular/material/form-field';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule, MatIconModule, DateDDLComponent],
  templateUrl: './profile.html',
})
export class Profile {

  srv = inject(GHOService);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  countryListData: any[] = []
  countryCodeData: any[] = []
  selectedCountry: string = '';
  selectedCountryCode: string = '';

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  userId: any;
  adminDetails: any = {};
  isEditMode: boolean = false;

  showCurrentPassword = false
  showNewPassword = false
  showConfirmPassword = false

  previousData: any = {}
  fieldStyle: MatFormFieldAppearance = 'fill'
  dob: string = ''
  info: [] = []



  ngOnInit() {
    this.getCountryList()
    this.userId = this.srv.getsession('id');
    if (this.userId) {
      this.getAdminDetails()
    }

  }


  formatDate(dob: string): string {
    if (!dob) return '';
    const date = new Date(dob);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  getCountryList(): void {
    this.tv = []
    this.tv.push({ T: 'c10', V: '99' })
    this.srv.getdata('lists', this.tv).subscribe((r) => {
      this.res = r
      if (r.Status === 1) {
        this.countryListData = r.Data[0]
      }
      else {
        this.srv.openDialog('Error', 'w', this.res.Info)

      }
    })
  }

  getCountryCode(): void {
    this.tv = []
    this.tv.push({ T: 'c10', V: '99' })
    this.srv.getdata('lists', this.tv).subscribe((r) => {
      this.res = r
      if (r.Status === 1) {
        this.countryCodeData = r.Data[0]
      }
      else {
        this.srv.openDialog('Error', 'w', this.res.Info)

      }
    })
  }

  getAdminDetails(): void {
    this.tv = []
    this.tv.push({ T: 'dk1', V: this.userId })
    this.tv.push({ T: 'c10', V: '87' })
    this.srv.getdata('appuser', this.tv).subscribe((r) => {
      this.res = r
      if (r.Status === 1) {
        this.adminDetails = r.Data[0][0]
        this.loadAdminDetails(this.adminDetails);
      }
      else {
        this.srv.openDialog('Error', 'w', this.res.Info)

      }
    })
  }

  loadAdminDetails(apiData: any) {
    const formattedDob = this.formatDate(apiData.DateOfBirth)

    this.adminDetails = {
      Role: apiData.Role,
      UserID: apiData.UserID,
      FirstName: apiData.FirstName,
      LastName: apiData.LastName,
      Gender: apiData.Gender,
      Email: apiData.Email,
      Phone: apiData.Phone,
      CountryCode: apiData.CountryCode,
      AlternativePhone: apiData.AlternativePhone,
      DateOfBirth: this.formatDate(apiData.DateOfBirth),
    };

    this.dob = formattedDob
    this.selectedCountry = apiData.CountryCode;
  }


  enableEdit() {

    this.previousData = { ...this.adminDetails };
    this.isEditMode = true

  }

  saveProfileChanges() {
    this.editAdminDetails()
  }


  editAdminDetails(): void {
    this.tv = [];
    this.tv.push({ T: 'dk1', V: this.userId });
    const updatedData = {
      FirstName: this.adminDetails.FirstName,
      LastName: this.adminDetails.LastName,
      Phone: this.adminDetails.Phone,
      Email: this.adminDetails.Email,
      Gender: this.adminDetails.Gender,
      DOB: this.adminDetails.DateOfBirth,
      CountryCode: this.adminDetails.CountryCode,
      AlternativePhone: this.adminDetails.AlternativePhone
    }
    this.tv.push({ T: 'c1', V: JSON.stringify(updatedData) });
    this.tv.push({ T: 'c10', V: '85' });
    this.srv.getdata('appuser', this.tv).subscribe((r) => {
      this.res = r;
      if (r.Status === 1) {
        this.srv.openDialog('Success', 's', 'Profile updated successfully!');
      this.previousData = { ...this.adminDetails };

        this.isEditMode = false;
        this.getAdminDetails()
      } else {
        this.srv.openDialog('Error', 'w', this.res.Info);
      }
    });
  }

  @ViewChild('pwdForm') pwdForm!: NgForm;
  changePassword(form: NgForm): void {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.srv.openDialog('Error', 'w', 'Please fill all fields')
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.srv.openDialog('Error', 'S', 'New and Confirm Password do not match')
      return;
    }
    this.tv = []
    this.tv.push({ T: 'dk1', V: this.currentPassword })
    this.tv.push({ T: 'c1', V: this.newPassword })
    this.tv.push({ T: 'c12', V: this.confirmPassword })
    this.tv.push({ T: 'c10', V: '95' })
    this.srv.getdata('appuser', this.tv).subscribe((r) => {
      this.res = r
      if (r.Status === 1) {
        const msg = this.res.Data[0][0].msg;
        this.srv.openDialog('Success', 's', msg)
        form.resetForm();
      }
      else {
        this.srv.openDialog('Error', 'w', this.res.Info)

      }
    })
  }


  cancelProfileChanges() {
    this.adminDetails = { ...this.previousData }
    // this.selectedCountry = this.previousData.CountryCode
    this.isEditMode = false
  }


  onDateChange(dt: string | null) {
    this.dob = dt ?? ''
    this.adminDetails.DateOfBirth = this.dob
  }


  getAdminDetailsForEdit() {
    this.tv = []
    this.tv.push({ T: 'dk1', V: this.userId });
    this.tv.push({ T: 'c10', V: '87' });

    this.srv.getdata('appuser', this.tv).subscribe((r) => {
      if (r.Status === 1) {
        const apiData = r.Data[0][0];
        this.loadAdminDetails(apiData);
        this.isEditMode = true;
      } else {
        this.srv.openDialog('Error', 'w', r.Info);
      }
    })
  }

  // To display country code + country name
  getCountryDisplay(): string {
    if (!this.adminDetails?.CountryCode || !this.countryListData?.length) {
      return ''
    }

    const country = this.countryListData.find(
      c => c.CountryCode.toString() == this.adminDetails.CountryCode.toString()
    )

    return country
      ? `+${country.CountryCode} ${country.CountryName}`
      : `+${this.adminDetails.CountryCode}`
  }

  // to display phone numbers
  getPhoneDisplay(phone?: string): string {
    if (!phone) return '-'

    const country = this.countryListData.find(
      item => item.CountryCode == this.adminDetails.CountryCode
    )

    const code = country ? country.CountryCode : this.adminDetails.CountryCode;
    return `${phone}`
  }



}
