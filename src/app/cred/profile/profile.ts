import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, signal, Signal, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { GHOService } from '../../services/ghosrvs';
import { tags, ghoresult, Lists } from '../../model/ghomodel'
import { CommonModule } from '@angular/common';
import { MatSelectModule } from "@angular/material/select";
import { DateDDLComponent } from "../../features/dates/date";
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { catchError } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';

export interface UserDialogData {
    id: number
    cntry: any
}

@Component({
    selector: 'reviewer-profile',
    imports: [CommonModule, MatExpansionModule, CommonModule, MatCheckbox, MatInputModule, FormsModule, MatButtonModule,
        MatIconModule, MatSelectModule, MatButtonModule, DateDDLComponent,],
    templateUrl: './profile.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewerPersonnel {
    constructor(private cdr: ChangeDetectorRef) { }
    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    dob: string = "";
    fieldStyle: MatFormFieldAppearance = 'fill'
    demog: [] = []
    cntrys: Lists[] = [];
    @Output() idchange = new EventEmitter<string | null>();
    @Input() id: string = "0";
    srv = inject(GHOService)
    isedit: boolean;
    info: [] = [];
    expand: boolean = false

    ngOnInit(): void {
        this.getInfo()
    }


    ngOnChanges(changes: SimpleChanges) {
        if (changes['id']) {

            if (changes['id'].currentValue != undefined && changes['id'].currentValue !== null) {
                if (changes['id'].currentValue != changes['id'].previousValue) {
                    this.getInfo();
                }
            }
        }
    }
    approve() {
        this.tv = [];
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "c10", V: "52" })
        this.srv.getdata("reviewer", this.tv).pipe
            (
                catchError((err) => {
                    throw err
                })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.srv.openDialog("Credential", "s", r.Info)
                    this.getInfo();
                }
            }
            );
    }
    toggle(): void {
        this.expand = !this.expand;
    }


    onDateChange(dt: string | null) {
        this.dob = dt;
        if (this.info) { this.info["DOB"] = this.dob; }
    }

    savecase() {
        if (this.id == undefined || this.id == null || this.id == "") this.id = "0"
        let m = "";
        if (!this.srv.validstr(this.info["FirstName"])) m += "First Name <br>";
        if (!this.srv.validstr(this.info["LastName"])) m += "Last Name <br>";
        if (!this.srv.validstr(this.info["Gender"])) m += "Gendor  <br>";
        if (!this.srv.validnum(this.info["CountryID"])) m += "Country Code for Phone# <br>";
        if (!this.srv.validstr(this.info["CellPhone"])) m += "Phone  <br>";
        if (!this.srv.validstr(this.info["DOB"])) m += "Date Of Birth   <br>";
        if (!this.srv.validstr(this.info["Nationality"])) m += "Nationality   <br>";
        if (!this.srv.validstr(this.info["eMail"])) m += "Email   <br>";
        if (m.trim() != "") {
            this.srv.openDialog("Review", "w", "<b>Following information is required for profile</b><br>" + m)
            return;
        }
        this.info["DOB"] = this.dob;
        this.tv = [];
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "c1", V: JSON.stringify(this.info) })
        this.tv.push({ T: "c10", V: "12" })
        this.srv.getdata("reviewer", this.tv).pipe
            (
                catchError((err) => { this.srv.openDialog("Review ", "e", "Error while your info");; throw err })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.id = r.Data[0][0]["id"];
                    this.srv.openDialog("Reviewer ", "s", r.Data[0][0]["msg"]);
                    this.getInfo();
                }
            }
            );

    }

    getedit() {
        this.tv = [];
        if (this.id == undefined || this.id == null || this.id == "") this.id = "0"
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "c1", V: "1" })
        this.tv.push({ T: "c10", V: "51" })
        this.srv.getdata("reviewer", this.tv).pipe
            (
                catchError((err) => {
                    throw err
                })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    //this.demog = [];
                    this.info = r.Data[0][0];
                    this.dob = this.info["DOB"];
                    this.id = this.info["id"];
                    this.cntrys = r.Data[1]
                    this.isedit = true;
                    this.cdr.detectChanges();
                }
            }
            );
    }

    getInfo() {
        if (this.id == undefined || this.id == null || this.id == "") this.id = "0"
        {
            this.getedit();
        }
        this.tv = [];
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "c1", V: "0" })
        this.tv.push({ T: "c10", V: "51" })
        this.srv.getdata("reviewer", this.tv).pipe
            (
                catchError((err) => {
                    throw err
                })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.demog = r.Data[0][0];
                    if (this.demog) {
                        this.id = this.demog["id"];
                        this.idchange.emit(this.id);
                        this.isedit = false;
                        this.cdr.detectChanges();

                    }
                }
            }
            );
    }
}
