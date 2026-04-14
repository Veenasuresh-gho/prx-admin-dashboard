import { MatStepperModule } from '@angular/material/stepper';

import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { GHOService } from '../../services/ghosrvs';
import { catchError } from 'rxjs';
import { tags, ghoresult } from '../../model/ghomodel'
import { CommonModule } from '@angular/common';
import { MatSelectModule } from "@angular/material/select";
import { GHOUtitity } from '../../services/utilities';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
@Component({
    selector: 'admin-case-track',
    imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule, MatTooltipModule, MatBadgeModule,
        MatIconModule, MatSelectModule, MatStepperModule, MatButtonModule, MatCheckboxModule],
    templateUrl: './track.html',
})
export class AdminCaseTrack {
    @Input() caseid: string = "0";
    @Input() sts: string = "0";
    srv = inject(GHOService)
    utl = inject(GHOUtitity)
    constructor(private cdr: ChangeDetectorRef) { }
    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    trk: [] = [];
    cstatus: string = "";
    caseId: string = '';
    ngOnChanges(changes: SimpleChanges) {
        if (changes['caseid']) {
            if (changes['caseid'].currentValue != changes['caseid'].previousValue) {
                this.trklist();
            }
            else {
                this.caseid = "0";
            }
        }
        if (changes['sts']) {
            this.trklist();
        }
    }
    
    trklist() {
        this.trk = [];
        this.tv.push({ T: "dk1", V: this.caseid });
        this.tv.push({ T: "c10", V: "106" });
        this.srv.getdata("admindash", this.tv)
            .pipe(catchError((err) => { throw err; }))
            .subscribe((r) => {
                if (r.Status == 1) {
                    this.trk = r.Data[0];
                    this.cstatus = r.Info
                    this.cdr.detectChanges();
                }
            });
    }


    ngOnInit(): void {
        this.caseId = this.caseid;
    }

}
