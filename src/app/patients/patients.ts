import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Component, inject, ViewChild } from '@angular/core';
import { Calender } from '../login-list/calender/calender';
import { GHOService } from '../services/ghosrvs';
import { tags } from '../model/ghomodel';
import { GHOInput } from '../components/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Calender,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    GHOInput,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './patients.html',
  styleUrl: './patients.css',
})
export class Patients {

  srv = inject(GHOService);
  platform: string = '';

  tv: tags[] = [];

  tbidx = 0;
  fltr = '';
  loading = false;

  selectedDateFormatted: string = '';

  startDateFormatted: string = '';
  endDateFormatted: string = '';

  columns: string[] = [
    'PatientID',
    'FullName',
    'Email',
    'Phone',
    'Address',
  ];

  dataSource = new MatTableDataSource<any>([]);
  private _paginator!: MatPaginator;


  @ViewChild(MatPaginator)
  set paginator(value: MatPaginator) {
    if (value) {
      this._paginator = value;
      this.dataSource.paginator = value;
    }
  }

  ngOnInit(): void {
    this.patientList();
  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  onTabChange(event: number): void {
    this.tbidx = event;
  }

  clearSearch(): void {
    this.fltr = '';
    this.patientList();
  }

  applySearch(): void {
    this.loading = true;

    this.tv = [
      {
        T: 'dk1',
        V: this.fltr
      },
      {
        T: 'c10',
        V: '4'
      }
    ];

    this.srv.getdata('patient', this.tv).subscribe({
      next: (r: any) => {
        this.loading = false;

        if (r?.Status === 1) {
          this.dataSource.data = r.Data?.[0] || [];
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    });
  }

  patientList(): void {

    this.loading = true;

    this.tv = [
      {
        T: 'dk1',
        V: ''
      },
      {
        T: 'c10',
        V: '3'
      }
    ];


    this.srv.getdata('patient', this.tv)
      .subscribe({

        next: (r: any) => {
          this.loading = false;

          if (r?.Status === 1) {
            const users = r?.Data?.[0] || [];

            this.dataSource.data = this.platform
              ? users.filter(
                (x: any) => x.Source?.toLowerCase() === this.platform
              )
              : users;

            this.dataSource.paginator = this.paginator;
          }
        },

        error: (err) => {

          this.loading = false;

          console.error(err);

        }
      });
  }

}
