import { Component, inject, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioGroup, MatRadioButton, MatRadioModule, MatRadioChange } from '@angular/material/radio';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs';
import { GHOService } from '../services/ghosrvs';
import { GHOUtitity } from '../services/utilities';
import { tags } from '../model/ghomodel';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AdminCaseDetail } from "./case-detail/case-detail";
import { GHOdropdown } from '../components/dropdown';
import { GHOInput } from '../components/input';

@Component({
  selector: 'admin-cases',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatLabel,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatTabsModule,
    MatRadioGroup,
    MatRadioModule,
    MatRadioButton,
    MatPaginatorModule,
    MatPaginator,
    MatSortModule,
    MatDialogModule,
    MatCheckboxModule,
    AdminCaseDetail,
    GHOdropdown,GHOInput
],
  templateUrl: './cases.html',
  styleUrl: './cases.css',
})
export class AdminCases {

  msg: string = "";
  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  ds: [] = [];
  id: string = "0";
  caseid: string = "0";
  caseReviewerId: string = "0";
  tbidx: number = 0;
  listtitle: string = "";
  selectedCase: any = null;
  selectedFiles: File[] = [];
  caseDetails: any;
  fileType: string = "0";
  fileId: string = "0";
  fileUploadId: any;
  stlist:[]=[];
  cntry:[]=[];
  selectedRow: any = null;
  url: any;
  isOpenCase: boolean = true;
  clmt: string = "";
  sts: string = "";
  cntryid: any = "0";
  fltr:string="";

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router, private rt: ActivatedRoute,private cdr: ChangeDetectorRef, private dialog: MatDialog) { }

  columns: string[] = ['Claimant', 'TAT', 'sts', 'RequestDate', 'DueDate', "ReviewerRegion", "RequestedSpecialty", "Reviewer"];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  stchange(v:any)
  {
    this.caselist(v);
  }


  selectedOption: any;

  

  ngOnInit(): void {
    this.id = this.srv.getsession("id");
    if (!this.srv.validstr(this.id) || this.id.length < 10) {
      this.srv.openDialog("Cases", "w", "Invalid credential, please login !");
      this.srv.logout();
      return;
    }
    this.stslist();
    this.caselist("2");
  }

  onRowClick(r: any) {
    this.caseid = r.id;
    this.caseReviewerId = r.caseid;
    this.selectedCase = r;
    this.clmt = r.Claimant;
    this.sts = r.sts
    this.tbidx = 1;
    this.selectedRow = r;
  }

 stslist() {
    this.tv = [];
    this.tv.push({ T: "c10", V: "199" });

    this.srv.getdata("admindash", this.tv)
      .pipe(catchError((err) => { throw err; }))
      .subscribe((r) => {
        if (r.Status == 1) {
          this.stlist = r.Data[0];
          this.cntry = r.Data[1];
          this.cdr.detectChanges();
        }
      });
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  caselist(v: any) {
    this.tv = [];
    this.tv.push({ T: "dk1", V: v });
    this.tv.push({ T: "c10", V: "102" });

    this.srv.getdata("admindash", this.tv)
      .pipe(catchError((err) => { throw err; }))
      .subscribe((r) => {
        if (r.Status == 1) {
          this.ds = r.Data[0];
          this.dataSource.data = this.ds;
          this.sts="";
          this.clmt="";
        }
      });
  }
}