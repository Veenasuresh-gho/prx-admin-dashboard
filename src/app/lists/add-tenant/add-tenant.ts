import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule, MatButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GHOService } from '../../services/ghosrvs';
import { tags } from '../../model/ghomodel';

declare var google: any;

@Component({
  selector: 'add-tenant',
  standalone: true,

  imports: [
    FormsModule,

    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButton,
    MatButtonModule,
    MatCheckboxModule
  ],

  templateUrl: './add-tenant.html',
  styleUrl: './add-tenant.css',
})

export class AddTenant implements OnInit, AfterViewInit {

  @ViewChild('locationInput')
  locationInput!: ElementRef;

  srv = inject(GHOService);

  tv: tags[] = [];

  cntrys: any[] = [];

  tenantTypes: any[] = [];

  autocompleteService: any;

  placesService: any;

  locationPredictions: any[] = [];

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
    PostalCode: '',
    Longitude: '',
    Latitude: '',
    IsVerified: 0
  };

  ngOnInit(): void {

    this.getcntry();

    this.getTenantType();
  }

  ngAfterViewInit(): void {

    this.autocompleteService =
      new google.maps.places.AutocompleteService();

    this.placesService =
      new google.maps.places.PlacesService(
        document.createElement('div')
      );
  }

  onLocationInput(event: any) {

    const value = event.target.value;

    this.model.LocationName = value;

    if (!value || value.length < 1) {

      this.locationPredictions = [];

      return;
    }

    this.autocompleteService.getPlacePredictions(
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

    const selectedDescription = event.option.value;

    const selectedPlace = this.locationPredictions.find(
      x => x.description === selectedDescription
    );

    if (!selectedPlace) return;

    this.placesService.getDetails(
      { placeId: selectedPlace.place_id },
      (place: any, status: any) => {

        if (status === google.maps.places.PlacesServiceStatus.OK) {

          this.model.LocationName = place.formatted_address || '';

          const shortName =
            place.name ||
            selectedDescription.split(',')[0].trim();

          this.model.LocationName = shortName;

          this.model.Latitude =
            place.geometry.location.lat().toString();

          this.model.Longitude =
            place.geometry.location.lng().toString();
        }
      }
    );
  }

  getTenantType() {

    this.tv = [
      { T: 'c10', V: '1' }
    ];

    this.srv.getdata(
      'Tenants',
      this.tv
    ).subscribe(r => {

      if (r.Status === 1) {

        this.tenantTypes =
          r.Data[0];
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
      PostalCode: '',
      Longitude: '',
      Latitude: '',
      IsVerified: 0
    };

    this.locationPredictions = [];
  }

  submit(form: any) {

    if (form.invalid) {

      form.control.markAllAsTouched();

      return;
    }

    this.model.IsVerified = this.model.IsVerified ? 1 : 0;


    this.tv = [
      {
        T: 'c1',
        V: JSON.stringify(this.model)
      },
      {
        T: 'c10',
        V: '3'
      }
    ];

    this.srv.getdata(
      'Tenants',
      this.tv
    ).subscribe(r => {

      if (r.Status === 1) {

        this.srv.openDialog(
          'Success',
          's',
          r.Data[0]?.[0].msg
        );
      }
    });

    this.resetForm();
  }

  getcntry() {

    this.tv = [
      { T: 'c10', V: '99' }
    ];

    this.srv.getdata(
      'lists',
      this.tv
    ).subscribe(r => {

      if (r.Status === 1) {

        this.cntrys = r.Data[0];

        this.model.CountryID = null;
      }
    });
  }

  getSelectedCountryCode(): string {

    const country =
      this.cntrys.find(
        c => c.CountryID === this.model.CountryID
      );

    return country
      ? country.CountryCode
      : '';
  }
}