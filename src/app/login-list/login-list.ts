import {
  Component,
  inject,
  OnInit,
  ViewChild,
  AfterViewInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { tags } from '../model/ghomodel';
import { GHOService } from '../services/ghosrvs';
import { Calender } from './calender/calender';
import { GHOInput } from '../components/input';

@Component({
  selector: 'app-login-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Calender,
    GHOInput,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login-list.html',
  styleUrls: ['./login-list.css']
})
export class LoginList implements OnInit, AfterViewInit {

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
    'UserID',
    'FullName',
    'Email',
    'Phone',
    'LastLoginTime',
    'Source'
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngOnInit(): void {

    const today = new Date();

    this.selectedDateFormatted = this.formatDate(today);

    this.startDateFormatted = this.formatDate(today);
    this.loginlist();
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

    this.loginlist();
  }

  onRangeChange(range: { start: Date | null; end: Date | null }) {

    if (!range.start || !range.end) return;

    this.selectedDateFormatted = '';

    this.startDateFormatted =
      this.formatDate(range.start);

    this.endDateFormatted =
      this.formatDate(range.end);

    this.loginlist();
  }

  loginlist(): void {

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
        V: '6'
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
                (x: any) =>
                  x.Source?.toLowerCase() === this.platform
              )
              : users;
          }
        },

        error: (err) => {

          this.loading = false;

          console.error(err);

        }
      });
  }
}