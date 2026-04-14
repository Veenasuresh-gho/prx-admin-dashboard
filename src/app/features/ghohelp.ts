import { ChangeDetectionStrategy, Component, inject, Input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle,
} from '@angular/material/dialog';
import { catchError } from 'rxjs';
import { tags, ghoresult } from '../model/ghomodel';
import { GHOService } from '../services/ghosrvs';

@Component({
    selector: 'gho-help',
    template: `<div class="right pointer" (click)="openhelp()">
                    <i class="bi bi-patch-question  fs-5 pointer"></i>
                </div>   
  `,
    imports: [MatButtonModule,
    ],
})
export class GHOHelp {
    @Input() HelpTag: string = "";
    dialog = inject(MatDialog);
    openhelp() {
        const headerHeight = 80;
        const dialogRef = this.dialog.open(DialogHelp, {
            data: this.HelpTag,
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
    data = inject<string>(MAT_DIALOG_DATA);
    srv = inject(GHOService)
    tv: tags[] = [];

    innerhtml: string = "No help available now"
    title: string = "Topic not available"
    res: ghoresult = new ghoresult();

    ngOnInit(): void {
        this.gethelp();
    }

    gethelp() {
        this.tv = [];
        this.tv.push({ T: "dk1", V: this.data })
        this.tv.push({ T: "c10", V: "3" })
        this.srv.getdata("apphelp", this.tv).pipe
            (
                catchError((err) => {
                    this.innerhtml ="No help avaialble now";
                    throw err })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.title = r.Data[0][0]["t"];
                    this.innerhtml = r.Data[0][0]["m"];
                }
                else{
                    alert ("no help found (db)" + r.Status + ' ' +r.Info)
                }
            }
            );
    }
}
