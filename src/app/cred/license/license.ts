
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { GHOService } from '../../services/ghosrvs';
import { tags, ghoresult } from '../../model/ghomodel'
import { MatFormFieldAppearance, MatFormFieldModule } from '@angular/material/form-field';
import { catchError } from 'rxjs';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
    selector: 'reviewer-license',
    providers: [provideNativeDateAdapter()],
    templateUrl: "license.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatFormFieldModule, MatBadgeModule, MatButtonModule, FormsModule, MatInputModule, MatTableModule, MatFormField, MatLabel, MatIcon],
})
export class ReviewerLicense {
    constructor(private cdr: ChangeDetectorRef) { }

    @Input() id: string = "0";
    ds: Object[][] = [];
    dsedit: [] = []
    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    srv = inject(GHOService);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    isedit: boolean = false;
    fieldStyle: MatFormFieldAppearance = 'fill'
    editlabel: string = "";

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
       this.isedit = false;
        this.tv = [];
        if (this.id == undefined || this.id == null || this.id == "") {
            this.ds = [];
            return;
        }

        this.cdr.markForCheck();
        this.cdr.detectChanges();

        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "c10", V: "3" })
        this.srv.getdata("reviewerlic", this.tv).pipe
            (
                catchError((err) => {
                    this.srv.openDialog("License ", "e", "Please contact support");
                    throw err

                })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.ds = r.Data[0];
                    this.cdr.markForCheck();
                    this.cdr.detectChanges();
                }
            }
            );
        this.cdr.markForCheck();
    }

    getedit(v: any) {
        if (v==undefined || v== null ) {v="-1"};
        this.dsedit = [];
        if (v > 0) { this.editlabel = "Edit License " }
        else { this.editlabel = "Add new License " }
        this.tv = [];
        if (this.id == undefined || this.id == null || this.id == "") {
            this.srv.openDialog("License ", "s", "Please save your profile prior to add License");
            return;
        }

        this.cdr.detectChanges();
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "dk2", V: v })
        this.tv.push({ T: "c10", V: "3" })
        this.srv.getdata("reviewerlic", this.tv).pipe
            (
                catchError((err) => {
                    this.srv.openDialog("License ", "e", "Please contact support");
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

    }


    edit(v: any) {

        this.getedit(v)
    }

    del(v: any) {
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "dk2", V: v })
        this.tv.push({ T: "c10", V: "4" })
        this.srv.getdata("reviewerlic", this.tv).pipe
            (
                catchError((err) => {
                    this.srv.openDialog("License ", "e", "Please contact support");
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
        if (!this.srv.validstr(this.dsedit["LicenseNumber"])) m += "License Number<br>";
        if (!this.srv.validstr(this.dsedit["IssueDate"])) m += "Issued Date<br>";
        if (!this.srv.validnum(this.dsedit["ExpiryDate"])) m += "Expiration Date <br>";

        if (m.trim() != "") {
            this.srv.openDialog("License", "w", "<b>Following information is required for License</b><br>" + m)
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

        this.srv.getdata("reviewerlic", this.tv).pipe
            (
                catchError((err) => { this.srv.openDialog("License ", "e", "Error while your info");; throw err })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.srv.openDialog("License ", "s", r.Data[0][0]["msg"]);
                    this.getlist();
                }
            }
            );
    }


    ngAfterViewInit() {
    }

}