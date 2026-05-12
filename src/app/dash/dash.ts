import { Component, AfterViewInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DatePipe } from "@angular/common";
import { GHOService } from "../services/ghosrvs";
import { tags } from "../model/ghomodel";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "dashboard",
  templateUrl: "./dash.html",
  imports: [DatePipe, CommonModule, MatIconModule],
  styleUrls: ["./dash.css"],
})
export class Dashboard implements AfterViewInit {
  count: any[] = [];
  srv = inject(GHOService);
  tv: tags[] = [];
  currentDate: Date = new Date();
  loginStats = { total: 100 };


  ngAfterViewInit(): void {
    this.runCountUp();
    this.animateBars();
    this.getCount();
  }
  
  goToLoginDetails(): void {
    this.router.navigate(['/loginList']);
  }
  getPercent(val: number) {
    return Math.round((val / this.loginStats.total) * 100);
  }

  platforms = [
    { label: 'Website', icon: 'language', count: 62, color: '#3266ad' },
    { label: 'App', icon: 'smartphone', count: 38, color: '#1d9e75' }
  ];

  cards: any[] = [
    { id: 1, type: 'Hospital', color: 'blue', icon: 'local_hospital', progress: 0 },
    { id: 2, type: 'Lab', color: 'purple', icon: 'science', progress: 0 },
    { id: 3, type: 'Pharmacy', color: 'green', icon: 'local_pharmacy', progress: 0 },
    { id: 4, type: 'Dental', color: 'amber', icon: 'medical_services', progress: 0 },
    { id: 5, type: 'Blood Bank', color: 'red', icon: 'bloodtype', progress: 0 },
    { id: 6, type: 'Opticals', color: 'cyan', icon: 'visibility', progress: 0 },
    { id: 7, type: 'Wellness', color: 'teal', icon: 'spa', progress: 0 },
    { id: 8, type: 'Clinic', color: 'violet', icon: 'local_hospital', progress: 0 }
  ];

  getCount() {
    this.tv = [{ T: 'c10', V: '19' }];

    this.srv.getdata('Tenants', this.tv).subscribe(r => {
      if (r.Status === 1) {
        this.count = r.Data[0];

        this.cards = this.cards.map(card => {
          const match = this.count.find(
            (c: any) => c.TenantType === card.type
          );

          return {
            ...card,
            label: match?.TenantType || card.type,
            count: match?.TenantCount || 0
          };
        });
      }
    });
  }


  router = inject(Router);

  openTenant(card: any) {
    this.router.navigate(['/lists'], {
      queryParams: {
        typeId: card.id   // this is your c1
      }
    });
  }

  runCountUp() {
    const elements = document.querySelectorAll("[data-target]");

    elements.forEach((el: any, i: number) => {
      const target = parseInt(el.dataset.target);

      setTimeout(() => {
        const duration = 1400;
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(2, -10 * progress);

          el.textContent = Math.floor(eased * target).toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = target.toLocaleString();
          }
        };

        requestAnimationFrame(tick);
      }, 300 + i * 100);
    });
  }

  animateBars() {
    setTimeout(() => {
      const bars = document.querySelectorAll("[data-w]");
      bars.forEach((el: any) => {
        el.style.width = el.dataset.w + "%";
      });
    }, 600);
  }
}