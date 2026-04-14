import { MatStepperModule } from '@angular/material/stepper';

import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { GHOService } from '../../services/ghosrvs';
import { catchError } from 'rxjs';
import { tags, ghoresult } from '../../model/ghomodel'
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from "@angular/material/select";
import { GHOUtitity } from '../../services/utilities';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AdminCaseAssign } from "../../lists/assignment/drassign";
import { AdminCaseTrack } from "../tracking/track";

@Component({
  selector: 'admin-case-detail',
  imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, MatSelectModule, MatStepperModule, MatButtonModule, MatCheckboxModule, AdminCaseAssign, AdminCaseTrack],
  templateUrl: './case-detail.html',
})
export class AdminCaseDetail {
  @Input() id: string = "0";
  srv = inject(GHOService)
  utl = inject(GHOUtitity)
  sts:string="0";
  constructor(private router: Router, private rt: ActivatedRoute, private cdr: ChangeDetectorRef) { }
  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  submitbtn: boolean = false;
  rpt: boolean = false;
  new: boolean = false;

  prev: [][] = [];
  caseprv: [] = [];
  mediprv: [] = [];
  qprv: [] = [];
  docs: [] = [];
  drlist: [] = [];

  refresh(e:any)
  {
    this.sts = e;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].currentValue != changes['id'].previousValue) {
        this.getcase();
      }
      else {
        this.id = "0";
      }
    }
  }


  getcase() {
    if (this.id == "0") return ;
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.id })
    this.tv.push({ T: "c10", V: "17" })
    this.srv.getdata("case", this.tv).pipe
      (
        catchError((err) => { throw err })
      ).subscribe((r) => {
        if (r.Status == 1) {
          this.caseprv = r.Data[0][0];
          this.mediprv = r.Data[1];
          this.docs = r.Data[2];
          this.qprv = r.Data[3];
           this.cdr.detectChanges();
        }
      }
      );
  }

}