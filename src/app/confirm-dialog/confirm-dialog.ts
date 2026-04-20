import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      Confirm Delete
    </h2>

    <mat-dialog-content class="dialog-content">
      Are you sure you want to delete this advertisement?
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button (click)="close(false)">Cancel</button>
      <button mat-raised-button color="warn" (click)="close(true)">
        Delete
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
    }

    .dialog-content {
      padding:10px;
      font-size: 14px;
      line-height: 1.5;
    }

    .dialog-actions {
      padding-top: 10px;
    }

    :host ::ng-deep .mat-mdc-dialog-container .mdc-dialog__content {
      padding: 0 24px 20px 24px !important;
    }

    :host ::ng-deep .mat-mdc-dialog-container .mdc-dialog__actions {
      padding: 12px 24px 16px 24px !important;
    }
  `]
})
export class ConfirmDialog {
  constructor(private dialogRef: MatDialogRef<ConfirmDialog>) {}

  close(result: boolean) {
    this.dialogRef.close(result);
  }
}