import { MatStepperModule } from '@angular/material/stepper';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
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
import { MatRadioModule } from "@angular/material/radio";
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DateDDLComponent } from "../features/dates/date";
import { MatFormFieldAppearance } from '@angular/material/form-field';

@Component({
    selector: 'admin-accounts',
    imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule, MatTooltipModule, MatBadgeModule, MatTableModule,
        MatIconModule, MatSelectModule, MatStepperModule, MatButtonModule, MatCheckboxModule, MatTabsModule, MatRadioModule,
        MatPaginatorModule, DateDDLComponent],
    templateUrl: './accounts.html',
    styleUrl: './accounts.css'
})
export class AdminAccounts {
    fieldStyle: MatFormFieldAppearance = 'fill'
    info: any;
    dob: any;

    cntrys: any;
    id: any;

    constructor(private cdr: ChangeDetectorRef) { }
    @Input() caseid: string = "0";

    srv = inject(GHOService)
    utl = inject(GHOUtitity)
    listtitle: any;

    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    selectedRow: any;
    isOpenCase: any;
    selectedCase: any;
    columns: string[] = ['FirstName', 'LastName', 'Email', 'FullPhone', 'Role', 'actions'];
    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    trk: [] = [];
    users: [] = [];
    usr: [] = [];
    uid: string = "0";
    tbidx: number = 0;
    countryList: any;
    roles: any[] = [];


    getInfo() {
        throw new Error('Method not implemented.');
    }
    savecase() {
        throw new Error('Method not implemented.');
    }
    onDateChange(e: any) {

        if (!e) return;

        const [month, day, year] = e.split('/');

        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        this.dob = formattedDate;
        this.usr['DateOfBirth'] = formattedDate;
    }


    ngOnInit() {
        this.getUsers();
        this.getCountry();
        this.getRoles();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    onRowClick(r: any) {
        this.usr = { ...r };
        this.dob = r['DateOfBirth'];
        this.tbidx = 1;
    }

    updateClick() {
        this.editUser()
    }

    getCountry() {
        this.usr = [];
        this.tv = [
            { T: 'c10', V: '99' }
        ];
        this.srv.getdata('lists', this.tv).subscribe((r) => {
            this.res = r;
            if (r.Status === 1 && r.Data?.length > 0) {
                this.countryList = r.Data[0];
            }
        });
    }

    getRoles() {
        this.usr = [];
        this.tv = [
            { T: 'dk1', V: 'ROLE' },
            { T: 'c10', V: '3' }
        ];
        this.srv.getdata('lists', this.tv).subscribe((r) => {
            this.res = r;
            if (r.Status === 1 && r.Data?.length > 0) {
                this.roles = r.Data[0];
            }
        });
    }

    getUsers() {
        this.usr = [];
        this.tv = [
            { T: 'dk1', V: '0' },
            { T: 'c10', V: '87' }
        ];

        this.srv.getdata('appuser', this.tv).subscribe((r) => {
            this.res = r;
            if (r.Status === 1 && r.Data?.length > 0) {

                this.users = r.Data[0].map((u: any) => ({
                    ...u,
                    FullPhone: `+${u.CountryCode} ${""}${u.Phone}`
                }));

                this.dataSource.data = this.users;
                this.tbidx = 0;
            }
        });
    }


    editUser() {
        const roleMap: Record<string, number> = {
            'Super Admin': 1,
            'Admin': 2
        };

        const payload = {
            FirstName: this.usr['FirstName'],
            LastName: this.usr['LastName'],
            Email: this.usr['Email'],
            CountryCode: this.usr['CountryCode'],
            Phone: this.usr['Phone'],
            Role: roleMap[this.usr['Role']] || 0,
            Gender: this.usr['Gender'],
            DOB: this.usr['DateOfBirth']
        };

        this.tv = [
            { T: 'dk1', V: this.usr['UserIDAlt'] },
            { T: 'c1', V: JSON.stringify(payload) },
            { T: 'c10', V: '85' }
        ];

        this.srv.getdata('appuser', this.tv).subscribe(r => {
            if (r.Status === 1) {
                this.getUsers();
                this.tbidx = 0;
            }
        });
    }


}

