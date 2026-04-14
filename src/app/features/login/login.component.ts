import { Component, inject, signal, OnInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { catchError } from 'rxjs';
import { GHOService } from '../../services/ghosrvs';
import { GHOUtitity } from '../../services/utilities';
import { tags, ghoresult, Lists, user } from '../../model/ghomodel';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
})
export class LoginComponent implements OnInit {

  protected readonly title = signal('GHO Admin Portal');

  constructor(private router: Router, private rt: ActivatedRoute) {}
  srv = inject(GHOService);
  utl = inject(GHOUtitity);

  mode: string = "L";          // L=Login | F=Forgot | O=OTP | P=Reset
  usr: user = new user();
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  data: [][] = [];
  cntrys: Lists[] = [];

  otp: string[] = Array(6).fill('');
  timer = 30;
  intervalId: any;
  showCurrentPassword = false;
  newshowCurrentPassword = false;
  CurrentPassword = false;

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  // ---------- COMMON ----------
  clearuser() {
    this.usr.id = "";
    this.usr.pwd = "";
    this.usr.fname = "";
    this.usr.lname = "";
    this.usr.ph = "";
  }

  actn(a: number) {
    this.clearuser();
    if (a === 1) this.mode = "S";
    if (a === 2) this.mode = "L";
    if (a === 3) this.mode = "F";
  }

  // ---------- FORGOT PASSWORD ----------
forgot() {
  this.srv.clearsession();
  this.tv = [];

  // --- EMAIL FLOW ---
  if (this.usr.id && !this.usr.ph) {
    this.tv.push({ T: "dk1", V: this.usr.id });
    this.tv.push({ T: "c10", V: "94" });
  }

  // --- PHONE FLOW ---
  else if (this.usr.ph && !this.usr.id) {

    const countryId = this.usr.cntry || "102";   // <-- DEFAULT COUNTRY

    this.tv.push({ T: "dk2", V: this.usr.ph });
    this.tv.push({ T: "c1",  V: countryId });
    this.tv.push({ T: "c10", V: "94" });
  }

  // --- BOTH ENTERED / NOTHING ENTERED ---
  else {
    this.srv.openDialog("Forgot Password", "w",
      "Enter either Email OR Phone");
    return;
  }

  this.srv.getdata("appuser", this.tv).pipe(
    catchError(err => { throw err })
  ).subscribe(r => {

    if (r.Status === 1) {
      this.srv.openDialog("Password Reset","success",
        "Reset link / OTP sent successfully");
      this.mode = "L";
    } else {
      this.srv.openDialog("Password Reset","w", r.Info);
    }
  });

}

  // ---------- RESET PASSWORD ----------
  submitnewpwd() {

  // Check match first
  if (this.usr.pwd !== this.usr.confirmPwd) {
    this.srv.openDialog("New Password", "w",
      "Password and Confirm Password must match");
    return;
  }

  this.tv = [];
  this.tv.push({ T: "dk1", V: this.usr.id });
  this.tv.push({ T: "dk2", V: this.usr.pwd });
  this.tv.push({ T: "c10", V: "96" });

  this.srv.getdata("appuser", this.tv).pipe(
    catchError(err => { throw err })
  ).subscribe(r => {
    this.res = r;

    if (r.Status === 1) {
      this.srv.openDialog("Password Reset", "s", r.Info);
      this.mode = "L";
      this.clearuser();
    } else {
      this.srv.openDialog("Password Reset", "e", r.Info);
    }

  });
}
  // ---------- LOGIN ----------
  loginclick() {
    this.srv.clearsession();
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.usr.id });
    this.tv.push({ T: "dk2", V: this.usr.pwd });
    this.tv.push({ T: "c10", V: "8" });

    this.srv.getdata("adminuser", this.tv).pipe(
      catchError(err => { throw err })
    ).subscribe(r => {
      this.res = r;

      if (r.Status === 1) {
        const token = r.Data[0][0]["Token"];
        const uid = r.Data[0][0]["id"];
        this.srv.setsession('tkn', token);
        this.srv.setsession('id', uid);
        this.router.navigate(['/dashboard']);
      } else {
        this.srv.openDialog("Login", "w", r.Info);
      }
    });
  }

  // ---------- INIT ----------
  ngOnInit(): void {
    this.srv.clearsession();
    
  }
}

