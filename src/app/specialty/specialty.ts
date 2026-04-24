import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { GHOService } from '../services/ghosrvs';
import { tags } from '../model/ghomodel';
import { GHOInput } from 'sk-ghocomps';

@Component({
  selector: 'app-specialty',
  standalone: true,
  imports: [
    CommonModule,GHOInput,
    FormsModule,
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

  // 🔹 Form model
  specialtyModel = {
    SpecialtyName: '',
    SpecialtyType: '',
    RateAmount: null as number | null
  };

  // 🔹 Table data
  specialtiesList: any[] = [];

  ngOnInit(): void {
    this.getGlobalSpecialties();
  }

  // 🔹 Reset form
  resetSpecialtyForm() {
    this.specialtyModel = {
      SpecialtyName: '',
      SpecialtyType: '',
      RateAmount: null
    };
  }
  searchText: string = '';
filteredSpecialties: any[] = [];

applyFilter() {

  const value = this.searchText?.toLowerCase()?.trim();

  if (!value) {
    // ✅ Reset to full list
    this.filteredSpecialties = [...this.specialtiesList];
    return;
  }

  this.filteredSpecialties = this.specialtiesList.filter(x =>
    x.SpecialtyName?.toLowerCase().includes(value)
  );
}

  // 🔹 Add Speciality
  addSpecialty() {

    if (!this.specialtyModel.SpecialtyName) {
      this.srv.openDialog('Error', 'e', 'Speciality name required');
      return;
    }

    const payload = {
      SpecialtyName: this.specialtyModel.SpecialtyName,
      SpecialtyType: this.specialtyModel.SpecialtyType,
      RateAmount: this.specialtyModel.RateAmount
    };

    this.tv = [
      { T: 'c1', V: JSON.stringify(payload) },
      { T: 'c10', V: '1' } // create
    ];


    this.srv.getdata('specialty', this.tv).subscribe({
      next: (res) => {


        if (res.Status === 1) {

          this.srv.openDialog('Success', 's', 'Speciality added');

          this.resetSpecialtyForm();

          // 🔥 IMPORTANT: reload from API (not push)
          this.getGlobalSpecialties();

        } else {
          this.srv.openDialog('Error', 'e', res.Info || 'Failed');
        }

      },
      error: (err) => {
        console.error('ADD ERROR:', err);
        this.srv.openDialog('Error', 'e', 'API Error');
      }
    });
  }

  // 🔹 Get Global Specialities
  getGlobalSpecialties() {

    this.loading = true;

    this.tv = [
      { T: 'c10', V: '3' } // get global list
    ];


    this.srv.getdata('specialty', this.tv).subscribe({
      next: (res) => {

        this.loading = false;

if (res.Status === 1 && res?.Data?.length > 0) {

  this.specialtiesList = res.Data[0] || [];

  // ✅ IMPORTANT
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

}