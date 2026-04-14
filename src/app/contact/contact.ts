
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { GHOService } from '../services/ghosrvs';
import { catchError } from 'rxjs';
import { tags } from '../model/ghomodel'
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GHOUtitity } from '../services/utilities';
@Component({
  selector: 'app-contact',
  imports: [MatFormField, MatLabel, MatInputModule, CommonModule, MatButtonModule, FormsModule],
  templateUrl: './contact.html',

})
export class Contact {

  msg: string = "";
  srv = inject(GHOService)
  utl = inject(GHOUtitity)
  tv: tags[] = [];
  constructor(private router: Router, private rt: ActivatedRoute,) { }
  dob: string = "";
  send() {

    this.tv = [];
    if (this.msg=="" )
    {
      this.srv.openDialog("Review ", "e","Please enter message with atlest 20 charector long");
      return ;
    }
    this.tv.push({ T: "dk1", V: this.srv.getsession('id') })
    this.tv.push({ T: "c1", V: this.msg })
    this.tv.push({ T: "c10", V: "10" })
    this.srv.getdata("contact", this.tv).pipe
      (
        catchError((err) => { throw err })
      ).subscribe((r) => {
        if (r.Status == 1) {//
          this.srv.openDialog("Review ", "s",r.Info);
          this.router.navigate(['dash']);
        }
      }
      );

  }
}
