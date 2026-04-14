import { inject, Injectable } from '@angular/core';
import { ghoiin, tags, ghoresult } from '../model/ghomodel'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialogAlert } from '../features/dialog/dialog';

export interface Month {
  D: number;
  T: string;
}

@Injectable({ providedIn: 'root' })

export class GHOUtitity {
  
  http = inject(HttpClient);
  tkn: string = "";

  tv: tags[] = [];
  res: ghoresult = new ghoresult();

 

  months: Month[] = [
    { D: 1, T: 'January' },
    { D: 2, T: 'February' },
    { D: 3, T: 'March' },
    { D: 4, T: 'April' },
    { D: 5, T: 'May' },
    { D: 6, T: 'June' },
    { D: 7, T: 'July' },
    { D: 8, T: 'August' },
    { D: 9, T: 'September' },
    { D: 10, T: 'October' },
    { D: 11, T: 'November' },
    { D: 12, T: 'December' },
  ];

}
