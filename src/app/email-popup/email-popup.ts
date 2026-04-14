import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-email-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './email-popup.html',
  styleUrl: './email-popup.css',
})
export class EmailPopup {

  @Input() to = '';
  @Input() from = '';
  @Input() subject = '';

  @Output() sendEmail = new EventEmitter<{
    to: string;
    from: string;
    subject: string;
    body: string;
  }>();

  @Output() close = new EventEmitter<void>();

  body = '';

  onSend() {
    this.sendEmail.emit({
      to: this.to,
      from: this.from,
      subject: this.subject,
      body: this.body
    });
  }




}
