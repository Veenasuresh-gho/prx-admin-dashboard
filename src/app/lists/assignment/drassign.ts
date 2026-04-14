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
import { EmailPopup } from '../../email-popup/email-popup';


@Component({
  selector: 'admin-case-assign',
  imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule, MatTooltipModule, MatBadgeModule,
    MatIconModule, MatSelectModule, MatStepperModule, MatCheckboxModule, EmailPopup],
  templateUrl: './drassign.html',
})

export class AdminCaseAssign {
  @Input() caseid: string = "0";
  @Output() refresh = new EventEmitter<string | null>();
  srv = inject(GHOService)
  utl = inject(GHOUtitity)
  constructor(private cdr: ChangeDetectorRef) { }
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  drlist: any[] = [];
  adminId: string = '';
  adminDetails: any;
  hasreviewer: boolean = false;
  selected: avldrs[] = [];
  sts: [] = [];
  spregion: string = "";
  revstatus: string = "";
  casestatus: string = "";
  ngOnChanges(changes: SimpleChanges) {
    if (changes['caseid']) {
      if (changes['caseid'].currentValue != changes['caseid'].previousValue) {
        this.brodcastlist();
      }
      else {
        this.caseid = "0";
      }
    }
  }


  statuschange(v:string)
  {
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.caseid });
    this.tv.push({ T: "dk2", V: v});
    this.tv.push({ T: "c10", V: "108" });
    this.srv.getdata("admindash", this.tv)
      .pipe(catchError((err) => { throw err; }))
      .subscribe((r) => {
        if (r.Status == 1) {
          this.srv.openDialog("Status Change", "s", r.Info);
          this.brodcastlist();
          this.refresh.emit(v);
        }
      });
  }
  ngOnInit(): void {
    this.adminId = this.srv.getsession('id');
    this.subject = `Case ID: ${this.caseid}`;
    if (this.adminId) {
      this.getAdminDetails()
    }
  }

  selectdr(e: any, i: any) {
    if (e.checked) { this.selected.push({ v: i }) }
    else { this.selected = this.selected.filter(item => item.v !== i); }
  }

  assign() {
    if (this.selected.length > 1) {
      this.srv.openDialog("Reviewer Broadcast", "w", "There are more than one reviewer selected , please select one reviewer");
      return
    }

    if (this.selected.length == 0) {
      this.srv.openDialog("Reviewer Broadcast", "w", "No reviewer Selected <br>Please select <b>one (1)</b> reviewer to assign this");
      return
    }
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.caseid });
    this.tv.push({ T: "dk2", V: this.selected[0].v });
    this.tv.push({ T: "c10", V: "107" });
    this.srv.getdata("admindash", this.tv)
      .pipe(catchError((err) => { throw err; }))
      .subscribe((r) => {
        if (r.Status == 1) {
          this.srv.openDialog("Reviewer Broadcast", "s", r.Info);
          this.brodcastlist();
          this.refresh.emit("99");
        }
      });
  }

  broadcast() {
    if (this.selected.length == 0) {
      this.srv.openDialog("Reviewer Broadcast", "w", "Please select at least one reviewer to brodcast");
      return
    }
    this.srv.openDialog("Reviewer Broadcast", "s", "Brodcast success");
  }
  brodcastlist() {
    this.drlist = [];
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.caseid });
    this.tv.push({ T: "c10", V: "103" });
    this.srv.getdata("admindash", this.tv)
      .pipe(catchError((err) => { throw err; }))
      .subscribe((r) => {
        if (r.Status == 1) {
          this.hasreviewer = false;
          this.drlist = r.Data[0];
          this.sts = r.Data[1][0];
          this.spregion = r.Data[1][0]["msg"]
          this.revstatus = r.Data[1][0]["rsts"]
          this.casestatus = r.Data[1][0]["csts"]
          this.cdr.detectChanges();
          return;
        }
        if (r.Status == 2) {
          this.hasreviewer = true;
          this.drlist = r.Data[0][0];
          this.emailTo = r.Data[0][0].Email;
          this.sts = r.Data[1][0];
          this.spregion = r.Data[1][0]["msg"]
          this.revstatus = r.Data[1][0]["rsts"]
          this.casestatus = r.Data[1][0]["csts"]
          this.cdr.detectChanges();
        }
      });
  }

  showEmailPopup = false;
  emailTo = '';
  emailFrom = '';
  subject: string = '';

  openEmailPopup() {
    this.showEmailPopup = true;
  }


  handleSendEmail(event: {
    to: string;
    from: string;
    subject: string;
    body: string;
  }) {
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.adminId });
    this.tv.push({ T: 'dk2', V: this.caseid });
    this.tv.push({ T: 'c1', V: event.from });
    this.tv.push({ T: 'c2', V: event.to });
    this.tv.push({ T: 'c3', V: event.subject });
    this.tv.push({ T: 'c4', V: event.body });
    this.tv.push({ T: 'c10', V: '12' });
    this.srv.getdata('reviewercase', this.tv)
      .pipe(catchError(err => { throw err; }))
      .subscribe(r => {
        if (r.Status === 1) {
          this.srv.openDialog('Success', 's', r.Data[0][0].msg);
          this.showEmailPopup = false;
        }
      });
  }


  getAdminDetails() {
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.adminId });
    this.tv.push({ T: "c10", V: "87" });
    this.srv.getdata("appuser", this.tv).pipe(
      catchError((err) => {
        this.srv.openDialog("Admin", "e", "error while loading info");
        throw err;
      })
    ).subscribe((r) => {
      if (r.Status === 1) {
        this.adminDetails = r.Data[0][0];
        this.emailFrom = this.adminDetails.Email
      }
    });
  }

}



export class avldrs {
  v: string = "";
}