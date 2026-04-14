import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input,
  NgZone, Output, SimpleChanges,
  OnChanges
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'gho-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
<div style="height: 55px !important;">
    <div style="height: 18px !important;">
        @if(datavalid())
        {
        <div [ngStyle]="{ margin: '-3px 5px' }" class="input-label">{{label}}
        </div>
        }
    </div>
    <table class="input-ddl">
        <tr>
            <td class="w100">
                <div (click)="toggleDropdown()" [ngClass]="getclass()">
                  <table class="w100"><tr> <td class="w100">{{selectedtxt}}</td> 
                  <td ><i class="bi bi-caret-down-fill arrow-icon" [class.rotate]="isOpen"></i></td>
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
<div class="dropdown-menu show " style="position: absolute; z-index: 9999;  overflow: visible;">
    <div class="list-panel" >
        @for (dlitem of listdata; track dlitem) {
        <div class="list-item " (click)="onSelectionChange(dlitem)" [class.list-item-selected]="dlitem.value == sharedValue">
            <table class="w100">
                <tr>
                    <td>
                        {{ dlitem.label }}
                    </td>
                    @if(dlitem.value == sharedValue){
                    <td class="right" style="width:30px;"> <i class="bi bi-check2"></i> </td>}
                </tr>
            </table>
        </div>
        }
    </div>
    @if(showoptions)
      {
    <table class=w100>
        <tr class="bt ">
            <td class="p10" (click)="clear()"><span matButton class="ghoddl-btn  "> Clear </span> </td>
            <td class="p10" (click)="closeDropdown()"><span matButton class="ghoddl-btn  "> Cancel </span> </td>
        </tr>
    </table>}
</div>
}
`,
  styleUrl: './input.css',
})
export class GHOdropdown implements OnChanges {
  constructor(private el: ElementRef, private cdr: ChangeDetectorRef, private ngZone: NgZone) { }
  @Input() options: any[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() showclear: boolean = true;
  @Input() showoptions: boolean = true;

  @Input() appearance: string = "outline"
  @Input() label: string = "";
  @Input() filter: boolean = true;
  listdata: { label: string; value: string }[] = [];
  isOpen = false;
  selectedtxt: string = "";

  @Input() sharedValue: string = '';
  @Output() sharedValueChange = new EventEmitter<string>();
  @Output() selectionchange = new EventEmitter<([])>();



  onModelChange(v: string): void {
    this.sharedValue = v;
    this.sharedValueChange.emit(v);
    this.setlabel();
  }
  setlabel() {
    if (this.listdata.length > 0) {
      for (let i: number = 0; i < this.listdata.length; i++) {

        if (this.sharedValue && this.listdata[i].value.toString() == this.sharedValue.toString()) {
          this.selectedtxt = this.listdata[i].label
          break;
        }
        else {
          this.selectedtxt = this.label
        }
      }
    }
    else { this.selectedtxt = this.label }
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.listdata = []; debugger;
      const allKeys = Array.from(
        new Set(this.options.flatMap(item => Object.keys(item)))
      );
      for (let i: number = 0; i < this.options.length; i++) {
        if (allKeys.length == 1) {
          this.listdata.push({ label: this.options[i][allKeys[0]], value: this.options[i][allKeys[0]] })
        }
        else {
          this.listdata.push({ label: this.options[i][allKeys[1]], value: this.options[i][allKeys[0]] })
        }
      }
      this.setlabel();
    }
    if (changes['sharedValue']) {
      this.setlabel();
    }
  }


  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  clear() {
    this.onModelChange("")
    this.isOpen = false;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  onSelectionChange(v: any) {
    this.isOpen = false;
    this.onModelChange(v.value);
    this.selectionchange.emit(v);
  }

  datavalid() {
    if (this.label != this.selectedtxt) { return true }
    if (this.label == this.selectedtxt) { return false }
    return false;
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
      let css = ""
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