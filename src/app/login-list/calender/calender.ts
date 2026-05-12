import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calender.html',
  styleUrls: ['./calender.css']
})
export class Calender {

  @Output() dateSelected = new EventEmitter<Date | null>();

  isOpen = false;

  selectedDate: Date | null = null;

  viewYear: number;
  viewMonth: number;

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

  today = new Date();

  constructor() {
    this.viewYear = this.today.getFullYear();
    this.viewMonth = this.today.getMonth();
  }

  get buttonLabel(): string {

    if (!this.selectedDate) {
      return 'Select Date';
    }

    return `${this.monthsShort[this.selectedDate.getMonth()]}
    ${this.selectedDate.getDate()},
    ${this.selectedDate.getFullYear()}`;
  }

  get currentMonthLabel(): string {
    return `${this.months[this.viewMonth]} ${this.viewYear}`;
  }

  get calendarDays(): (number | null)[] {

    const firstDay =
      new Date(this.viewYear, this.viewMonth, 1).getDay();

    const daysInMonth =
      new Date(this.viewYear, this.viewMonth + 1, 0).getDate();

    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }

    return days;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  navigate(dir: number): void {

    this.viewMonth += dir;

    if (this.viewMonth > 11) {
      this.viewMonth = 0;
      this.viewYear++;
    }

    if (this.viewMonth < 0) {
      this.viewMonth = 11;
      this.viewYear--;
    }
  }

  selectDay(day: number | null): void {

    if (!day) return;

    this.selectedDate =
      new Date(this.viewYear, this.viewMonth, day);

    this.dateSelected.emit(this.selectedDate);

    this.isOpen = false;
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

    if (!day || !this.selectedDate) {
      return false;
    }

    return (
      day === this.selectedDate.getDate() &&
      this.viewMonth === this.selectedDate.getMonth() &&
      this.viewYear === this.selectedDate.getFullYear()
    );
  }
}