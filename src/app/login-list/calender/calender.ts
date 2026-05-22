import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CalendarMode = 'single' | 'range';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calender.html',
  styleUrls: ['./calender.css']
})
export class Calender implements OnInit {

  @Input() mode: CalendarMode = 'single';

  @Output() dateSelected = new EventEmitter<Date | null>();
  @Output() rangeSelected = new EventEmitter<DateRange>();

  isOpen = false;

  selectedDate: Date | null = null;

  // Range mode
  rangeStart: Date | null = null;
  rangeEnd: Date | null = null;
  hoverDate: Date | null = null;

  viewYear: number;
  viewMonth: number;

  today = new Date();

  months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  monthsShort = [
    'Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun', 'Jul', 'Aug',
    'Sep', 'Oct', 'Nov', 'Dec'
  ];

  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  constructor() {
    this.today = new Date();
    this.viewYear = this.today.getFullYear();
    this.viewMonth = this.today.getMonth();
    this.selectedDate = new Date(this.today);
  }

  ngOnInit(): void {
    if (this.mode === 'single') {
      this.dateSelected.emit(this.selectedDate);
    }
  }

  // ─── Labels ───────────────────────────────────────────

  get buttonLabel(): string {
    if (this.mode === 'range') {
      if (!this.rangeStart) return 'Select Date Range';
      const start = this.formatDate(this.rangeStart);
      if (!this.rangeEnd) return `${start} → ...`;
      return `${start} → ${this.formatDate(this.rangeEnd)}`;
    }

    if (!this.selectedDate) return 'Select Date';
    return this.formatDate(this.selectedDate);
  }

  get currentMonthLabel(): string {
    return `${this.months[this.viewMonth]} ${this.viewYear}`;
  }

  formatDate(date: Date): string {
    return `${this.monthsShort[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  // ─── Calendar Grid ────────────────────────────────────

  get calendarDays(): (number | null)[] {
    const firstDay = new Date(this.viewYear, this.viewMonth, 1).getDay();
    const daysInMonth = new Date(this.viewYear, this.viewMonth + 1, 0).getDate();
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    return days;
  }

  // ─── Navigation ───────────────────────────────────────

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  navigate(dir: number): void {
    this.viewMonth += dir;

    if (this.viewMonth > 11) { this.viewMonth = 0; this.viewYear++; }
    if (this.viewMonth < 0)  { this.viewMonth = 11; this.viewYear--; }
  }

  // ─── Selection ────────────────────────────────────────

  selectDay(day: number | null): void {
    if (!day) return;

    const clicked = new Date(this.viewYear, this.viewMonth, day);

    if (this.mode === 'single') {
      this.selectedDate = clicked;
      this.dateSelected.emit(this.selectedDate);
      this.isOpen = false;
      return;
    }

    if (!this.rangeStart || (this.rangeStart && this.rangeEnd)) {
      this.rangeStart = clicked;
      this.rangeEnd = null;
      this.hoverDate = null;
    } else {
      if (clicked < this.rangeStart) {
        this.rangeEnd = this.rangeStart;
        this.rangeStart = clicked;
      } else {
        this.rangeEnd = clicked;
      }

      this.rangeSelected.emit({
        start: this.rangeStart,
        end: this.rangeEnd
      });

      this.isOpen = false;
    }
  }

  onHover(day: number | null): void {
    if (!day || this.mode !== 'range') return;

    if (this.rangeStart && !this.rangeEnd) {
      this.hoverDate = new Date(this.viewYear, this.viewMonth, day);
    }
  }

  clearHover(): void {
    this.hoverDate = null;
  }

  clearRange(): void {
    this.rangeStart = null;
    this.rangeEnd = null;
    this.hoverDate = null;
    this.rangeSelected.emit({ start: null, end: null });
  }


  isToday(day: number | null): boolean {
    if (!day) return false;
    return (
      day === this.today.getDate() &&
      this.viewMonth === this.today.getMonth() &&
      this.viewYear === this.today.getFullYear()
    );
  }

  isSelected(day: number | null): boolean {
    if (!day || this.mode !== 'single' || !this.selectedDate) return false;
    return (
      day === this.selectedDate.getDate() &&
      this.viewMonth === this.selectedDate.getMonth() &&
      this.viewYear === this.selectedDate.getFullYear()
    );
  }

  isRangeStart(day: number | null): boolean {
    if (!day || !this.rangeStart) return false;
    return this.isSameDay(new Date(this.viewYear, this.viewMonth, day), this.rangeStart);
  }

  isRangeEnd(day: number | null): boolean {
    if (!day || !this.rangeEnd) return false;
    return this.isSameDay(new Date(this.viewYear, this.viewMonth, day), this.rangeEnd);
  }

  isInRange(day: number | null): boolean {
    if (!day || !this.rangeStart) return false;

    const current = new Date(this.viewYear, this.viewMonth, day);
    const end = this.rangeEnd || this.hoverDate;

    if (!end) return false;

    const [from, to] = this.rangeStart < end
      ? [this.rangeStart, end]
      : [end, this.rangeStart];

    return current > from && current < to;
  }

  private isSameDay(a: Date, b: Date): boolean {
    return (
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear()
    );
  }
}