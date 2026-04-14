import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA, MatDialog, MatDialogClose, MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule, } from '@angular/common';

@Component({
    selector: 'gho-help',
    standalone: true,
    imports: [ CommonModule,FormsModule],
    template: `<div class="right pointer" (click)="openhelp()" style="vertical-align: middle;">
                    <i class="bi bi-patch-question  fs-5 pointer"></i>
                </div>   
  `,
    styles: `
        .right-dialog-panel .mdc-dialog__surface {
            height: 100% !important;
            padding: 10;
            border-radius: 0 !important;
            animation: slideInRight 0.5s ease-out;
            .w100
            {width:100%}

        }`
})
export class GHOHelp implements OnInit {
    @Input() data: any;
    dialog = inject(MatDialog);
    @Output() asyncAction = new EventEmitter<(result: any) => void>();
    
    triggerParentAsync() {
        const actionPromise = new Promise<string>(resolve => {
            this.asyncAction.emit(resolve);
        });
        actionPromise.then(result => {
            this.data = result;
        });
    }

    ngOnInit(): void {
        this.triggerParentAsync();
    }
    openhelp() {
        const headerHeight = 80;
        const dialogRef = this.dialog.open(DialogHelp, {
            data: this.data,
            height: `calc(100vh - ${headerHeight}px)`,
            position: { right: '10', top: `${headerHeight}px` },
            panelClass: 'right-dialog-panel',
            enterAnimationDuration: '250ms',
            exitAnimationDuration: '200ms',
        });
    }
}

@Component({
    selector: 'dialog-help',
    template: `
    <div class=w100>
    <table class="w100">
      <tr>
        <td class="section-title"> {{title}}
        </td>
        <td class="section-title right" >
          <i mat-dialog-close  class="right   bi-x-lg  bold pointer"></i>
        </td>
      </tr>
    </table>

    <div  class="p10" [innerHTML]="innerhtml"></div> 
    
  `,
    imports: [FormsModule, MatButtonModule, MatDialogClose,
    ],
})
export class DialogHelp {
    readonly dialogRef = inject(MatDialogRef<DialogHelp>);
    data = inject(MAT_DIALOG_DATA);
    innerhtml: string = "No help available now"
    title: string = "Topic not available"

    ngOnInit(): void {
        this.title = this.data.t;
        this.innerhtml = this.data.m;
    }

}