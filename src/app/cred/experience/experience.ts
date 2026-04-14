
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { GHOService } from '../../services/ghosrvs';
import { tags, ghoresult } from '../../model/ghomodel'
import { MatFormFieldAppearance, MatFormFieldModule } from '@angular/material/form-field';
import { catchError } from 'rxjs';
import { provideNativeDateAdapter, MatOption } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatSelect } from "@angular/material/select";
import { MatBadgeModule } from '@angular/material/badge';
@Component({
    selector: 'reviewer-experience',
    providers: [provideNativeDateAdapter()],
    templateUrl: "experience.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatFormFieldModule, MatButtonModule, MatBadgeModule,FormsModule, MatInputModule, MatTableModule, MatFormField, MatLabel, MatSortModule, MatIcon, MatSelect, MatOption],
})
export class ReviewerExperience {
    constructor(private cdr: ChangeDetectorRef) { }
    displayedColumns: string[] = ['Institution', 'Designation', 'DateFrom', 'DateTo', 'actions'];
    dataSource = new MatTableDataSource<any>();
    @Input() id: string = "0";
    @Input() ds: Object[][] = [];
    dsedit: [] = []
    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    srv = inject(GHOService);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    isedit: boolean = false;
    fieldStyle: MatFormFieldAppearance = 'fill'
    editlabel: string = "";
    months: any
title:string ="Experience"
    ngOnChanges(changes: SimpleChanges) {
        if (changes['id']) {

            if (changes['id'].currentValue != undefined && changes['id'].currentValue !== null) {
                if (changes['id'].currentValue != changes['id'].previousValue) {
                    this.getlist();
                }
            }
        }
    }

    ngOnInit(): void {
        this.getlist();
    }

    getlist() {
        if (this.id == "0") return;
        this.isedit = false;
        this.tv = [];
        if (this.id == undefined || this.id == null || this.id == "") {
            this.ds = [];
            
            return;
        }
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "c10", V: "3" })
        this.srv.getdata("reviewerexp", this.tv).pipe
            (
                catchError((err) => {
                    this.srv.openDialog("Experience ", "e", "Please contact support");
                    throw err

                })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.ds = r.Data[0];
                    //this.dataSource.data = this.ds;
                    
                        this.cdr.markForCheck();
                        this.cdr.detectChanges();
                }
            }
            );
        this.cdr.markForCheck();
    }

    getedit(v: any) {
        
        this.dsedit = [];
        if (v > 0) { this.editlabel = "Edit Experience " }
        else { this.editlabel = "Add new Experience " }
        this.tv = [];
        if (this.id == undefined || this.id == null || this.id == "") {
            this.srv.openDialog("Experience ", "s", "Please save your profile prior to add education");
            return;
        }
         this.months = this.srv.MONTHS;
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "dk2", V: v })
        this.tv.push({ T: "c10", V: "3" })
        this.srv.getdata("reviewerexp", this.tv).pipe
            (
                catchError((err) => {
                    this.srv.openDialog("Experience ", "e", "Please contact support");
                    throw err
                })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.dsedit = r.Data[0][0];
                    if (r.Data[0].length > 0) {
                        this.isedit = true;
                        this.cdr.markForCheck();
                        this.cdr.detectChanges();
                    }
                }
            }
            );
        this.cdr.markForCheck();
    }


    edit(v: any) {

        this.getedit(v)
    }

    del(v) {
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "dk2", V: v })
        this.tv.push({ T: "c10", V: "4" })
        this.srv.getdata("reviewerexp", this.tv).pipe
            (
                catchError((err) => {
                    this.srv.openDialog("Experience ", "e", "Please contact support");
                    throw err
                })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.getlist();
                }
            }
            );
    }

    save() {

        if (this.id == undefined || this.id == null || this.id == "") this.id = "0"
        let m = "";
        if (!this.srv.validstr(this.dsedit["Institution"])) m += "Institution<br>";
        if (!this.srv.validstr(this.dsedit["Designation"])) m += "Designation<br>";
        if (!this.srv.validnum(this.dsedit["FromMonth"])) m += "Month From  <br>";
        if (!this.srv.validnum(this.dsedit["FromYear"])) m += "Year From  <br>";

        if (m.trim() != "") {
            this.srv.openDialog("Experience", "w", "<b>Following information is required for Experience</b><br>" + m)
            return;
        }
        this.tv = [];
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "dk2", V: this.dsedit["id"] })
        this.tv.push({ T: "c1", V: JSON.stringify(this.dsedit) })

        if (this.dsedit["id"] > 0) {
            this.tv.push({ T: "c10", V: "2" })
        }
        else { this.tv.push({ T: "c10", V: "1" }) }

        this.srv.getdata("reviewerexp", this.tv).pipe
            (
                catchError((err) => { this.srv.openDialog("Experience ", "e", "Error while your info");; throw err })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.srv.openDialog("Reviewer ", "s", r.Data[0][0]["msg"]);
                    this.getlist();
                }
            }
            );
    }


}