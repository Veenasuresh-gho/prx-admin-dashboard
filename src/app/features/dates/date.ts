import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { NO_ERRORS_SCHEMA } from '@angular/core';
@Component({
  selector: 'ddldate-selector',
  templateUrl: './date.html',
  styleUrls: ['./date.css'],
  imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatFormFieldModule],
  //schemas: [NO_ERRORS_SCHEMA]
})
export class DateDDLComponent implements OnInit {
  @Output() dateSelected = new EventEmitter<string | null>();
  @Input() datein!: string;
  @Input() tag: string = "";
  @Input() appearance: MatFormFieldAppearance = 'outline';
  dt: string = "";


  dateForm!: FormGroup;
  days: number[] = [];
  months: { name: string, value: number }[] = [];
  years: number[] = [];

  d: number = 0;
  m: number = 0;
  y: number = 0;


  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['datein']) {
      if (changes['datein'].currentValue != undefined && changes['datein'].currentValue !== "" && changes['datein'].currentValue !== null) {
        const idt = new Date(changes['datein'].currentValue)
        this.d = idt.getDate();
        this.m = idt.getMonth();
        this.y = idt.getFullYear();

        this.cdr.detectChanges();

      }
    }
  }

  mychange() {
    this.updateDays();
    this.valchanges();
  }

  valchanges() {
    if (this.d && this.m !== null && this.y) {
      const date = new Date(this.y, this.m, this.d);
      this.dt = this.formatToMMDDYYYY(date);
      const isValid = !isNaN(date.getTime());
      if (isValid) {
        this.dateSelected.emit(this.dt);
        this.cdr.detectChanges();
      }
      else {
        alert("Invalid Date");
      }
    } else {
      this.dateSelected.emit(null);
    }
  }

  ngOnInit(): void {
    this.dateForm = this.fb.group({
      day: this.d,
      month: this.m,
      year: this.y
    });
    this.populateYears();
    this.populateMonths();
    this.populateDays(31);
  }

  formatToMMDDYYYY(date: Date): string {
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // month is 0-based
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();

    return `${mm}/${dd}/${yyyy}`;
  }

  populateMonths() {
    this.months = [
      { name: '(month)', value: -1 },
      { name: 'January', value: 0 },
      { name: 'February', value: 1 },
      { name: 'March', value: 2 },
      { name: 'April', value: 3 },
      { name: 'May', value: 4 },
      { name: 'June', value: 5 },
      { name: 'July', value: 6 },
      { name: 'August', value: 7 },
      { name: 'September', value: 8 },
      { name: 'October', value: 9 },
      { name: 'November', value: 10 },
      { name: 'December', value: 11 }
    ];
  }

  populateYears(start = 1900, end = new Date().getFullYear()) {
    for (let year = end; year >= start; year--) {
      this.years.push(year);
    }
  }

  populateDays(max: number) {
    this.days = Array.from({ length: max }, (_, i) => i + 1);
  }

  updateDays() {
    const month = this.dateForm.get('month')?.value;
    const year = this.dateForm.get('year')?.value;

    if (month !== null && year) {
      const maxDays = new Date(year, month + 1, 0).getDate();
      this.populateDays(maxDays);

      // Reset day if out of new range
      const selectedDay = this.dateForm.get('day')?.value;
      if (selectedDay > maxDays) {
        this.dateForm.patchValue({ day: null });
      }
    }
  }
}



export class dateparts {
  d: number = 0;
  m: number = 0;
  y: number = 0;
}
