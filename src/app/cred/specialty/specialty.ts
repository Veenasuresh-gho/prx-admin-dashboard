
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { GHOService } from '../../services/ghosrvs';
import { tags, ghoresult } from '../../model/ghomodel'
import { MatFormFieldAppearance, MatFormFieldModule } from '@angular/material/form-field';
import { catchError } from 'rxjs';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from "@angular/material/select";
import { MatCheckbox } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
    selector: 'reviewer-specialty',
    providers: [provideNativeDateAdapter()],
    templateUrl: "specialty.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatFormFieldModule, MatButtonModule, MatCheckbox,
        FormsModule, MatBadgeModule, MatInputModule, MatTableModule, MatFormField, MatLabel, MatIcon, MatSelectModule],
})
export class ReviewerSpecialty {
    constructor(private cdr: ChangeDetectorRef) { }
    @Input() id: string = "0";
    ds: Object[][] = [];
    dsedit: [] = []
    spls: [][] = []
    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    srv = inject(GHOService);


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
    getSpl() {
        let rs: [][] = [];
        this.tv = [];
        this.tv.push({ T: "c10", V: "97" })
        this.srv.getdata("lists", this.tv).pipe
            (
                catchError((err) => {
                    this.srv.openDialog("Specialty", "e", "No list found for specialty");
                    throw err
                })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.spls = r.Data[0];
                }
            }
            );
    }

    ngOnInit(): void {
        this.getSpl();
    }

    getlist() {
        if (this.id == "0") return;
        this.isedit = false;
        this.tv = [];
        if (this.id == undefined || this.id == null || this.id == "") {
            this.srv.openDialog("Spacialty ", "s", "Please save your profile prior to add Spacialty");
            return;
        }
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "c10", V: "3" })
        this.srv.getdata("reviewerspl", this.tv).pipe
            (
                catchError((err) => {
                    this.srv.openDialog("Spacialty ", "e", "Please contact support");
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
    }

    // getedit(v: any) {
    //     this.dsedit = [];
    //     if (v > 0) { this.editlabel = "Edit Specialty " }
    //     else { this.editlabel = "Add new Specialty " }
    //     this.tv = [];
    //     if (this.id == undefined || this.id == null || this.id == "") {
    //         this.srv.openDialog("Spacialty ", "s", "Please save your profile prior to add Spacialty");
    //         return;
    //     }
    //     this.cdr.detectChanges();
    //     this.tv.push({ T: "dk1", V: this.id })
    //     this.tv.push({ T: "dk2", V: v })
    //     this.tv.push({ T: "c10", V: "3" })
    //     this.srv.getdata("reviewerspl", this.tv).pipe
    //         (
    //             catchError((err) => {
    //                 this.srv.openDialog("Spacialty ", "e", "Please contact support");
    //                 throw err
    //             })
    //         ).subscribe((r) => {
    //             if (r.Status == 1) {
    //                 this.dsedit = r.Data[0][0];
    //                 if (r.Data[0].length > 0) {
    //                     this.isedit = true;
    //                     this.cdr.markForCheck();
    //                     this.cdr.detectChanges();
    //                 }
    //             }
    //         }
    //         );
    // }

        getedit(v: any) {
        this.dsedit = [];
        if (v > 0) { this.editlabel = "Edit Specialty " }
        else { this.editlabel = "Add new Specialty " }
        this.tv = [];
        if (this.id == undefined || this.id == null || this.id == "") {
            this.srv.openDialog("Spacialty ", "s", "Please save your profile prior to add Spacialty");
            return;
        }
        this.cdr.detectChanges();
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "dk2", V: v })
        this.tv.push({ T: "c10", V: "3" })
        this.srv.getdata("reviewerspl", this.tv).pipe
            (
                catchError((err) => {
                    this.srv.openDialog("Spacialty ", "e", "Please contact support");
                    throw err
                })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.dsedit = r.Data[0][0];
                    switch (this.dsedit["SpecialtyType"]) {
                        case 'Main': this.dsedit["SpecialtyType"] = 'M'; break;
                        case 'Sub': this.dsedit["SpecialtyType"] = 'S'; break;
                        case 'Expertise': this.dsedit["SpecialtyType"] = 'E'; break;
                    }

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
        this.srv.getdata("reviewerspl", this.tv).pipe
            (
                catchError((err) => {
                    this.srv.openDialog("Spacialty ", "e", "Please contact support");
                    throw err
                })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.getlist();
                }
            }
            );
    }

    isDuplicateSpecialty(specialtyId: any): boolean {
        return this.ds.some((item: any) =>
            item["SpecialtyID"] == specialtyId
        )
    }
    save() {
        if (this.id == undefined || this.id == null || this.id == "") this.id = "0"
        let m = "";
        if (!this.srv.validstr(this.dsedit["SpecialtyID"])) m += "Specialty<br>";
        if (!this.srv.validstr(this.dsedit["SpecialtyType"])) m += "Specialty Type<br>";

        if (m.trim() != "") {
            this.srv.openDialog("Spacialty", "w", "<b>Following information is required for Spacialty</b><br>" + m)
            return;
        }


        if (!this.dsedit["id"] || this.dsedit["id"] == 0) {
            if (this.isDuplicateSpecialty(this.dsedit["SpecialtyID"])) {
                this.srv.openDialog(
                    "Specialty",
                    "w",
                    "This specialty has already been added. You can only edit it."
                )
                return
            }
        }


        this.tv = [];
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "dk2", V: this.dsedit["id"] })
        this.tv.push({ T: "c1", V: JSON.stringify(this.dsedit) })
        if (this.dsedit["id"] > 0) {
            this.tv.push({ T: "c10", V: "2" })
        }
        else { this.tv.push({ T: "c10", V: "1" }) }

        this.srv.getdata("reviewerspl", this.tv).pipe
            (
                catchError((err) => { this.srv.openDialog("Spacialty ", "e", "Error while your info");; throw err })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.srv.openDialog("Spacialty ", "s", r.Data[0][0]["msg"]);
                    this.getlist();
                }
            }
            );
    }


    ngAfterViewInit() {

    }

}