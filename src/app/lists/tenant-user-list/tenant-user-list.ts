import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { tags } from '../../model/ghomodel';
import { GHOService } from '../../services/ghosrvs';
import { OnChanges, SimpleChanges } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tenant-user-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIcon, MatButtonModule,
    MatFormFieldModule, FormsModule,
    MatInputModule, MatSelectModule],
  templateUrl: './tenant-user-list.html',
  styleUrl: './tenant-user-list.css',
})
export class TenantUserList {

  srv = inject(GHOService);

  loading = false;
  tv: tags[] = [];
  @Input() tenant: any;
  @Output() usersLoaded = new EventEmitter<any[]>();

  passwordExpandedRow: any = null;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  dataSource: any[] = [];
  fieldStyle: any = 'outline';
  cntrys: any[] = [];
  selectedRole = '';
  selectedStatus = '';
  timeOptions: string[] = [];
  editingShift: any = null;
  editingRow: any = null;

  roles = [
    { value: 'A', label: 'Admin' },
    { value: 'N', label: 'Nurse' }
  ];
  statuses = [
    { value: 'APPROVED', label: 'Approved' },
    { value: 'PENDING', label: 'Pending' },
  ];

  columns: string[] = ['FirstName', 'Phone', 'EmployeId', 'Role', 'Status'];

  expandedRow: any = null;
  shiftExpandedRow: any = null;
  hidePassword: boolean = true;
  imageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  generateTimeOptions() {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const date = new Date();
        date.setHours(hour, minute);

        const time = date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: minute === 0 ? undefined : '2-digit',
          hour12: true
        });

        this.timeOptions.push(time);
      }
    }
  }

  editShift(row: any, shift: any) {

    this.shiftExpandedRow = row;
    this.editingRow = row;

    this.editingShift = {
      id: shift.id,
      day: shift.day,
      startTime: shift.startTime,
      endTime: shift.endTime
    };

  }

  ngOnInit() {
    this.getCountries();
    this.generateTimeOptions();
  }

  getShift(row: any) {

    this.tv = [
      { T: 'dk1', V: row.TenantUserIDAlt },
      { T: 'c10', V: '5' }
    ];

    this.srv.getdata('employeedefaultshiftdtl', this.tv).subscribe(r => {

      if (r.Status === 1) {

        const shifts = r.Data?.[0] || [];

        row.Shifts = shifts.map((item: any) => ({
          id: item.ID,
          day: item.DayID,
          dayName: item.DayName,
          startTime: item.StartHour,
          endTime: item.EndHour
        }));

      } else {

        row.Shifts = [];

      }

    });

  }

  saveShift(row: any, shift: any) {

    if (!shift.day || !shift.startTime || !shift.endTime) {
      this.srv.openDialog(
        'Warning',
        'w',
        'Please fill all shift details.'
      );
      return;
    }

    this.tv = [
      { T: 'dk1', V: row.TenantUserIDAlt },
      { T: 'c1', V: shift.day },
      { T: 'c2', V: shift.startTime },
      { T: 'c3', V: shift.endTime },
      { T: 'dk2', V: shift.id || 0 },   // Shift ID
      { T: 'c10', V: shift.id ? '2' : '1' } // 1=Insert,2=Update
    ];

    this.srv.getdata('employeedefaultshiftdtl', this.tv).subscribe(r => {

      const message = r?.Data?.[0]?.[0]?.Msg || r?.Info || 'Shift saved successfully';

      if (r.Status === 1) {

        this.getShift(row);

        this.editingShift = null;

        this.srv.openDialog('Success', 's', 'Shift saved successfully');

      } else {

        this.srv.openDialog(
          'Error',
          'e',
          message
        );

      }

    });

  }


