import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { tags } from '../../model/ghomodel';
import { GHOService } from '../../services/ghosrvs';
import { OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-tenant-user-list',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './tenant-user-list.html',
  styleUrl: './tenant-user-list.css',
})
export class TenantUserList {

 srv = inject(GHOService);

  loading = false;
  tv: tags[] = [];
    @Input() tenant: any;
    @Output() usersLoaded = new EventEmitter<any[]>();


  dataSource: any[] = [];

  columns: string[] = ['FirstName', 'Email', 'Phone', 'EmployeId', 'Role', 'Status'];

  expandedRow: any = null;

ngOnChanges(changes: SimpleChanges): void {
  if (changes['tenant'] && this.tenant) {
    this.getTenantUsersList();
  }
}

  toggleRow(row: any) {
    this.expandedRow = this.expandedRow === row ? null : row;
  }

  //  API CALL
  getTenantUsersList() {
    this.loading = true;
    console.log('tenent',this.tenant);
    

    this.tv = [
      { T: 'dk1', V: this.tenant?.TenantIDAlt || '' },
      { T: 'c10', V: '3' }
    ];

    this.srv.getdata('tenantuser', this.tv).subscribe(r => {
      this.loading = false;

      if (r.Status === 1) {

        //  map API → UI model
        this.dataSource = r.Data[0].map((item: any) => ({
          TenantID: item.ID,
          TenantUserIDAlt:item.TenantUserIDAlt,
          FirstName: item.FirstName?.trim(),
          LastName: item.LastName?.trim(),
          Email: item.Email,
          Phone: item.Phone,
          EmployeId: item.EmployeeID, 
          Role: item.Role,
          CountryID: null,
          Status: item.Status
        }));
        console.log('tenentuser',this.dataSource);
        
          //  SEND TO PARENT
    this.usersLoaded.emit(this.dataSource);

      } else {
         this.dataSource = [];
    this.usersLoaded.emit([]);
      }
    });
  }

deleteTenant(row: any, event: Event) {
  event.stopPropagation(); //  prevent row expand

  console.log('Deleting user:', row);

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

}