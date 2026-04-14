import { MatStepperModule } from '@angular/material/stepper';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { GHOService } from '../services/ghosrvs';
import { tags, ghoresult } from '../model/ghomodel'
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from "@angular/material/select";
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatExpansionModule } from "@angular/material/expansion";
import { catchError } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfo } from '../features/dialoginfo';

@Component({
    selector: 'reviewer-ndc',
    providers: [provideNativeDateAdapter()],
    imports: [CommonModule, MatExpansionModule, MatDatepickerModule, MatInputModule, FormsModule, MatButtonModule, RouterModule,
        MatIconModule, MatSelectModule, MatStepperModule, MatButtonModule, MatCheckbox],
    template: `
    
    <div class=" border-round bg-white">
        <div class="cred-title">
            <table class="w100">
                <tr>
                    <td class="wicon"><img class="pr20" src="cred/experience.png"></td>
                        <td class="left">Nondisclosure & Confidentiality </td>
                        <td class="wicon"><i class="bi bi-patch-question fs-3 pointer" (click)="openmsg()"></i></td>
                </tr>
            </table>
        </div>

            <div class="row">
                @for (coi of ds; track coi) {
                <div class="col-sm-12">
                    <mat-checkbox [checked]="coi['qid'] != 0" (change)="save($event, coi['id'])">{{coi['Question']}}</mat-checkbox>
                </div> }
            </div>
        </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewerNDC {
    @Input() id: string = "0";
    ds: [] = [];
    @Output() addnew = new EventEmitter<string | null>();
    srv = inject(GHOService)
    constructor(private cdr: ChangeDetectorRef) { }
    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    ttl: [] = [];
    readonly dialog = inject(MatDialog);

    ngOnChanges(changes: SimpleChanges) {
        if (changes['id']) {
            if (changes['id'].currentValue != undefined && changes['id'].currentValue !== null) {
                if (changes['id'].currentValue != changes['id'].previousValue) {
                    this.getlist();
                }
            }
        }
    }
    openmsg(): void {
        const dialogRef = this.dialog.open(DialogInfo, {
            data: { t: this.ttl["t"], m: this.ttl["m"] },
        });
    }


    save(e: any, qid: string) {
        let c = 0;
        if (e.checked) c = 1
        this.tv = [];
        if (this.id == undefined || this.id == null || this.id == "") {
            this.srv.openDialog("Reviewer ", "s", "Please save your profile ");
            return;
        }
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "dk2", V: qid })
        this.tv.push({ T: "c4", V: c.toString() })
        this.tv.push({ T: "c10", V: "5" })
        this.srv.getdata("reviewerque", this.tv).pipe
            (
                catchError((err) => {
                    throw err
                })
            ).subscribe((r) => {
                if (r.Status == 1) {
                }
            }
            );
    }


    getlist() {
        if (this.id == "0") return;
        this.tv = [];
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "c1", V: "3" })
        this.tv.push({ T: "c10", V: "3" })
        this.srv.getdata("reviewerque", this.tv).pipe
            (
                catchError((err) => {
                    throw err
                })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.ds = r.Data[0];
                    this.ttl = r.Data[1][0];
                    this.cdr.markForCheck();
                    this.cdr.detectChanges();
                }
            }
            );
    }
}

