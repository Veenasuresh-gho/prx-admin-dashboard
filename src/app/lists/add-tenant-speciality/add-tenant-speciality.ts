import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GHOService } from '../../services/ghosrvs';
import { tags } from '../../model/ghomodel';

@Component({
  selector: 'app-add-tenant-speciality',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule],
  templateUrl: './add-tenant-speciality.html',
  styleUrl: './add-tenant-speciality.css',
})
export class AddTenantSpeciality {
  @Input() tenant: any;
  @Output() specialityAdded = new EventEmitter<any>();
  @Input() specialty: any;

  srv = inject(GHOService);
  tv: tags[] = [];
  cntrys: any[] = [];
  tenantTypes: any[] = [];

  isEditMode = false;

  model: any = {
    SpecialtyName: '',
    SpecialtyType: '',
    Description: '',
    RateAmount: null
  };

  resetForm() {
    this.model = {
      SpecialtyName: '',
      SpecialtyType: '',
      Description: '',
      RateAmount: null
    };

    this.isEditMode = false;
    this.specialty = null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['specialty'] && this.specialty) {

      this.model = {
        ID: this.specialty.ID,
        SpecialtyName: this.specialty.SpecialtyName,
        SpecialtyType: this.specialty.SpecialtyType,
        Description: this.specialty.Description || '',
        RateAmount: this.specialty.RateAmount
      };

      this.isEditMode = true;
    }
  }

  addSpecialty() {
    const value = (this.model.SpecialtyName || '').trim();
    if (!value) return;

    if (this.isEditMode) {
      this.updateSpecialty();   // 🔥 call update
    } else {
      this.createSpecialty();   // 🔥 call add
    }
  }

  createSpecialty() {
    this.tv = [
      { T: 'c1', V: this.model.SpecialtyName },
      { T: 'c2', V: this.model.SpecialtyType || 'M' },
      { T: 'c3', V: this.model.Description || '' },
      { T: 'c4', V: this.model.RateAmount || '0' },
      { T: 'c5', V: this.tenant?.TenantIDAlt },
      { T: 'c10', V: '1' }
    ];


    this.srv.getdata('specialty', this.tv).subscribe(r => {
      console.log('ADD RESPONSE:', r);
      if (r.Status === 1) {
        this.srv.openDialog('Success', 's', 'Speciality Added successfully');
        // const message = r?.Data?.[0]?.[0]?.msg;
        // this.srv.openDialog('Success', 's', message);
        this.afterSave();
      }
    });
  }

  updateSpecialty() {
    this.tv = [
      { T: 'dk1', V: this.model.ID },
      { T: 'c1', V: this.model.SpecialtyName },
      { T: 'c2', V: this.model.SpecialtyType || '' },
      { T: 'c3', V: this.model.Description || '' },
      { T: 'c4', V: this.model.RateAmount || '0' },
      { T: 'c10', V: '2' }
    ];

console.log('UPDATE REQUEST:', this.tv);
    this.srv.getdata('specialty', this.tv).subscribe(r => {
      console.log('UPDATE RESPONSE:', r);

      if (r.Status === 1) {
        const message = r?.Data?.[0]?.[0]?.msg;
        this.srv.openDialog('Success', 's', message); this.afterSave();
      }
    });
  }

  afterSave() {
    this.specialityAdded.emit(true);
    this.resetForm();
    this.isEditMode = false;
    this.specialty = null;
  }

  deleteSpecialty() {
    this.tv = [
      { "T": "dk1", "V": this.model.ID },
      { "T": "c10", "V": "7" }
    ];
    console.log('DELETE REQUEST:', this.tv); // 🔥 DEBUG
    this.srv.getdata('specialty', this.tv).subscribe(r => {
            console.log('delete RESPONSE:', r);

      if (r.Status === 1) {
        const message = r?.Data?.[0]?.[0]?.msg;
        this.srv.openDialog('Success', 's', message);
        this.afterSave();
      }
    });
  }

}
