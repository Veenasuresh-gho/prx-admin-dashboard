import { Component, EventEmitter, inject, Input, OnChanges, OnInit, AfterViewInit, Output, SimpleChanges, NgZone } from '@angular/core';
import { tags } from '../../model/ghomodel';
import { GHOService } from '../../services/ghosrvs';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { TenantUserList } from '../tenant-user-list/tenant-user-list';
import { TenantDoctorsList } from '../tenant-doctors-list/tenant-doctors-list';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

declare var google: any;

@Component({
  selector: 'tenant-details',
  templateUrl: './tenant-details.html',
  imports: [CommonModule,
    FormsModule, MatTableModule,
    MatIcon,
    MatFormFieldModule,
    MatInputModule, MatSelectModule, TenantUserList, TenantDoctorsList, MatAutocompleteModule],
  styleUrl: './tenant-details.css',
})
export class TenantDetails implements OnChanges, AfterViewInit {
  srv = inject(GHOService);
  tv: tags[] = [];
  details: any;
  @Input() tenant: any;
  loading: boolean = false;
  isEditMode: boolean = false;
  tenantTypes: any[] = [];
  cntrys: any[] = [];
  @Output() updated = new EventEmitter<void>();
  @Output() editSpecialty = new EventEmitter<any>();
  @Input() refreshTrigger: number = 0;
  selectedSpecialty: any = null;
  tbidx: number;

  autocompleteService: any;
  placesService: any;
  locationPredictions: any[] = [];

  constructor(private dialog: MatDialog, private ngZone: NgZone) { }

  ngAfterViewInit(): void {
    this.autocompleteService =
      new google.maps.places.AutocompleteService();

    this.placesService =
      new google.maps.places.PlacesService(
        document.createElement('div')
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tenant'] && this.tenant) {
      this.loadAllData();
    }
  }
  loadAllData() {
    this.getTenantType();
  }

