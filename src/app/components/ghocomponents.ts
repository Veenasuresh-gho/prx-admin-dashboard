import { GHOService } from '../services/ghosrvs';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { ghoresult, tags } from '../model/ghomodel';
import { MatDividerModule } from '@angular/material/divider';
import { GHOHelp,DialogHelp } from "./help";
import { GHOdropdown } from './dropdown';
 import { GHODate } from './date';
import { GHOInput } from './input';

/* import { GHOdropdown, GHOInput, GHODate} from "sk-ghocomps"; */


@Component({
    selector: 'gho-components',
    
    standalone: true,
    template: `
        <table class="w100">
    <tr>
        <td>   <gho-dropdown label="Country" [(sharedValue)]="cntryid"  
         [options]="cntry" [filter]="true" 
        appearance=outline></gho-dropdown> </td>
        <td>   <gho-dropdown label="Specialty" [(sharedValue)]="splid" [filter]="false"     [options]="spl" appearance=filled></gho-dropdown></td>
         <td>   <gho-date  label="Select Date"  appearance=outline   [(ngModel)] ="dateval" ></gho-date></td>
     <td>   <gho-input  label="First Name" [(sharedValue)]  = "fname" [filter]="true" [showclear]="true" iconcss="email" ></gho-input></td>
        <td>   <gho-input  label="Last Name" [(sharedValue)] = "lname" iconcss="search" appearance=filled ></gho-input></td> 
        <td> 
        <gho-help (asyncAction)="srv.showhelp($event, 'PATMEDICAL')" > </gho-help>
</td>
    </tr>
    <tr> <td>{{cntryid}} </td><td>{{splid}} </td> <td>{{dateval}}   </td>  <td> {{fname}} </td>  <td> {{lname}} </td>  <td></td> </tr>
    </table>
    `,
    imports: [CommonModule, MatTableModule, MatButtonModule, MatPaginatorModule,
        MatFormFieldModule, MatIconModule, MatSelectModule,
        FormsModule, MatDividerModule, GHOdropdown, GHODate, GHOInput, GHOHelp, DialogHelp],
})
export class GHOComponents implements OnInit {
    selectedOptionId: string = ''; // This will store the value bound by ngModel
    dropdownOptions = [
        { value: '1', label: 'Option A' },
        { value: '2', label: 'Option B' },
        { value: '3', label: 'Option C' }
    ]
    data: any;

    srv = inject(GHOService);
    userid: string = "";
    pw: string = "";
    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    cntry: [] = []
    spl: [] = []
    splid: any;
    cntryid: any = "40";
    fname: string = "jaison";
    lname: string = "joseph";
    dateval: string = "12/12/2025"

    onDateRangeChange(e: any) {
    }

    getcntry(v: string) {
        this.cntry = [];
        this.tv = [{ T: 'c10', V: '83' }];
        this.srv.getdata('lists', this.tv).subscribe(r => {
            this.res = r;
            if (r.Status === 1 && r.Data?.length > 0) {
                this.cntry = r.Data[0]
            }
        });
    }

    getspl() {
        this.cntry = [];
        this.tv = [{ T: 'c10', V: '97' }];
        this.srv.getdata('lists', this.tv).subscribe(r => {
            this.res = r;
            if (r.Status === 1 && r.Data?.length > 0) {
                this.spl = r.Data[0]
            }
        });
    }


    ngOnInit(): void {
        this.getcntry("83")
        this.getspl()
    }
}