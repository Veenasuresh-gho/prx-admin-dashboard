import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { GHOService } from '../services/ghosrvs';
import { tags } from '../model/ghomodel';
import { MatOption } from '@angular/material/select';
import { GHOInput } from '../components/input';

@Component({
  selector: 'app-specialty',
  standalone: true,
  imports: [
    CommonModule,GHOInput,
    FormsModule,MatOption,
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './specialty.html',
  styleUrl: './specialty.css',
})
export class Specialty implements OnInit {

  srv = inject(GHOService);
  tv: tags[] = [];

  loading: boolean = false;
  detailsTabEnabled:boolean = false;
  selectedSpecialty: any = null;

  specialtyModel = {
    SpecialtyName: '',
    SpecialtyType: '',
    RateAmount: null as number | null
  };

  specialtiesList: any[] = [];

  ngOnInit(): void {
    this.getGlobalSpecialties();
  }


  searchText: string = '';
filteredSpecialties: any[] = [];
  fieldStyle: any = 'outline';

applyFilter() {

  const value = this.searchText?.toLowerCase()?.trim();

  if (!value) {

    this.filteredSpecialties = [...this.specialtiesList];
    return;
  }

  this.filteredSpecialties = this.specialtiesList.filter(x =>
    x.SpecialtyName?.toLowerCase().includes(value)
  );
}

  getGlobalSpecialties() {

    this.loading = true;

    this.tv = [
      { T: 'c10', V: '3' } 
    ];


    this.srv.getdata('specialty', this.tv).subscribe({
      next: (res) => {

        this.loading = false;

if (res.Status === 1 && res?.Data?.length > 0) {

  this.specialtiesList = res.Data[0] || [];

  this.filteredSpecialties = [...this.specialtiesList];

} else {
  this.specialtiesList = [];
  this.filteredSpecialties = [];
}

      },
      error: (err) => {

        this.loading = false;

        console.error('GET ERROR:', err);

        this.specialtiesList = [];

      }
    });
  }

selectedTabIndex: number = 0;

onSelectSpecialty(row: any) {
  this.detailsTabEnabled = true;

  this.getSpecialtyDetails(row.ID);

  this.selectedTabIndex = 1; // 🔥 switch tab
}

getSpecialtyDetails(specialtyId: number) {

  this.tv = [
    { T: 'dk1', V: specialtyId.toString() }, 
    { T: 'c10', V: '3' }
  ];

  this.srv.getdata('specialty', this.tv).subscribe(res => {

    if (res.Status === 1) {

      const data = res?.Data?.[0]?.[0];

      this.selectedSpecialty = data;

    } else {
      console.error('Failed to load details');
    }

  });
}
}