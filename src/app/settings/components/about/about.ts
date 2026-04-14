import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-about',
  imports: [MatIcon],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
 constructor(private location: Location) {}

goBack()
{
  this.location.back()
}
}
