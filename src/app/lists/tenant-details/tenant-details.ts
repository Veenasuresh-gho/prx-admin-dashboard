import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { tags } from '../../model/ghomodel';
import { GHOService } from '../../services/ghosrvs';

@Component({
  selector: 'tenant-details',
  templateUrl: './tenant-details.html',
  styleUrl: './tenant-details.css',
})
export class TenantDetails implements OnChanges {
  srv = inject(GHOService);
  tv: tags[] = [];
  details: any;
  @Input() tenant: any;
  loading: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tenant'] && this.tenant) {
      this.getTenantDetails();
    }
  }

  getTenantDetails() {
      this.loading = true;

    this.tv = [
      { T: 'dk1', V: this.tenant?.TenantIDAlt },
      { T: 'c10', V: '11' }
    ];

    this.srv.getdata('Tenants', this.tv).subscribe(r => {
       this.loading = false;
      if (r.Status === 1) {
        this.details = r.Data[0][0];
      }
    });
  }
}