  onLocationInput(event: any) {
    const value = event.target.value;

    this.details.Location = value;

    if (!value || value.length < 1) {
      this.locationPredictions = [];
      return;
    }

    this.autocompleteService.getPlacePredictions(
      { input: value },
      (predictions: any[]) => {
        this.locationPredictions = predictions || [];
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

          this.ngZone.run(() => {
            const fullAddress =
              place.formatted_address || '';

            const shortName =
              place.name ||
              selectedDescription.split(',')[0].trim();

            this.details.Location = shortName;

            this.details.Address = fullAddress;

            this.details.LocationFull = fullAddress;

            this.details.Latitude =
              place.geometry.location.lat().toString();

            this.details.Longitude =
              place.geometry.location.lng().toString();

            console.log(this.details);
          });

        }
      }
    );
  }


  getTenantType() {
    this.tv = [{ T: 'c10', V: '1' }];

    this.srv.getdata('Tenants', this.tv).subscribe(r => {
      if (r.Status === 1) {
        this.tenantTypes = r.Data[0];

        this.getTenantDetails();
        this.getCountries();
      }
    });
  }

  tenantUsersList: any[] = [];

  onUsersLoaded(users: any[]) {
    this.tenantUsersList = users;
  }



  deleteTenant() {

    this.tv = [
      { T: 'dk1', V: this.tenant?.TenantIDAlt },
      { T: 'c10', V: '4' }
    ];

    this.srv.getdata('Tenants', this.tv).subscribe(r => {
      const message = r?.Data?.[0]?.[0]?.Msg || 'Deleted';

      if (r.Status === 1) {
        this.srv.openDialog('Success', 's', message);
      }
    });
  }

  getCountries() {
    this.tv = [{ T: 'c10', V: '99' }];

    this.srv.getdata('lists', this.tv).subscribe(r => {
      if (r.Status === 1) {
        this.cntrys = r.Data[0];
        this.getTenantDetails();

        if (this.details?.CountryID) {
          this.details.CountryID = Number(this.details.CountryID);
        }

      }
    });
  }

  mapType() {
    if (!this.details || !this.tenantTypes?.length) return;

    const match = this.tenantTypes.find(
      t => t.Tenant === this.details.Type
    );

    if (match) {
      this.details.Type = match.ID;
    }

  }

  getTenantDetails() {
    this.loading = true;

    this.tv = [
      { T: 'dk1', V: this.tenant?.TenantIDAlt },
      { T: 'c10', V: '11' }
    ];

    this.srv.getdata('Tenants', this.tv).subscribe(r => {
      this.loading = false;

      if (r.Status === 1) {

        this.details = r.Data[0][0];

        //  COVER IMAGE (Data[1])
        const cover = r.Data[1]?.[0];
        if (cover && cover._url) {
          this.details.CoverImage = cover._url;
        }

        //  LOGO IMAGE (Data[2])
        const logo = r.Data[2]?.[0];
        if (logo && logo._url) {
          this.details.Logo = logo._url;
        }

        this.details.CountryID = Number(this.details.CountryID);

        if (this.tenantTypes?.length) {
          const match = this.tenantTypes.find(
            t => t.Tenant === this.details.Type
          );
          if (match) {
            this.details.Type = match.ID;
          }
        }
      }
    });
  }

  fieldStyle: any = 'outline';
  res: any;


  onCountryChange(value: number) {
    this.details.CountryID = value;
  }
  getSelectedCountryCode(): string {
    const country = this.cntrys.find(
      c => c.CountryID === this.details?.CountryID
    );
    return country ? country.CountryCode : '';
  }

  imageFile: File | null = null;
  imagePreview: string | null = null;
  userId: string = '';
  logoFile: File | null = null;
  logoPreview: string | null = null;

  onCoverSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.imageFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onLogoSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.logoFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.logoPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  updateTenant() {

    const payload = {
      TenantName: this.details['TenantName'],
      TenantTypeID: this.details['Type'],
      About: this.details['About'],
      Email: this.details['Email'],
      CountryID: this.details['CountryID'],
      Phone: this.details['Phone'],
      WebsiteLink: this.details['WebsiteLink'],
      Address: this.details['Address'],
      LocationName: this.details['Location'],
      MapUrl: this.details['MapUrl'],
      IsActive: this.details['IsActive'],
      Latitude: this.details['Latitude'],
      Longitude: this.details['Longitude']
    };

    this.tv = [
      { T: 'dk1', V: this.details['TenantIDAlt'] },
      { T: 'c1', V: JSON.stringify(payload) },
      { T: 'c10', V: '9' }
    ];

    this.srv.getdata('Tenants', this.tv).subscribe({
      next: async (r) => {

        const message = r?.Data?.[0]?.[0]?.msg || 'Updated';

        if (r.Status === 1) {


          const tenantId = this.details.TenantIDAlt;

          //  LOGO IMAGE (docType 31)
          if (this.imageFile && tenantId) {
            const success = await this.srv.handleFileUpload(
              this.userId,
              tenantId,

              this.imageFile,
              '31'
            );

            if (!success) {
              this.srv.openDialog('Warning', 'w', 'Cover upload failed');
            }
          }

          if (this.logoFile && tenantId) {
            const success = await this.srv.handleFileUpload(

              this.userId,
              tenantId,
              this.logoFile,
              '30'
            );

            if (!success) {
              this.srv.openDialog('Warning', 'w', 'Logo upload failed');
            }
          }

          this.srv.openDialog('Success', 's', message);

          this.updated.emit();
          this.getTenantDetails();

          // cleanup
          this.imageFile = null;
          this.imagePreview = null;

        } else {
          this.srv.openDialog('Error', 'e', r.Info || 'Update failed');
        }
      },
      error: () => {
        this.srv.openDialog('Error', 'e', 'API error');
      }
    });
  }

}