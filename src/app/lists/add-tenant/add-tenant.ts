import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
  OnInit,
  NgZone
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

  constructor(private ngZone: NgZone) { }

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
    PlaceId: '',
    MapUrl: '',
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

  onAddressInput(event: any) {

    const value = event.target.value;

    this.model.Address = value;

    if (!value?.trim()) {
      this.locationPredictions = [];
      return;
    }

    this.autocompleteService.getPlacePredictions(
      {
        input: value,
        types: ['establishment']
      },
      (predictions: any[]) => {

        this.ngZone.run(() => {
          this.locationPredictions = predictions || [];
        });

      }
    );
  }

  onAddressSelected(event: any) {

    const selectedDescription =
      event.option.value;

    const selectedPlace =
      this.locationPredictions.find(
        x => x.description === selectedDescription
      );

    if (!selectedPlace) return;

    this.placesService.getDetails(
      {
        placeId: selectedPlace.place_id,
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'geometry',
          'address_components'
        ]
      },
      (place: any, status: any) => {

        if (
          status !==
          google.maps.places.PlacesServiceStatus.OK
        ) return;

        this.ngZone.run(() => {

          this.model.Address =
            place.formatted_address;

          const locality =
            place.address_components?.find(
              (x: any) =>
                x.types.includes('locality')
            );

          const district =
            place.address_components?.find(
              (x: any) =>
                x.types.includes(
                  'administrative_area_level_2'
                )
            );

          this.model.LocationName =
            locality?.long_name ||
            district?.long_name ||
            '';

          const lat =
            place.geometry.location.lat();

          const lng =
            place.geometry.location.lng();

          this.model.Latitude =
            lat.toFixed(7);

          this.model.Longitude =
            lng.toFixed(7);

          this.model.PlaceId =
            place.place_id;

          this.model.MapUrl =
            `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

          this.locationPredictions = [];

        });

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
      PlaceId: '',
      MapUrl: '',
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