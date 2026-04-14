
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
import { MatBadgeModule } from '@angular/material/badge';

@Component({
    selector: 'reviewer-reference',
    providers: [provideNativeDateAdapter()],
    templateUrl: "reference.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatFormFieldModule, MatBadgeModule,  MatButtonModule, FormsModule, MatInputModule, MatTableModule, MatFormField, MatLabel,  MatIcon],
})
export class ReviewerReference {
    constructor(private cdr: ChangeDetectorRef) { }
    @Input() id: string = "0";
    ds: Object[][] = [];
    dsedit: [] = []
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

    ngOnInit(): void {
        this.getlist();

    }

    getlist() {
        if (this.id == "0") return;
        this.isedit = false;
        this.tv = [];
        if (this.id == undefined || this.id == null || this.id == "") {
            this.srv.openDialog("Reference ", "s", "Please save your profile prior to add Reference");
            return;
        }
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "c10", V: "3" })
        this.srv.getdata("reviewerref", this.tv).pipe
            (
                catchError((err) => {
                    this.srv.openDialog("Reference ", "e", "Please contact support");
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
        this.dsedit = [];
        if (v > 0) { this.editlabel = "Edit Reference " }
        else { this.editlabel = "Add new Reference " }
        this.tv = [];
        if (this.id == undefined || this.id == null || this.id == "") {
            this.srv.openDialog("Reference ", "s", "Please save your profile prior to add Reference");
            return;
        }
        this.cdr.detectChanges();
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "dk2", V: v })
        this.tv.push({ T: "c10", V: "3" })
        this.srv.getdata("reviewerref", this.tv).pipe
            (
                catchError((err) => {
                    this.srv.openDialog("Reference ", "e", "Please contact support");
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
        this.srv.getdata("reviewerref", this.tv).pipe
            (
                catchError((err) => {
                    this.srv.openDialog("Reference ", "e", "Please contact support");
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
        if (!this.srv.validstr(this.dsedit["FullName"])) m += "Full Name<br>";
        if (!this.srv.validstr(this.dsedit["Relationship"])) m += "Relationship<br>";
        if (!this.srv.validnum(this.dsedit["Phone"])) m += "Contact Phone <br>";

        if (m.trim() != "") {
            this.srv.openDialog("Reference", "w", "<b>Following information is required for Experience</b><br>" + m)
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

        this.srv.getdata("reviewerref", this.tv).pipe
            (
                catchError((err) => { this.srv.openDialog("Reference ", "e", "Error while your info");; throw err })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.srv.openDialog("Reviewer ", "s", r.Data[0][0]["msg"]);
                    this.getlist();
                }
            }
            );
    }


    ngAfterViewInit() {

    }

}