deleteShift(row: any, shift: any) {
console.log(row)
console.log(shift)


  this.tv = [
    { T: 'dk1', V: row.TenantUserIDAlt },
    { T: 'dk2', V: shift.id },
    { T: 'c10', V: '4' }
  ];

  this.srv.getdata('employeedefaultshiftdtl', this.tv).subscribe(r => {

    const message =
      r?.Data?.[0]?.[0]?.msg ||
      r?.Info ||
      'Shift deleted successfully';

    if (r.Status === 1) {
      this.getShift(row);
      this.srv.openDialog('Success', 's', message);
    } else {
      this.srv.openDialog('Error', 'e', message);
    }

  });

}

  // img
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.imageFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }


  getCountries() {
    this.tv = [{ T: 'c10', V: '99' }];

    this.srv.getdata('lists', this.tv).subscribe(r => {
      if (r.Status === 1) {
        this.cntrys = r.Data[0];
      }
    });
  }

  togglePasswordSection(row: any) {

    this.passwordExpandedRow =
      this.passwordExpandedRow === row
        ? null
        : row;

    // Previously pre-filled with row.Password (the stored plaintext password),
    // exposing it directly in the DOM. Cleared instead - the user/admin should
    // type the current password rather than have it silently populated.
    row.CurrentPassword = '';

    row.NewPassword = '';
    row.ConfirmPassword = '';
  }

  toggleShiftSection(row: any) {
    this.shiftExpandedRow =
      this.shiftExpandedRow === row ? null : row;

    if (this.shiftExpandedRow) {
      this.getShift(row);

      // show add form
      this.editingRow = row;
      this.editingShift = {
        id: 0,
        day: '',
        startTime: '',
        endTime: ''
      };
    } else {
      this.editingRow = null;
      this.editingShift = null;
    }
  }

  addShift(row: any) {

    this.shiftExpandedRow = row;
    this.editingRow = row;

    this.editingShift = {
      id: 0,
      day: '',
      startTime: '',
      endTime: ''
    };

  }

  removeShiftRow(row: any, index: number) {
    row.Shifts.splice(index, 1);
  }




  updatePassword(row: any) {
    if (!row.CurrentPassword ||
      !row.NewPassword ||
      !row.ConfirmPassword) {

      this.srv.openDialog(
        'Warning',
        'w',
        'Please fill all fields'
      );

      return;
    }

    if (row.NewPassword !== row.ConfirmPassword) {

      this.srv.openDialog(
        'Warning',
        'w',
        'Passwords do not match'
      );

      return;
    }

    this.tv = [

      { T: 'dk1', V: row?.TenantUserIDAlt },
      { T: 'c1', V: row.CurrentPassword },
      { T: 'c2', V: row.NewPassword },
      { T: 'c10', V: '15' }
    ];

    this.srv.getdata(
      'tenantuser',
      this.tv
    ).subscribe(r => {

      const message =
        r?.Data?.[0]?.[0]?.msg ||
        'Password Updated';

      if (r.Status === 1) {

        this.srv.openDialog(
          'Success',
          's',
          message
        );

        this.passwordExpandedRow = null;
      }
      else {

        this.srv.openDialog(
          'Error',
          'e',
          message
        );

      }

    });

  }


  getSelectedCountryCode(countryId: number): string {
    const country = this.cntrys.find(c => c.CountryID === countryId);
    return country ? country.CountryCode : '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tenant'] && this.tenant) {
      this.getTenantUsersList();
    }
  }

  toggleRow(row: any) {
    this.expandedRow = this.expandedRow === row ? null : row;
  }

  mapRole(role: string): string {
    if (!role) return '';

    const r = role.toLowerCase().trim();

    if (r === 'admin') return 'A';
    if (r === 'nurse') return 'N';

    return role;
  }

  getTenantUsersList() {
    this.loading = true;

    this.tv = [
      { T: 'dk1', V: this.tenant?.TenantIDAlt || '' },
      { T: 'c10', V: '3' }
    ];

    this.srv.getdata('tenantuser', this.tv).subscribe(r => {
      this.loading = false;

      if (r.Status === 1) {

        this.dataSource = r.Data[0].map((item: any) => ({
          TenantID: item.ID,
          TenantUserIDAlt: item.TenantUserIDAlt,
          FirstName: item.FirstName?.trim(),
          LastName: item.LastName?.trim(),
          Email: item.Email,
          Phone: item.Phone,
          CountryID: item.CountryID,
          CountryCode: item.CountryCode,
          EmployeId: item.EmployeeID,
          Role: this.mapRole(item.Role),
          Password: item.Password,
          // Status: item.Status
          Status: item.Status
            ? item.Status.toString().trim().toUpperCase()
            : 'PENDING'
        }));



        this.usersLoaded.emit(this.dataSource);

      } else {
        this.dataSource = [];
        this.usersLoaded.emit([]);
      }
    });
  }

  getStatusLabel(status: string): string {
    const s = this.statuses.find(x => x.value === status);
    return s ? s.label : status;
  }

  deleteTenant(row: any, event: Event) {
    event.stopPropagation(); //  prevent row expand

    const confirmed = window.confirm(
      `Delete ${row.FirstName} ${row.LastName}? This cannot be undone.`
    );
    if (!confirmed) return;

    this.tv = [
      { T: 'dk1', V: row.TenantUserIDAlt }, //  THIS IS YOUR ID
      { T: 'c10', V: '4' }
    ];

    this.srv.getdata('tenantuser', this.tv).subscribe(r => {
      const message = r?.Data?.[0]?.[0]?.msg || 'Deleted';

      if (r.Status === 1) {

        this.srv.openDialog('Success', 's', message);

        //  refresh list
        this.getTenantUsersList();
      } else {
        this.srv.openDialog('Error', 'e', r.Info || 'Delete failed');
      }
    });
  }

  updateTenant(row: any, event: Event) {
    event.stopPropagation();

    const payload = {
      FirstName: row.FirstName,
      TenantUserIDAlt: row.TenantUserIDAlt,
      LastName: row.LastName,
      Email: row.Email,
      Role: row.Role,
      Phone: row.Phone,
      CountryID: row.CountryID,
      Status: row.Status
    };

    this.tv = [
      { T: 'dk1', V: row.TenantUserIDAlt },
      { T: 'c1', V: JSON.stringify(payload) },
      { T: 'c10', V: '2' }
    ];


    this.srv.getdata('tenantuser', this.tv).subscribe(r => {
      const message = r?.Data?.[0]?.[0]?.msg;
      const Info = r?.Info || 'Update failed';

      if (r.Status === 1) {

        this.srv.openDialog('Success', 's', message);

        this.getTenantUsersList();
        this.expandedRow = null;

      }
      else {
        this.srv.openDialog('Error', 'e', message || 'Update failed');
      }
    });
  }



  getSelectedCountryName(countryId: number): string {
    const c = this.cntrys.find(x => x.CountryID === countryId);
    return c ? c.CountryName : '';
  }
  getRoleLabel(role: string): string {
    const r = this.roles.find(x => x.value === role);
    return r ? r.label : role;
  }

}