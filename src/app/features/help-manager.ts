import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { catchError } from 'rxjs';
import { tags, ghoresult } from '../model/ghomodel';
import { GHOService } from '../services/ghosrvs';
import { GHOTextEditor } from "./gho-text-editor";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
@Component({

    selector: 'gho-help-manager',
    template: `
       <div class=" border-round bg-white ">
        <div class="section-title  ">
            Help center manager
        </div>
        <div class="row  p10">
            <table >
                <tr>
                    <td class="p10 "  style="width: 120px;"><mat-label>Help Topic : </mat-label></td>
                    <td style="width: 300px;" class="pr10">
                        <mat-select name="hlptags" (selectionChange)="get($event)" class="input border">
                            @for (tgs of topics; track tgs) {
                            <mat-option [value]="tgs['id']">{{tgs['txt']}}</mat-option>
                            }
                        </mat-select>
                    </td>
                    <td style="width: 50px;"><mat-label>Title : </mat-label></td>
                    <td style="width: 400px;" class="pr10">
                        <input matInput type="text" class=w100 [(ngModel)]="tit">
                    </td>
                    <td></td>
                </tr>
            </table>


            <div class="col-sm-12">
                <table class="w100">
                    <tr>
                        <td class="orange">
                            <h5>Help Content</h5>
                        </td>
                        <td class=" p10 right" style="width:350px !important;">
                            <button class="w100" (click)="save()" matButton="outlined"> <i
                                    class="bi bi-save  fs-5 pointer"></i> Save help Title & Content</button>
                        </td>
                    </tr>
                </table>

                <gho-texteditor [dataIn]="html" (dataChange)="updatehtml($event)"> </gho-texteditor>
            </div>
        </div>
    </div>
     `,
    imports: [MatButtonModule, MatInputModule, CommonModule, GHOTextEditor, MatSelectModule, FormsModule, MatFormFieldModule],
})
export class GHOHelpMgr {
    constructor(private cdr: ChangeDetectorRef) { }
    srv = inject(GHOService)
    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    hTag: string = ""
    html: string = ""
    tit: string = "";
    topics: [];
    id: string = "0";


    ngOnInit(): void {
        this.getHelpList();
    }

    getHelpList() {
        this.tv = [];
        this.tv.push({ T: "c10", V: "84" })
        this.srv.getdata("lists", this.tv).pipe
            (
                catchError((err) => { throw err })
            ).subscribe((r) => {

                this.res = r;
                if (this.res.Status == 1) {
                    this.topics = this.res.Data[0];
                    this.cdr.detectChanges();
                }
                else {
                    this.srv.openDialog("Help ", "e", this.res.Info)
                    this.cdr.detectChanges();
                }
            }
            );
    }
    updatehtml(e: any) {
        this.html = e;
    }
    get(e: MatSelectChange) {
        this.hTag = e.value;
        this.tv = [];
        this.tv.push({ T: "dk1", V: this.hTag })
        this.tv.push({ T: "c10", V: "3" })
        this.srv.getdata("apphelp", this.tv).pipe
            (
                catchError((err) => {
                    this.html = "No help avaialble now";
                    throw err
                })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.id = r.Data[0][0]["id"];
                    this.tit = r.Data[0][0]["t"];
                    this.html = r.Data[0][0]["m"];
                    this.cdr.detectChanges();
                }
                else {
                    this.id = "0";
                    this.tit = "";
                    this.html = "";
                    this.cdr.detectChanges();
                }
            }
            );
    }
    save() {
        this.tv = [];
        this.tv.push({ T: "dk1", V: this.id })
        this.tv.push({ T: "c1", V: this.hTag })
        this.tv.push({ T: "c2", V: this.tit })
        this.tv.push({ T: "c3", V: this.html })
        if (this.id == "0") { this.tv.push({ T: "c10", V: "1" }) }
        else { this.tv.push({ T: "c10", V: "2" }) }
        this.srv.getdata("apphelp", this.tv).pipe
            (
                catchError((err) => {
                    this.html = "No help avaialble now";
                    throw err
                })
            ).subscribe((r) => {
                if (r.Status == 1) {
                    this.id = r.Data[0][0]["tid"];
                    this.cdr.detectChanges();
                }
                this.cdr.detectChanges();

            }
            );

    }
}

