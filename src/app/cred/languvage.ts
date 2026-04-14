
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
    selector: 'reviewer-languvages',
    providers: [provideNativeDateAdapter()],
    imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule,
        MatIconModule, MatBadgeModule, MatButtonModule, MatCheckbox,],
    template: `
    
  <div class=" border-round bg-white ">
    <div class="cred-title  ">
      <table class="w100">
        <tr>
          <td class="wicon pr20"><img class="pr20" src="cred/languguage.png"></td>
          <td class="left">
            <span matBadge="{{cnt}}"  matBadgeOverlap="false" >Language 
          </span> 
          </td>
        </tr>
      </table>
    </div>
      <div class="row">

        @for (l of lan; track l) {
        <div class="col-sm-2 col-md-2 col-lg-2">
          <mat-checkbox [checked]="l['id'] != 0" (change)="lanchange($event, l['D'])">{{l['D']}}</mat-checkbox>
        </div> }
      </div>
   
  </div>
            
            `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewerLanguvages {
    constructor(private cdr: ChangeDetectorRef) { }
    @Input() id: string = "0";
    lan: Lists[] = [];
    srv = inject(GHOService)
    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    cnt:number = 0 
    ngOnInit(): void {
        this.getlist();
    }
    getlist() {
        if (this.id == "0") return;
        this.tv = [];
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "c10", V: "6" })
        this.srv.getdata("reviewerlang", this.tv).pipe
            (
                catchError((err) => {
                    throw err
                })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.lan = r.Data[0];
                    this.cnt=this.lan.flat().filter(x => x['id'] > 0).length
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


    lanchange(e: any, l: string) {
        let c = 0;
        if (e.checked) c = 1
        this.tv = [];
        if (this.id == undefined || this.id == null || this.id == "") {
            this.srv.openDialog("Reviewer ", "s", "Please save your profile prior to select languvage");
            return;
        }
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "c4", V: c.toString() })
        this.tv.push({ T: "c1", V: l })
        this.tv.push({ T: "c10", V: "5" })
        this.srv.getdata("reviewerlang", this.tv).pipe
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