import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle,
} from '@angular/material/dialog';
import { catchError } from 'rxjs';
import { tags, ghoresult } from '../model/ghomodel';
import { GHOService } from '../services/ghosrvs';

export interface dMsg {
  t: string;
  m: string;
  o: string;
}

@Component({
  selector: 'dialog-info',
  template: `
    <div style="min-width: 400px;">
    <table class="w100">
      <tr>
        <td class="pl20"><img src="logo.png" style="width: 50px; ">
        </td>
        <td>
          <h2 mat-dialog-title>{{data.t}}</h2>
        </td>
        <td class="right pr10">
          <i class="bi bi-x-circle fs-3 red pointer" matButton mat-dialog-close></i>
        </td>
      </tr>
    </table>
  <mat-dialog-content class="bt">
    <div  [innerHTML]="data.m"></div> 
  </mat-dialog-content>
    
  <mat-dialog-actions>
    <button matButton mat-dialog-close>Close</button>
  </mat-dialog-actions>
    
  `,
  imports: [FormsModule, MatButtonModule,
    MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose,
  ],
})
export class DialogInfo {
  readonly dialogRef = inject(MatDialogRef<DialogInfo>);
  data = inject<dMsg>(MAT_DIALOG_DATA);
  srv = inject(GHOService)
  tv: tags[] = [];
  res: ghoresult = new ghoresult();


  ngOnInit(): void {
    if ((this.data.t == "" || this.data.m  ) && this.data.o != "")
    {
      this.gethelp();
    }
  }


  gethelp() {
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.data.o })
    this.srv.getdata("help", this.tv).pipe
      (
        catchError((err) => { throw err })
      ).subscribe((r) => {
        if (r.Status == 1) {
          if (r.Data[0][0])
            this.data.t = r.Data[0][0]["t"] ?? "";
          this.data.m = r.Data[0][0]["m"] ?? "";
        }
      }
      );
  }
}
