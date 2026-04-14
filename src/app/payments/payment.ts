import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { GHOService } from '../services/ghosrvs';
import { catchError, map } from 'rxjs';
import { tags } from '../model/ghomodel'
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GHOUtitity } from '../services/utilities';
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'admin-payments',
  imports: [MatTableModule, MatPaginatorModule,
    MatInputModule, CommonModule, MatButtonModule, FormsModule,
    MatTabsModule, MatTableModule, MatSortModule],
  templateUrl: './payment.html',
  styles: `
    .horizontal-radio-group {
      flex-direction: row;
      gap: 16px;
    }
  `
})
export class AdminPayments {


  msg: string = "";
  srv = inject(GHOService);
  utl = inject(GHOUtitity);

  tv: tags[] = [];
  ds: [] = [];
  pay: [] = [];
  panding: [] = [];
  paiddtl: [] = [];
  opendtl: [] = [];
  selectedRow: any = null;
  id: string = "0";
  paycaseid: string = "0"
  pendingcaseid: string = "0"
  constructor(private router: Router, private rt: ActivatedRoute,
    private _liveAnnouncer: LiveAnnouncer
  ) {

  }

  dspay = new MatTableDataSource<any>();
  dspending = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paySort') paySort: MatSort;
  @ViewChild('pendingSort') pendingSort: MatSort;
  paycols: string[] = ['ReferenceCode', 'Patient', 'reviewer', 'TransactionDate', 'Amount'];
  pendingcols: string[] = ['CaseID', 'Patient', 'reviewer', 'SubmittedDate', 'Amount'];

@ViewChild('payPaginator') payPaginator!: MatPaginator;
@ViewChild('pendingPaginator') pendingPaginator!: MatPaginator;


  ngAfterViewInit() {
     this.dspay.paginator = this.payPaginator;
  this.dspending.paginator = this.pendingPaginator;

  this.dspay.sort = this.paySort;
  this.dspending.sort = this.pendingSort;
  }

  announceSortChange(sortState: Sort) {

    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  selectedPayRow: any = null;
  selectedPendingRow: any = null;

  selectPayRow(row: any) {
    this.selectedPayRow = row;
    this.paycasedtl(row.id);
  }

  selectPendingRow(row: any) {
    this.selectedPendingRow = row;
    this.pendingcasedtl(row.id);
  }





  ngOnInit(): void {
    this.id = this.srv.getsession("id");
    if (!this.srv.validstr(this.id) || this.id.length < 10) {
      this.srv.openDialog("Payment", "w", "Invalid credential, please login !")
      this.srv.logout();
      return;
    }
    this.paid();
    this.pending();
  }


  pending() {
    this.tv = [
      { T: "dk1", V: "0" },
      { T: "dk2", V: "30" },
      { T: "c1", V: "1" },
      { T: "c10", V: "12" }
    ];

    this.srv.getdata("accountpayable", this.tv)
      .pipe(catchError((err) => { throw err }))
      .subscribe((r) => {

        this.dspending.data = r.Data[0];

        // Load default pending case
        if (this.dspending.data.length > 0) {
          const first = this.dspending.data[0];

          this.selectedPendingRow = first;
          this.pendingcasedtl(first.id);
        }
      });
  }


  paid() {
    this.tv = [];
    this.tv.push({ T: "dk1", V: '0' })
    this.tv.push({ T: "dk2", V: "30" })
    this.tv.push({ T: "c1", V: "2" })
    this.tv.push({ T: "c10", V: "12" })
    this.srv.getdata("accountpayable", this.tv).pipe
      (
        catchError((err) => { throw err })
      ).subscribe((r) => {
        this.dspay.data = r.Data[0] || [];
        if (this.dspay.data.length > 0) {
          const first = this.dspay.data[0];
          this.selectedPayRow = first;
          this.paycasedtl(first.id);
        }
      }
      );
  }


  paycasedtl(id: any) {
    this.paycaseid = id;
    this.loadingCase = true;

    this.tv = [
      { T: "dk1", V: id },
      { T: "c10", V: "7" }
    ];
    this.srv.getdata("accountpayable", this.tv)
      .pipe(catchError(err => {
        console.error('API error', err);
        this.loadingCase = false;
        return [];
      }))
      .subscribe((res: any) => {
        this.loadingCase = false;
        if (res.Data && res.Data.length > 0) {
          this.paiddtl = res.Data[0][0];

        }
      });
  }



  pendingcasedtl(id: any) {
    this.pendingcaseid = id;
    this.loadingCase = true;

    this.tv = [
      { T: "dk1", V: id },
      { T: "c10", V: "7" }
    ];

    this.srv.getdata("accountpayable", this.tv)
      .pipe(catchError(err => {
        console.error('API error', err);
        this.loadingCase = false;
        return [];
      }))
      .subscribe((res: any) => {
        this.loadingCase = false;

        if (res.Data && res.Data.length > 0) {
          this.opendtl = res.Data[0][0];


        }
      });
  }


  loadingCase: boolean = false;
  getCaseDetails() {
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.id })
    this.tv.push({ T: "c10", V: "7" })
    this.srv.getdata("accountpayable", this.tv).pipe

      (
        catchError((err) => { throw err })
      ).subscribe((r) => {
        this.dspay.data = r.Data[0]
      }
      );
  }

}