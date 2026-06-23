import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'gho-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div style="height:55px;">
    <div style="height:18px;">
        @if(datavalid()) {
            <div [ngStyle]="{ margin: '-3px 5px' }" class="input-label">
                {{ label }}
            </div>
        }
    </div>

    <div style="width:100%;">
        <table style="width:100%;">
            <tr>
                <td>
                    <div [ngClass]="getclass()">
                        <table class="w100">
                            <tr>
                                @if(iconcss != ""){
                                    <td style="padding-right:5px;">
                                        <i [ngClass]="geticon()" style="font-size:16px"></i>
                                    </td>
                                }

                                <td>
                                    <input
                                        [type]="type"
                                        [placeholder]="placeholder"
                                        [ngModel]="sharedValue"
                                        (input)="onInput($event)">
                                </td>
                            </tr>
                        </table>
                    </div>
                </td>

                @if(filter && datavalid()) {
                    <td>
                        <div (click)="clearInput()" [ngClass]="getclearclass()">
                            <table>
                                <tr>
                                    <td><i class="bi bi-x-lg"></i></td>
                                </tr>
                            </table>
                        </div>
                    </td>
                }
            </tr>
        </table>
    </div>
</div>
`,
  styleUrl: './input.css',
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GHOInput implements OnInit {

  constructor(
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) { }

  @Input() list: [] = [];
  @Input() iconcss = '';
  @Input() type = 'text';
  @Input() label = '';
  @Input() appearance = 'outline';
  @Input() filter = false;
  @Input() showclear = false;

  @Input() sharedValue = '';

  @Output() sharedValueChange = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  placeholder = '';

  ngOnInit(): void {
    this.setlabel();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sharedValue']) {
      this.setlabel();
      this.cdr.markForCheck();
    }
  }

  onInput(event: Event): void {
    this.sharedValue = (event.target as HTMLInputElement).value;
    this.sharedValueChange.emit(this.sharedValue);
    this.setlabel();
    this.cdr.markForCheck();
  }

  clearInput(): void {
    this.sharedValue = '';
    this.sharedValueChange.emit(this.sharedValue);
    this.clear.emit();
    this.setlabel();
    this.cdr.markForCheck();
  }

  setlabel(): void {
    this.placeholder = this.sharedValue ? '' : this.label;
  }

  datavalid(): boolean {
    return this.placeholder !== this.label;
  }

  geticon(): string {
    switch (this.iconcss) {
      case 'user': return 'bi bi-person fs-1';
      case 'tel': return 'bi-telephone-fill';
      case 'money': return 'bi bi-currency-dollar';
      case 'email': return 'bi bi-envelope-fill';
      case 'password': return 'bi bi-file-lock';
      case 'filter': return 'bi bi-funnel-fill';
      case 'search': return 'bi bi-search';
      default: return '';
    }
  }

  getclass(): string {
    if (this.appearance !== 'outline') {
      return 'input-mat d-flex gap-3';
    }

    let css = 'input-outline';

    if (this.filter) {
      if (this.datavalid()) {
        css = this.showclear
          ? 'input-outline-filter input-filter'
          : 'input-outline input-filter';
      }
    }

    return css + ' input d-flex';
  }

  getclearclass(): string {
    if (this.appearance === 'outline') {
      return 'input-outline-filter-img';
    }

    return 'input-mat-img';
  }
}