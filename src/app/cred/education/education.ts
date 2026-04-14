import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, NgZone, SimpleChanges, ViewChild } from '@angular/core';
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
import { Router } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'reviewer-education',
    providers: [provideNativeDateAdapter()],
    templateUrl: "education.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatFormFieldModule, MatBadgeModule, MatButtonModule, FormsModule, MatInputModule, MatTableModule, MatFormField, MatLabel,
        MatIcon,],

})
export class ReviewerEducation {
    constructor(private cdr: ChangeDetectorRef,) { }
    displayedColumns: string[] = ['Institution', 'Degree', 'Duration', 'CompletedYear', 'actions'];
    dataSource = new MatTableDataSource<any>();

    @Input() id: string = "0";
    @Input() dsedu: Object[][] = [];
    dsedit: [] = []
    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    srv = inject(GHOService);
    isedit: boolean = false;
    fieldStyle: MatFormFieldAppearance = 'fill'
    editlabel: string = "";
    title: string = "Education";
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
            this.dsedu = [];
            return;
        }

        this.cdr.markForCheck();
        this.cdr.detectChanges();

        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "c10", V: "3" })
        this.srv.getdata("revieweredu", this.tv).pipe
            (
                catchError((err) => {
                    this.srv.openDialog(this.title, "e", "Please contact support");
                    throw err
                })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.dsedu = r.Data[0];
                    this.cdr.detectChanges();
                }
            }
            );

    }

    getedu(v: any) {
        this.dsedit = [];
        if (v > 0) { this.editlabel = "Edit " + this.title }
        else { this.editlabel = "Add new " + this.title }
        this.tv = [];
        if (this.id == undefined || this.id == null || this.id == "") {
            this.srv.openDialog(this.title, "s", "Please save your profile prior to add " + this.title);
            return;
        }
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "dk2", V: v })
        this.tv.push({ T: "c10", V: "3" })
        this.srv.getdata("revieweredu", this.tv).pipe
            (
                catchError((err) => {
                    this.srv.openDialog(this.title, "e", "Please contact support");
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


    edit(id: any) {
        this.getedu(id)
    }

    delete(id: any) {
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "dk2", V: id })
        this.tv.push({ T: "c10", V: "4" })
        this.srv.getdata("revieweredu", this.tv).pipe
            (
                catchError((err) => {
                    this.srv.openDialog(this.title, "e", "Please contact support");
                    throw err
                })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.getlist();
                }
            }
            );


    }

    saveedu() {
        if (this.id == undefined || this.id == null || this.id == "") this.id = "0"
        let m = "";
        if (!this.srv.validstr(this.dsedit["Institution"])) m += "Institution<br>";
        if (!this.srv.validstr(this.dsedit["Degree"])) m += "Degree<br>";
        if (!this.srv.validstr(this.dsedit["Duration"])) m += "Duration <br>";

        if (m.trim() != "") {
            this.srv.openDialog(this.title, "w", "<b>Following information is required for " + this.title + "</b><br>" + m)
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

        this.srv.getdata("revieweredu", this.tv).pipe
            (
                catchError((err) => { this.srv.openDialog(this.title, "e", "Error while your info");; throw err })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.srv.openDialog(this.title, "s", r.Data[0][0]["msg"]);
                    this.getlist();
                }
            }
            );
    }
}