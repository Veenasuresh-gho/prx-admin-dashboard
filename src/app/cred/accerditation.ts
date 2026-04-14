
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, Output, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { GHOService } from '../services/ghosrvs';
import { catchError } from 'rxjs';
import { tags, ghoresult, Lists } from '../model/ghomodel'
import { CommonModule } from '@angular/common';
import { MatCheckbox } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
    selector: 'reviewer-accerditation',
    providers: [provideNativeDateAdapter()],
    imports: [CommonModule, MatBadgeModule, MatInputModule, FormsModule, MatButtonModule,
        MatIconModule, MatButtonModule, MatCheckbox,],
    template: `     
   <div class=" border-round  bg-white">
    <div class="cred-title  ">
      <table class="w100">
        <tr>
          <td class="wicon pr20"><img class="pr20" src="cred/accredition.png"></td>
          <td class="left">
             <span matBadge="{{cnt}}"  matBadgeOverlap="false" > Accreditation </span>
        </td>
        </tr>
      </table>
    </div>
    <div class="row">
      <div class="row">
        @for (a of acc; track a;let i = $index ) {
        <div class="col-sm-2 col-md-2 col-lg-2">
          <mat-checkbox [checked]="a['id'] != '0'" (change)="accchange($event, a['D'])">{{a['D']}}</mat-checkbox>
        </div>

        }
      </div>
    </div>
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewerAccerditation {
    constructor(private cdr: ChangeDetectorRef) { }
    @Input() id: string = "0";
    srv = inject(GHOService)

    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    acc: Lists[] = [];
    cnt: number = 0
    ngOnInit(): void {

    }

    getlist() {
        if (this.id == "0") return;
        this.tv = [];
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "c10", V: "6" })
        this.srv.getdata("revieweraccred", this.tv).pipe
            (
                catchError((err) => {
                    throw err
                })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.acc = r.Data[0];
                    this.cnt = this.acc.flat().filter(x => x['id'] > 0).length
                    this.cdr.markForCheck();
                    this.cdr.detectChanges();
                }
            }
            );
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['id']) {

            if (changes['id'].currentValue != undefined && changes['id'].currentValue !== null) {
                if (changes['id'].currentValue != changes['id'].previousValue) {
                    this.getlist();
                }
            }
        }
    }


    accchange(e: any, l: string) {
        let c = 0;
        if (e.checked) c = 1
        this.tv = [];
        if (this.id == undefined || this.id == null || this.id == "") {
            this.srv.openDialog("Accreditation ", "s", "Please save your profile prior to select Accreditation");
            return;
        }
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "c4", V: c.toString() })
        this.tv.push({ T: "c1", V: l })
        this.tv.push({ T: "c10", V: "5" })
        this.srv.getdata("revieweraccred", this.tv).pipe
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
}