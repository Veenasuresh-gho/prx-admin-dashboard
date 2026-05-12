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
    MatProgressSpinnerModule,
  ],
  templateUrl: './login-list.html',
  styleUrls: ['./login-list.css']
})
export class LoginList implements OnInit, AfterViewInit {

  srv = inject(GHOService);

  tv: tags[] = [];

  tbidx = 0;
  fltr = '';
  loading = false;

  selectedDateFormatted: string = '';

  columns: string[] = [
    'FullName',
    'Email',
    'Phone',
    'LastLoginTime',
    'UserID'
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngOnInit(): void {
    this.loginlist();
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

    console.log(filterValue); // FIXED
  }

  onDateChange(date: Date | null) {

    if (!date) return;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    this.selectedDateFormatted = `${day}/${month}/${year}`;

    console.log('Formatted Date:', this.selectedDateFormatted);

    // optional: reload API when date changes
    this.loginlist();
  }

  loginlist(): void {

    this.loading = true;

    this.tv = [
      { T: 'dk1', V: this.selectedDateFormatted || '' },
      { T: 'dk2', V: 'patient' },
      { T: 'c10', V: '6' }
    ];

    this.srv.getdata('adminuser', this.tv)
      .subscribe({

        next: (r: any) => {

          this.loading = false;

          if (r?.Status === 1) {
            this.dataSource.data = r?.Data?.[0] || [];
          }
        },

        error: (err) => {
          this.loading = false;
          console.error(err);
        }
      });
  }
}