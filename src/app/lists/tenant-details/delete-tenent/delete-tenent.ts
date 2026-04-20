import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-tenent',
  standalone: true,
  imports: [FormsModule, MatDialogModule],
  templateUrl: './delete-tenent.html',
  styleUrls: ['./delete-tenent.css'],
})
export class DeleteTenent {
  constructor(
    private dialogRef: MatDialogRef<DeleteTenent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}