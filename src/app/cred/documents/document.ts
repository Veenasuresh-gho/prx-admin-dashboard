
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, SimpleChanges } from '@angular/core';
import {
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadComponent } from "../../features/fileupload/fileupload";
import { tags, ghoresult } from '../../model/ghomodel';
import { GHOService } from '../../services/ghosrvs';


@Component({
  selector: 'reviewer-documents',
  template: `<div class=" border-round  ">
    <div class="cred-title  bg-white">
        <table class="w100">
            <tr>
                <td class="wicon"><img class="pr20" src="cred/folders.png"></td>
                <td>Documents </td>
            </tr>
        </table>
    </div><div class="p20 " > <app-upload [keyid]="id" docTypes="REVPROFILE"></app-upload></div>
    
</div>`,
  imports: [MatButtonModule,  FileUploadComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAlert {

   constructor(private cdr: ChangeDetectorRef) { }

    @Input() id: string = "0";
    ngOnChanges(changes: SimpleChanges) {
        if (changes['id']) {

            if (changes['id'].currentValue != undefined && changes['id'].currentValue !== null) {
                if (changes['id'].currentValue != changes['id'].previousValue) {
                }
            }
        }
    }
    ngOnInit(): void {

    }
  }


