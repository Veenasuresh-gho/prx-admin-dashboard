import { MatStepperModule } from '@angular/material/stepper';
import { ChangeDetectorRef, Component, inject, Input, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { GHOService } from '../services/ghosrvs';
import { tags, ghoresult } from '../model/ghomodel'
import { CommonModule } from '@angular/common';
import { MatSelectModule } from "@angular/material/select";
import { GHOUtitity } from '../services/utilities';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from "@angular/material/tabs";
import { MatRadioChange, MatRadioModule } from "@angular/material/radio";
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
@Component({
    selector: 'admin-country',
    imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule, MatTooltipModule, MatBadgeModule, MatTableModule,
        MatIconModule, MatSelectModule, MatStepperModule, MatButtonModule, MatCheckboxModule, MatTabsModule, MatRadioModule,
        MatPaginatorModule],
    templateUrl: './country.html',
})
export class AdminCountry {
    info: any;
    spid: string = "0";

    constructor(private cdr: ChangeDetectorRef) { }
    @Input() caseid: string = "0";

    srv = inject(GHOService)
    utl = inject(GHOUtitity)
    listtitle: any;

    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    selectedRow: any = null;
    isOpenCase: any;
    selectedCase: any;
    columns: string[] = ['CountryName', 'Status', 'RevCount'];
    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    cntry: [] = [];
    cntrys: [] = []
    mode: string = "1";


    ngOnInit() {
        this.getlist();
    }

    getcntry(v: string) {
        this.cntry = [];
        this.tv = [
            { T: 'dk1', V: v },
            { T: 'c10', V: '3' }
        ];
        this.srv.getdata('country', this.tv).subscribe((r) => {
            this.res = r;
            if (r.Status === 1 && r.Data?.length > 0) {
                this.cntry = r.Data[0][0]
                this.cdr.detectChanges();
            }
        });
    }


    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onRowClick(r: any) {
        this.getcntry(r.id)
    }

    chng(v: MatRadioChange) {
        this.mode = v.value
        this.getlist()
    }
    getlist() {
        this.cntrys = [];
        this.cntry = [];
        this.tv = [
            { T: 'dk1', V: '0' },
            { T: 'dk2', V: this.mode },
            { T: 'c10', V: '3' }
        ];

        this.srv.getdata('country', this.tv).subscribe((r) => {
            this.res = r;
            if (r.Status === 1 && r.Data?.length > 0) {
                this.cntrys = r.Data[0]
                this.dataSource.data = this.cntrys;
                this.cdr.markForCheck();
                this.cdr.detectChanges();
            }
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
}
