
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, NgZone, Output, SimpleChanges } from '@angular/core';
import { GHOService } from '../services/ghosrvs';
import { tags, ghoresult, Lists } from '../model/ghomodel'
import { CommonModule } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ReviewerPersonnel } from "./profile/profile";
import { ReviewerLanguvages } from "./languvage";
import { ReviewerAccerditation } from "./accerditation";
import { ReviewerEducation } from "./education/education";
import { ReviewerReference } from './reference/reference';
import { ReviewerExperience } from "./experience/experience";
import { ReviewerLicense } from "./license/license";
import { ReviewerSearch } from "./search/search";
import { DialogAlert } from "./documents/document";
import { ReviewerSpecialty } from "./specialty/specialty";
import { ReviewerCOI } from "./coi";
import { ReviewerNDC } from "./ndc";
import { ReviewerGQ } from './gq';

@Component({
  selector: 'admin-reviewer-profile',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, ReviewerPersonnel,
    ReviewerLanguvages, ReviewerAccerditation, ReviewerEducation, ReviewerReference, ReviewerExperience,
    ReviewerLicense, ReviewerSearch, DialogAlert, ReviewerSpecialty, ReviewerCOI, ReviewerNDC, ReviewerGQ],
  templateUrl: './reviewersignup.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewerProfile {
  @Input() id: string = "0";
  @Output() addnew = new EventEmitter<string | null>();

  cntrys: Lists[] = [];
  srv = inject(GHOService)
  hidesearch: boolean = true;
  ngOnInit(): void {
    let i;
    i = this.id
    if (i == undefined || i == null || i == "" || i == "0") { }
    else {
      this.id = i
      this.onsearch = "N"
      this.hidesearch = true;
    }
  }


  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) { }
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  onsearch: string = "N";
  showhide(v) {
    this.onsearch = v;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].currentValue != changes['id'].previousValue) {
        this.onsearch = "N";
        this.cdr.detectChanges();
      }
    }
  }


  setid(v: any) {
    this.id = v;
    if (this.srv.validstr(this.id) && this.id.length > 10) {
      this.hidesearch = true;
    }
  }

}
