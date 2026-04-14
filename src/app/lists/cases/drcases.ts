import { Component, inject, ViewChild, Inject, Input, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIcon } from '@angular/material/icon';
import { MatRadioGroup, MatRadioButton, MatRadioModule, MatRadioChange } from '@angular/material/radio';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs';
import { GHOService } from '../../services/ghosrvs';
import { GHOUtitity } from '../../services/utilities';
import { tags } from '../../model/ghomodel';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AdminCaseDetail } from "../../cases/case-detail/case-detail";

@Component({
    selector: 'admin-drcases',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatTableModule,
        MatTabsModule,
        MatRadioModule,
        MatPaginatorModule,
        MatPaginator,
        MatSortModule,
        MatDialogModule,
        MatCheckboxModule,
        AdminCaseDetail
    ],
    templateUrl: './drcases.html',
})
export class AdminDrCases {

    @Input() drid: string = "0";
    msg: string = "";
    srv = inject(GHOService);
    utl = inject(GHOUtitity);
    tv: tags[] = [];
    ds: [] = [];
    tbidx: number = 0;
    caseid: string = "0";
    selectedRow: any = null;
    listtitle: string = "";
    selectedFiles: File[] = [];
    revname: string = "";

    dataSource = new MatTableDataSource<[]>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    mode: string = "1";

    constructor(private cdr: ChangeDetectorRef) { }
    columns: string[] = ['Claimant', 'TAT', 'RevStatus', 'RequestDate', 'DueDate', "AssignedToReviewerDate", "RequestedSpecialty", "ReviewerDueDate", "SubmittedDate"];

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    chng(v: MatRadioChange) {
        this.mode = v.value
        this.caselist();
    }

    ngOnInit(): void {
        if (!this.srv.validstr(this.drid) || this.drid.length < 10) {
            return;
        }
        this.caselist();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['drid']) {
            if (changes['drid'].currentValue != changes['drid'].previousValue) {
                this.mode = "1";
                this.caselist();

            }
        }
    }

    onRowClick(r: any) {
        this.caseid = r.id;
        this.tbidx = 1;
        this.selectedRow = r;
    }

    caselist() {
        this.caseid = "0";
        this.tv = [];
        this.tv.push({ T: "dk1", V: this.drid });
        this.tv.push({ T: "dk2", V: this.mode });
        this.tv.push({ T: "c10", V: "105" });

        this.srv.getdata("admindash", this.tv)
            .pipe(catchError((err) => { throw err; }))
            .subscribe((r) => {
                if (r.Status == 1) {
                    this.ds = r.Data[0];
                    this.dataSource.data = this.ds;
                    this.cdr.detectChanges();
                }
            });
    }
    activeTabIndex = 0;


}
