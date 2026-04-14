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
import { GHOdropdown ,GHOInput } from "sk-ghocomps";
@Component({
    selector: 'admin-specialty',
    imports: [CommonModule, GHOdropdown ,GHOInput, MatInputModule, FormsModule, MatButtonModule, MatTooltipModule, MatBadgeModule, MatTableModule,
        MatIconModule, MatSelectModule, MatStepperModule, MatButtonModule, MatCheckboxModule, MatTabsModule, MatRadioModule,
        MatPaginatorModule],
    templateUrl: './specialty.html',
})
export class AdminSpecialty {
    info: any;
    spid: string = "0";
    fltr:string="";

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
    
    columns: string[] = ['SpecialtyName', 'Status', 'RevCount'];
    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    trk: [] = [];
    dslist: [] = [];
    cntrys: [] = []
    sp: [] = [];
    spr: [] = [];
    mode:string="1";

    add() {
        this.spid = "-1"
        this.getsp(this.mode)
    }
    save() {
        throw new Error('Method not implemented.');
    }

    ngOnInit() {
        this.getsps();
    }

    getsp(v: string) {
        this.sp = [];
        this.spr = [];
        this.tv = [
            { T: 'dk1', V: v },
            { T: 'c10', V: '3' }
        ];
        this.srv.getdata('specialty', this.tv).subscribe((r) => {
            this.res = r;
            if (r.Status === 1 && r.Data?.length > 0) {
                this.sp = r.Data[0][0]
                this.spr = r.Data[1]
                this.cdr.detectChanges();
            }
        });
    }


    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onRowClick(r: any) {
        this.spid = r.id
        this.getsp(this.spid)
    }

    chng(v: MatRadioChange) {
        this.mode = v.value
        this.getsps()
    }
    getsps() {
        this.dslist = [];
        this.tv = [
            { T: 'dk1', V: '0' },
            { T: 'dk2', V: this.mode },
            { T: 'c10', V: '3' }
        ];

        this.srv.getdata('specialty', this.tv).subscribe((r) => {
            this.res = r;
            if (r.Status === 1 && r.Data?.length > 0) {
                this.dslist = r.Data[0]
                this.dataSource.data = this.dslist;
                this.cntrys = r.Data[1];
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
