import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, model, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges }
  from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
export interface DateFilterResult {
  label: string;
  value: string;
  from?: string | null;
  to?: string | null;
}

@Component({
  selector: 'gho-input',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  template: `
  
<div style="height: 55px !important;">
    <div style="height: 18px !important;">
        @if(datavalid())
        {
        <div [ngStyle]="{ margin: '-3px 5px' }" class="input-label">{{label}}
        </div>
        }
    </div>
    
    <div style="width: 100%;">
        <table style="width: 100%;">
            <tr>
                <td>
                    <div [ngClass]="getclass()">
                        <table class="w100" >
                            <tr>
                              @if(iconcss !=""){
                                <td  style="padding-right: 5px;"> <i [ngClass]="geticon()" style="font-size: 16px !important;"></i></td>}
                                <td>
                                    <input type="type" [placeholder]="placeholder" [ngModel]="sharedValue"
                                        (input)="onInput($event)">
                                </td>
                            </tr>
                        </table>
                    </div>

                </td>
                @if(filter && datavalid() )
                {
                <td>
                    <div (click)="clear()" [ngClass]="getclearclass()">
                        <table>
                            <tr>
                                <td> <i class="bi bi-x-lg "></i></td>
                            </tr>
                        </table>
                    </div>
                </td> }
            </tr>
        </table>
    </div>
</div>`,
  styleUrl: './input.css',
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GHOInput implements OnInit {
  constructor(private el: ElementRef, private cdr: ChangeDetectorRef, private datePipe: DatePipe) { }
  @Input() list: [] = [];
  @Input() iconcss: string = "";
  @Input() type: string = "text";
  @Input() label: string = "";
  @Input() appearance: string = "outline"
  @Input() filter: boolean = false;
  @Input() showclear: boolean = false;
  placeholder: string = "";
  @Input() sharedValue: string = '';
  @Output() sharedValueChange = new EventEmitter<string>();


  geticon() {
    if (this.iconcss == "user") { return "bi bi-person fs-1" }
    if (this.iconcss == "tel") { return "bi-telephone-fill" }
    if (this.iconcss == "money") { return "bi bi-currency-dollar" }
    if (this.iconcss == "email") { return "bi bi-envelope-fill " }
    if (this.iconcss == "password") { return "bi bi-file-lock" }
    if (this.iconcss == "filter") { return "bi bi-funnel-fill" }
    if (this.iconcss == "search") { return "bi bi-search" }
    return "";
  }


  onInput(event: Event): void {
    this.sharedValue = (event.target as HTMLInputElement).value
    this.sharedValueChange.emit(this.sharedValue);
    this.setlabel();
  }

  clear() {
    this.sharedValue = ""
    this.sharedValueChange.emit(this.sharedValue);
    this.setlabel();
  }

  setlabel() {
    if (this.sharedValue.length > 0) {
      this.placeholder = ""
    }
    else { this.placeholder = this.label }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sharedValue']) {
      this.setlabel();
    }
  }

  getclass() {
    if (this.appearance == "outline") {
      let css = " d-flex  gap-3"
      if (!this.filter) { css = "input-outline" }

      if (this.filter) { if (!this.datavalid()) { css = "input-outline" } }

      if (this.filter) { if (this.datavalid() && this.showclear) { css = "input-outline-filter input-filter" } }

      if (this.filter) { if (this.datavalid() && !this.showclear) { css = "input-outline input-filter " } }


      if (!this.showclear) { css = "input-outline" }

      return css + " input d-flex "
    }
    else {
      return "input-mat d-flex  gap-3 "
    }
  }

  getclearclass() {
    if (this.appearance == "outline") {
      if (this.datavalid() && this.showclear) { return "input-outline-filter-img"; }
    }
    else { return "input-mat-img "; }
    return "input-mat";
  }

  datavalid() {
    if (this.placeholder == this.label) {
      return false;
    }
    else { return true; }
  }


  ngOnInit(): void {
  }

}
