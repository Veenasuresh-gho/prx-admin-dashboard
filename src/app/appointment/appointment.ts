import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-appointment',
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
    GHOInput
  ],
  templateUrl: './appointment.html',
  styleUrl: './appointment.css',
})
export class Appointment {

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
    'AppointmentID',
    'Doctor',
    'Patient',
    'Tenant',
    'AppointmentTime',
    'TotalBillAmount',
    'PayStatus',
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

    const today = new Date();

    this.selectedDateFormatted = this.formatDate(today);
    this.startDateFormatted = this.formatDate(today);

    this.appointmentList();
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  onTabChange(event: number): void {
    this.tbidx = event;
  }

  applyFilter(event: any): void {
    const filterValue = event.target.value;

    this.dataSource.filter = filterValue
      .trim()
      .toLowerCase();
  }

  onDateChange(date: Date | null) {

    if (!date) return;

    this.startDateFormatted = '';
    this.endDateFormatted = '';

    this.selectedDateFormatted =
      this.formatDate(date);

    this.appointmentList();
  }

  onRangeChange(range: { start: Date | null; end: Date | null }) {

    if (!range.start || !range.end) return;

    this.selectedDateFormatted = '';

    this.startDateFormatted =
      this.formatDate(range.start);

    this.endDateFormatted =
      this.formatDate(range.end);

    this.appointmentList();
  }

  appointmentList(): void {

    this.loading = true;

    const fromDate =
      this.startDateFormatted || this.selectedDateFormatted;

    const toDate =
      this.endDateFormatted || '';

    this.tv = [
      {
        T: 'dk1',
        V: fromDate
      },
      {
        T: 'dk2',
        V: toDate
      },
      {
        T: 'c10',
        V: '14'
      }
    ];


    this.srv.getdata('adminuser', this.tv)
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
