import {
  Component,
  inject,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


import { GHOService } from '../../services/ghosrvs';
import { tags } from '../../model/ghomodel';

declare var google: any;


@Component({
  selector: 'app-add-tenant-doctor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  templateUrl: './add-tenant-doctor.html',
  styleUrls: ['./add-tenant-doctor.css']
})
export class AddTenantDoctor implements AfterViewInit {

  @Input() tenant: any;

  @ViewChild('locationInput')
  locationInput!: ElementRef;

  srv = inject(GHOService);

  loading = false;
  hidePassword = true;

  tv: tags[] = [];
  cntrys: any[] = [];
  phoneMaxLength: any = null;

  autocompleteService: any;
  placesService: any;
  locationPredictions: any[] = [];

  specialtiesList: any[] = [];
  selectedSpecialty: any = null;

  categoryList = [
    { ID: 1, categoryName: 'MD' },
    { ID: 2, categoryName: 'Wellness' },
    { ID: 3, categoryName: 'Nutrition' },
    { ID: 4, categoryName: 'Mental Health' }
  ];

  model = {
    DoctorID: '',
    TenantID: '',
    Title: '',
    FirstName: '',
    LastName: '',
    Email: '',
    CountryID: '',
    Phone: '',
    Bio: '',
    Gender: '',
    DOB: '',
    Password: '',
    Designation: '',
    Address: '',
    Location: '',
    Category: '',
    ApptLength: '',
    MaxBookingPerSlot: '',
    RatePerVisit: '',
    Currency: '',
    RoomNumber: '',
    Longitude: '',
    Latitude: '',
    Status: ''
  };

  ngOnInit() {

    this.getcntry();
    this.getSpecialty();

  }

  ngAfterViewInit() {

    this.autocompleteService =
      new google.maps.places.AutocompleteService();

    this.placesService =
      new google.maps.places.PlacesService(
        document.createElement('div')
      );
  }

  ngOnChanges() {

    if (this.tenant) {
      this.model.TenantID =
        this.tenant.TenantID;
    }

  }

  // Country

  getcntry() {

    this.tv = [
      { T: 'c10', V: '99' }
    ];

    this.srv
      .getdata('lists', this.tv)
      .subscribe((r: any) => {

        if (r.Status === 1) {

          this.cntrys = r.Data[0];

        }

      });

  }

  onLocationInput(event: any) {

    const value = event.target.value;

    this.model.Location = value;

    if (!value) {

      this.locationPredictions = [];
      return;

    }

    this.autocompleteService
      .getPlacePredictions(
        {
          input: value
        },

        (predictions: any[]) => {

          this.locationPredictions =
            predictions || [];

        }

      );

  }

  onLocationSelected(event: any) {

    const selectedDescription =
      event.option.value;

    const selectedPlace =
      this.locationPredictions.find(
        x =>
          x.description
          === selectedDescription
      );

    if (!selectedPlace) return;

    this.placesService.getDetails(
      {
        placeId:
          selectedPlace.place_id
      },

      (place: any, status: any) => {

        if (
          status ===
          google.maps.places
            .PlacesServiceStatus.OK
        ) {

          this.model.Address =
            place.formatted_address || '';

          this.model.Location =
            place.name ||
            selectedDescription
              .split(',')[0]
              .trim();

          this.model.Latitude =
            place.geometry.location
              .lat()
              .toString();

          this.model.Longitude =
            place.geometry.location
              .lng()
              .toString();
        }

      }

    );

  }


  onCountryChange() {

    const country = this.cntrys.find(
      x => Number(x.CountryID)
        === Number(this.model.CountryID)
    );

    if (country) {

      this.model.Currency =
        country.CurrencyCode;

      this.phoneMaxLength =
        country.MaxLength;

    }

  }

  limitPhoneLength() {

    if (
      this.model.Phone &&
      this.phoneMaxLength
    ) {

      this.model.Phone =
        this.model.Phone
          .slice(0, this.phoneMaxLength);

    }

  }

  // Specialty

  getSpecialty() {

    this.tv = [
      { T: 'c10', V: '3' }
    ];

    this.srv
      .getdata('specialty', this.tv)
      .subscribe((r: any) => {

        if (r.Status === 1) {

          this.specialtiesList =
            r.Data[0];

        }

      });

  }

  // Reset

  resetForm() {

    this.model = {

      DoctorID: '',
      TenantID: this.tenant?.TenantID || '',
      Title: '',
      FirstName: '',
      LastName: '',
      Email: '',
      CountryID: '',
      Phone: '',
      Bio: '',
      Gender: '',
      DOB: '',
      Password: '',
      Designation: '',
      Address: '',
      Location: '',
      Category: '',
      ApptLength: '',
      MaxBookingPerSlot: '',
      RatePerVisit: '',
      Currency: '',
      RoomNumber: '',
      Longitude: '',
      Latitude: '',
      Status: ''

    };

    this.selectedSpecialty = null;

  }

  saveDoctorSpecialty(doctorId: any) {

    const tv = [
      { T: 'dk2', V: doctorId },
      { T: 'c1', V: this.selectedSpecialty?.ID },
      { T: 'c2', V: "M" },
      { T: 'c3', V: this.model.RatePerVisit || '0' },
      { T: 'c10', V: '1' }
    ];

    return this.srv.getdata(
      'doctorspecialty',
      tv
    );
  }

  // Save

  saveUser(form: NgForm) {

    if (form.invalid) {

      form.control.markAllAsTouched();

      return;

    }

    if (!this.tenant?.TenantIDAlt) {

      console.log('Tenant not found');

      return;

    }

    this.loading = true;

    const payload = {

      DoctorID: this.model.DoctorID,
      TenantID: this.tenant.TenantIDAlt,

      Title: this.model.Title,
      FirstName: this.model.FirstName,
      LastName: this.model.LastName,

      Email: this.model.Email,

      CountryID:
        String(this.model.CountryID),

      Phone: this.model.Phone,

      Gender: this.model.Gender,
      DOB: this.model.DOB,

      Password: this.model.Password,

      Designation:
        this.model.Designation,

      Category:
        Number(this.model.Category),

      SpecialtyID:
        this.selectedSpecialty?.ID || 0,

      Bio: this.model.Bio,

      Address: this.model.Address,
      Location: this.model.Location,

      ApptLength:
        this.model.ApptLength,

      MaxBookingPerSlot:
        this.model.MaxBookingPerSlot,

      RatePerVisit:
        this.model.RatePerVisit,

      Currency:
        this.model.Currency,

      RoomNumber:
        this.model.RoomNumber,

      Longitude:
        this.model.Longitude,

      Latitude:
        this.model.Latitude

    };

    this.tv = [
      {
        T: 'dk2',
        V: this.tenant.TenantIDAlt
      },
      {
        T: 'c1',
        V: JSON.stringify(payload)
      },
      {
        T: 'c10',
        V: '1'
      }
    ];

    this.srv
      .getdata('Doctors', this.tv)
      .subscribe({

        next: (res: any) => {

          this.loading = false;

          if (res.Status === 1) {
            console.log(res)
            const doctorId =
              res?.Data?.[0]?.[0]?.id;

            this.saveDoctorSpecialty(doctorId)
              .subscribe({

                next: () => {

                  this.srv.openDialog(
                    'Success',
                    's',
                    'Doctor added successfully'
                  );

                  this.resetForm();
                  form.resetForm();

                },

                error: () => {

                  this.srv.openDialog(
                    'Error',
                    'e',
                    'Doctor saved but specialty failed'
                  );

                }

              });

          }

        }
      });

  }

}