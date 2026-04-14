import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from "@angular/material/icon";

export interface DialogData {
  title: string;
  type: 'success' | 'warning' | 'error';
  message: string;
}

/**
 * @title Injecting data when opening a dialog
 */
@Component({
  selector: 'dialogs',
  template: '',
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialogs {
  dialog = inject(MatDialog);
}

@Component({
  selector: 'dialog-alert',
  templateUrl: 'dialog.html',
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAlert {
  data = inject(MAT_DIALOG_DATA);
}
