import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-tenent-user',
  standalone: true,   // 🔥 THIS IS MISSING
  imports: [CommonModule],
  templateUrl: './add-tenent-user.html',
  styleUrl: './add-tenent-user.css',
})
export class AddTenentUser {
  @Input() tenant: any;
}