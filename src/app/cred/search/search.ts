import { MatStepperModule } from '@angular/material/stepper';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, NgZone, Output, QueryList, ViewChildren } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { GHOService } from '../../services/ghosrvs';
import { catchError } from 'rxjs';
import { tags, ghoresult, Lists } from '../../model/ghomodel'
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatExpansionModule } from "@angular/material/expansion";
@Component({
    selector: 'reviewer-search',
    providers: [provideNativeDateAdapter()],
    imports: [CommonModule, MatExpansionModule, MatDatepickerModule, MatInputModule, FormsModule, MatButtonModule, RouterModule,
        MatIconModule, MatSelectModule, MatStepperModule, MatButtonModule],
    templateUrl: './search.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewerSearch {

    @Output() onidfound = new EventEmitter<string | null>();
    @Output() onsearch = new EventEmitter<string | null>();
    cntrys: Lists[] = [];
    srv = inject(GHOService)

    constructor(private router: Router, private rt: ActivatedRoute, private cdr: ChangeDetectorRef, private ngZone: NgZone) { }
    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    id: string = "0";
    email: string = ""
    cntry: number;
    phone: string = "";
    ydob: number;
    mode: string = "R";
    timer: number = 30;
    otp: string[] = Array(6).fill('');
    intervalId: any;
    otpmsg: string = "";
    q: [] = []
    doctype: number = 1;
    find: boolean = false;
    fieldStyle: MatFormFieldAppearance = 'fill' //,'outline';// 'fill'
    sts: string = "New Profile";


    @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
    onInput(event: Event, index: number): void {
        const input = event.target as HTMLInputElement;
        const value = input.value;
        input.value = value.replace(/[^0-9]/g, '');
        this.otp[index] = input.value;
        if (value && index < this.otp.length - 1) {
            this.otpInputs.toArray()[index + 1].nativeElement.focus();
        }
    }
    onKeyDown(event: KeyboardEvent, index: number): void {
        const input = event.target as HTMLInputElement;
        if (event.key === 'Backspace' && !input.value && index > 0) {
            this.otpInputs.toArray()[index - 1].nativeElement.focus();
        }
    }
    ngOnInit() {
        this.getcountry();
    }

    submitOtp(): void {
        const enteredOtp = this.otp.join('');
        if (/^\d{6}$/.test(enteredOtp)) {
            this.tv = [];
            this.tv.push({ T: "dk1", V: this.email })
            this.tv.push({ T: "dk2", V: enteredOtp })
            this.tv.push({ T: "c1", V: "P" })
            this.tv.push({ T: "c10", V: "93" })
            this.srv.getdata("reviewer", this.tv).pipe
                (
                    catchError((err) => { throw err })
                ).subscribe((r) => {
                    this.res = r;
                    if (r.Status == 1) {
                        this.id = r.Data[0][0]["id"];
                        this.srv.setsession('tkn', r.Data[0][0]["Token"]);
                         this.onidfound.emit(this.id);
                         this.onsearch.emit("N");
                        this.cdr.markForCheck();
                        this.cdr.detectChanges();
                    }
                    else {
                        this.srv.openDialog("Review ", "e", this.res.Info)
                    }
                }
                );
        } else {
            this.srv.openDialog("reviewer ", "i", 'Please enter a valid 6-digit OTP');
        }
    }
    startTimer(): void {
        clearInterval(this.intervalId);
        this.timer = 30;
        this.intervalId = setInterval(() => {
            if (this.timer > 0) this.timer--;
            else clearInterval(this.intervalId);
        }, 1000);
    }
    resendOtp() {
        this.otp = Array(6).fill('');
        this.otpInputs.first.nativeElement.focus();
        this.startTimer();
    }

    actn(a: any) {
        if (a == "2") {
            this.mode = "R";
            this.find = false;
            return;
        }
        if (a == "3") {
            this.find = true;
            this.onsearch.emit("Y");
        }
        if (a == "4") {
            this.find = false;
            this.onsearch.emit("N");
        }
    }


    setid(v: any) {
        this.id = v;
    }

    login() {
        this.router.navigate(['/login']);
    }

    getcountry() {
        this.tv = [];
        this.tv.push({ T: "c10", V: "100" })
        this.srv.getdata("lists", this.tv).pipe
            (
                catchError((err) => {
                    this.srv.openDialog("Profile", "e", "Please contact support");
                    throw err

                })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.cntrys = r.Data[0]
                    this.cdr.markForCheck();
                    this.cdr.detectChanges();
                }
            }
            );
    }

    getid() {

        let p = 0, y = 0;
        p = this.cntry;
        y = this.ydob
        if (y == undefined || y == null) { y = 0; }
        if (p == undefined || p == null) { p = 0; }

        let m = "";
        if (!this.srv.validstr(this.email) && !this.srv.validstr(this.phone)) {
            m = "Mobile Phone number or Email is required </br>"
        }

        if (!this.srv.validnum(y) && !this.srv.validnum(p)) {
            m += "Country of Mobile phone # or Year of birth is required"
        }

        if (m != "") {
            this.srv.openDialog("Search Profile", "w", m);
            return
        }
        this.otpmsg = "";
        this.tv = [];
        this.tv.push({ T: "dk2", V: p.toString() })
        this.tv.push({ T: "dk1", V: "PROFILE" })
        this.tv.push({ T: "c1", V: this.phone })
        this.tv.push({ T: "c2", V: this.email })
        this.tv.push({ T: "c3", V: y.toString() })
        this.tv.push({ T: "c10", V: "91" })
        this.srv.getdata("reviewer", this.tv).pipe
            (
                catchError((err) => {
                    this.srv.openDialog("Profile", "e", "Please contact support");
                    throw err
                })
            ).subscribe((r) => {
                if (r.Status == 0) {
                    this.srv.openDialog("Profile", "e", r.Info);
                    return;
                }
                if (r.Status == 1) {
                    this.email = r.Data[0][0]["eml"];
                    this.otpmsg = r.Info;
                    this.mode = "O"
                    this.startTimer();
                    this.cdr.markForCheck();
                    this.cdr.detectChanges();

                }
            }
            );

    }

}