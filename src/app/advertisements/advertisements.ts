
import {
  Component,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GHOService } from '../services/ghosrvs';
import { tags } from '../model/ghomodel';
import { TenantDetails } from '../lists/tenant-details/tenant-details';
import { AddNew } from './add-new/add-new';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { GHOdropdown } from '../components/dropdown';
import { GHOInput } from '../components/input';

@Component({
  selector: 'app-advertisements',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    GHOdropdown,
    GHOInput,
    MatTabsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    TenantDetails,
    AddNew
  ],
  templateUrl: './advertisements.html',
  styleUrl: './advertisements.css',
})
export class Advertisements implements AfterViewInit {

  srv = inject(GHOService);
  dialog = inject(MatDialog);
  constructor(private cdr: ChangeDetectorRef) { }

  tv: tags[] = [];
  cntrys: any[] = [];
  tbidx: number = 0;
  loading: boolean = false;
  selectedAd: any = null;
  detailsTabEnabled: boolean = false;

  adList: any[] = [];
  dataSource = new MatTableDataSource<any>();
  columns: string[] = ['Filename', 'Title', 'Subtitle', 'Type', 'Status', 'Actions'];

  cn: string = '0';
  fltr: string = '';

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getcntry();
    this.list();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  selectAd(row: any) {
    this.selectedAd = row;
    this.detailsTabEnabled = true;
    this.tbidx = 1;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  get(e: MatSelectChange) {
    this.cn = e.value;
    this.list();
  }

  getc(e: any) {
    this.cn = e;
    this.list();
  }

  onTabChange(index: number) {
    this.tbidx = index;

    if (index === 0) {
      this.selectedAd = null;
    }
  }

  deleteAdById(id: string) {
    this.loading = true;

    this.tv = [
      { T: 'dk1', V: id },
      { T: 'c10', V: '4' }
    ];

    this.srv.getdata('adminuser', this.tv).subscribe(r => {
      if (r.Status === 1) {
        this.list();
      }
    });
  }

  deleteAd(element: any, event: Event) {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAdById(element.AdID);
      }
    });
  }

  getcntry() {
    this.tv = [{ T: 'c10', V: '83' }];

    this.srv.getdata('lists', this.tv).subscribe(r => {
      if (r.Status === 1) {
        this.cntrys = r.Data[0];
      }
    });
  }

  list() {
    this.loading = true;

    this.tv = [
      { T: 'c10', V: '3' }
    ];

    this.srv.getdata('adminuser', this.tv).subscribe(r => {
      this.loading = false;

      if (r.Status === 1) {
        this.adList = r.Data[0];
        this.dataSource.data = this.adList;

        this.cdr.detectChanges();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }
}