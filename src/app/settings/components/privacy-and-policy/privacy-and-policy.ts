import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-privacy-and-policy',
  imports: [MatIcon],
  templateUrl: './privacy-and-policy.html',
  styleUrl: './privacy-and-policy.css',
})
export class PrivacyAndPolicy {
  constructor(private location: Location) { }

  goBack() {
    this.location.back()
  }
}
