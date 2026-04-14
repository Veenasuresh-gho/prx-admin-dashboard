import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, HostListener,
    Input, OnInit, SimpleChanges
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GHOdropdown } from "./dropdown";
import { MatCardModule } from "@angular/material/card";
import { MatCalendar } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'gho-date',
    standalone: true,
    imports: [CommonModule, FormsModule, GHOdropdown, MatCalendar, MatDatepickerModule,
        MatCardModule, DatePipe],
    template:`
                <div style="height: 55px !important;">
                <div style="height: 18px !important;">
                    @if(datavalid())
                    {
                    <div [ngStyle]="{ margin: '-3px 5px' }" class="input-label">{{label}}
                    </div>
                    }
                </div>
                <table style="width: 100%;">
                    <tr>
                         <td class="w100">
                            <div (click)="toggleDropdown()" [ngClass]="getclass()">
                            <table class="w100"><tr> <td class="w100">{{ gettxt()}}</td> 
                            <td > <i class="bi bi-calendar4-week" [class.rotate]="isOpen"></i></td>
                            </tr>
                            </table>
                            </div>
                        </td>
                        @if(filter && datavalid() )
                        {
                        <td>
                            <div (click)="clear()" [ngClass]="getclearclass()">
                                <table class="w100"><tr> <td class="w100"><i class="bi bi-x-lg "></i></td> </tr>
                            </table>
                            </div>
                        </td> }


                    </tr>
                </table>
            </div>
            @if(isOpen){
            <div class="dropdown-menu show">
                <table class="w100">
                    <tr >
                        <td class="pl10">
                            <gho-dropdown [showoptions]="false" [options]="months" [(sharedValue)]="m" (selectionchange)="onmodelchange($event,'m')"  [filter]=false
                                label="Month"></gho-dropdown>
                        </td>
                        <td class="">
                            <gho-dropdown [showoptions]="false" [options]="days" [(sharedValue)]="d"   (selectionchange)="onmodelchange($event,'d')" [filter]=false
                                label="Day"></gho-dropdown>
                        </td>
                        <td class="pr10">
                            <gho-dropdown  [showoptions]="false" [options]="years" [(sharedValue)]="y"  (selectionchange)="onmodelchange($event,'y')" [filter]=false
                                label="Year"></gho-dropdown>

                        </td>
                        
                        <td class="pr10 pointer" style="width: 30px; padding-top: 10px;">
                            <div (click)="isOpen=false" >
                                <i class="bi bi-check2 bold"></i>
                            </div>
                        </td>
                    </tr>

                    <tr class="bb">
                        <td colspan="5" class=p10> </td></tr>
                    <tr>
                        <td colspan="5">
                            <mat-calendar (selectedChange)="onDateChangeFromCalender($event)">
                            </mat-calendar>
                        </td>
                    </tr>

                </table>

            </div>
            }
    `,
    styleUrl: './input.css',
    providers: [provideNativeDateAdapter(), DatePipe,
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => GHODate),
        multi: true
    }],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GHODate implements ControlValueAccessor, OnInit {
    constructor(private el: ElementRef, private cdr: ChangeDetectorRef,
        private datePipe: DatePipe) { }
    @Input() options: any[] = [];
    @Input() placeholder: string = 'Select an option';
    @Input() showclear: boolean = true;
    @Input() appearance: string = "outline"
    @Input() label: string = "";
    @Input() filter: boolean = true;
    public value: string = "";
    public disabled: boolean = false;
    listdata: { label: string; value: string }[] = [];
    isOpen = false;
    selectedtxt: string = "";
    days: { value: string }[] = []
    years: { value: string }[] = [];
    months: { value: string, name: string }[] = [];
    currentYear: number = new Date().getFullYear();
    d: any;
    m: any;
    y: any;


    // Writes a new value to the element
    writeValue(value: any): void {
        this.value = value;
        if (this.value !== undefined && this.value !== null) {
            const date = new Date(value);
            if (!date) {
                this.d = null;
                this.m = null;
                this.y = null;
            }
            else {
                const formatted = this.datePipe.transform(date, 'MM/dd/yyyy');
                if (formatted !== undefined && formatted !== null) {
                    const [month, day, year] = formatted.split('/').map(Number);
                    this.m = month,
                        this.y = year;
                    this.d = day
                }
            }
        }
    }

    onmodelchange(e: any, t: any) {
        if (t == "d") { this.d = e.value }
        if (t == "m") { this.m = e.value }
        if (t == "y") { this.y = e.value }
        this.setdt();
    }

    ngOnInit(): void {
        this.populateYears();
        this.populateMonths();
        this.populateDays(31);
    }


    setdt() {
        if (this.d == 0 || this.m == 0 || this.y == 0) { this.value = "" }
        else {
            this.value = this.m + " - " + this.d + " - " + this.y
        }
        this.onChange(this.value);
        this.onTouched();
    }

    onDateChangeFromCalender(date: Date | null) {
        if (!date) return;
        const formatted = this.datePipe.transform(date, 'MM/dd/yyyy');
        if (formatted !== undefined && formatted !== null) {
            const [month, day, year] = formatted.split('/').map(Number);
            this.m = month,
            this.y = year;
            this.d = day
        }
        this.setdt()
        this.isOpen = false;
        this.cdr.detectChanges();
    }

    populateMonths() {
        this.months = [
            { value: "1", name: 'January' },
            { value: "2", name: 'February' },
            { value: "3", name: 'March' },
            { value: "4", name: 'April' },
            { value: "5", name: 'May' },
            { value: "6", name: 'June' },
            { value: "7", name: 'July' },
            { value: "8", name: 'August' },
            { value: "9", name: 'September' },
            { value: "10", name: 'October' },
            { value: "11", name: 'November' },
            { value: "12", name: 'December' }
        ];
    }
    populateYears(start = (this.currentYear - 95), end = 1 + new Date().getFullYear()) {
        for (let year = end; year >= start; year--) {
            this.years.push({ value: year.toString() });
        }
    }

    populateDays(start = 1, end = 31) {
        for (let i: number = 1; i < 32; i++) {
            this.days.push({ value: i.toString() });
        }
    }

    gettxt() {
        if (this.datavalid()) { return this.value }
        else { return this.label }
    }

    toggleDropdown(): void {
        this.isOpen = !this.isOpen;
    }

    clear() {
        this.value = "";
        this.onChange(this.value);
        this.onTouched();
    }

    closeDropdown(): void {
        this.isOpen = false;
    }

    datavalid() {
        if (this.value === undefined || this.value == null || this.value == "" || this.value == "0") {
            return false;
        }
        else { return true; }
    }


    // Functions to call when the value changes or the control is touched
    onChange: any = () => { };
    onTouched: any = () => { };

    // Registers a callback function that is called when the control's value changes in the UI
    registerOnChange(fn: any): void {
        this.isOpen = false;
        this.onChange = fn;
    }

    // Registers a callback function that is called whenever the control receives a touch event
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }



    // Sets the disabled state of the control
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }


    onSelectionChange(v: any) {
        this.isOpen = false;
        this.selectedtxt = v.label;
        const newValue = v.value;
        this.value = newValue;
        this.onChange(newValue); // Notify Angular forms about the change
        this.onTouched(); // Mark the control as touched
    }



    @HostListener('document:click', ['$event'])
    onOutsideClick(event: Event): void {
        if (!this.el.nativeElement.contains(event.target)) {
            this.isOpen = false;
        }
    }


    getclearclass() {
        if (this.appearance == "outline") {
            if (this.datavalid() && this.showclear) { return "input-outline-filter-img"; }
        }
        else { return "input-mat-img "; }
        return "input-mat";
    }
    getclass() {
        if (this.appearance == "outline") {
            let css = " d-flex  gap-3"
            if (!this.filter) { css = "input-outline" }

            if (this.filter) { if (!this.datavalid()) { css = "input-outline" } }

            if (this.filter) { if (this.datavalid()) { css = "input-outline-filter " } }

            if (!this.showclear) { css = "input-outline" }

            return css + " input d-flex  gap-3 "
        }
        else {
            return "input-mat d-flex  gap-3 "
        }
    }

}