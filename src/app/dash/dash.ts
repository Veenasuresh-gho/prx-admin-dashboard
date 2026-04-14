import { FullPageLoader } from '../features/fullpage-loader/fullpage-loader';
import { GHOService } from '../services/ghosrvs';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { ghoresult, tags } from '../model/ghomodel';
import { catchError } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { ApexChartComponent } from '../components/chart';


@Component({
    selector: 'rev-dashboard',
    templateUrl: './dash.html',
    styleUrl: './dash.css',
    imports: [CommonModule, MatTableModule, MatButtonModule, MatPaginatorModule,
        MatFormFieldModule, MatIconModule, MatSelectModule,
        FormsModule, MatDividerModule, ApexChartComponent],
})
export class RevDash implements OnInit {
    srv = inject(GHOService);
    userid: string = "";
    pw: string = "";
    tv: tags[] = [];
    res: ghoresult = new ghoresult();

    private service = inject(GHOService);
    fullpageLoader = inject(FullPageLoader);
    router = inject(Router)

    reviewerId = "";
    dataSource = new MatTableDataSource<any>();
    doctorInfo: any = [];
    statisticsData: any = {};
    performanceData: any = {};
    newCase: any[] = [];
    revenueGraphDetails: any[] = [];
    casesGraphDetails: any[] = [];
    dateRanges: any[] = [];
    selectedRange: string = '';
    percentage: number = 0;
    avgTime: number = 0;
    totalEarnings: number = 0;

    caselist() {
        this.router.navigate(["/cases"]);
    }


    @ViewChild(MatPaginator) paginator!: MatPaginator;
    constructor() { }
    cases: [] = [];
    rvs: [] = [];
    spls: [][] = [];
    drs: [][] = [];
    opens: [] = [];
    statisticsGraphData: any = [];
    tatGraphData: any[] = [];
    countryGraphData: any[] = [];

    ngOnInit(): void {
        this.reviewerId = this.service.getsession("id");
        if (this.reviewerId) {
            this.getdash()
            this.getChartData("90")
        }
    }

    getdash() {
        this.tv = [];
        this.tv.push({ T: "dk1", V: this.reviewerId });
        this.tv.push({ T: "c10", V: "101" });
        this.srv.getdata("admindash", this.tv).pipe(
            catchError((err) => {
                this.srv.openDialog("Admin", "e", "error while loading info");
                throw err;
            })
        ).subscribe((r) => {
            if (r.Status === 1) {
                this.cases = r.Data[0][0];
                this.rvs = r.Data[1][0];
                this.drs = r.Data[2];
                this.spls = r.Data[3];
                this.opens = r.Data[4];
            }
        });
    }


    getChartData(selectedRange: string) {
        this.tv = [];
        this.tv.push({ T: 'dk1', V: selectedRange });
        this.tv.push({ T: 'c10', V: '1' });

        this.srv.getdata('graph', this.tv).subscribe((r) => {
            this.res = r;
            if (r.Status === 1) {
                const data = r.Data;
                this.statisticsGraphData = (data[0] || []).map((d: any) => ({
                    label: d.Status,
                    value: d.Reviews
                }));

                this.tatGraphData = (data[1] || []).map((d: any) => ({
                    label: d.Tat,
                    value: d.Cases
                }));

                this.countryGraphData = (data[2] || []).map((d: any) => ({
                    label: d.Country,
                    value: d.Cases
                }));
            } else {
                this.srv.openDialog('Error', 'w', this.res.Info);
            }
        });
    }




}
