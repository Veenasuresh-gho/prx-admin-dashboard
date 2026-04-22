import { Component, AfterViewInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DatePipe } from "@angular/common";
import { GHOService } from "../services/ghosrvs";
import { tags } from "../model/ghomodel";
import { MatIconModule } from "@angular/material/icon";

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

    ngAfterViewInit(): void {
        this.runCountUp();
        this.animateBars();
        this.getCount();
    }

   cards: any[] = [
  { type: 'Hospital', color: 'blue', icon: 'local_hospital', progress: 0 },
  { type: 'Lab', color: 'purple', icon: 'science', progress: 0 },
  { type: 'Pharmacy', color: 'green', icon: 'local_pharmacy', progress: 0 },
  { type: 'Dental', color: 'amber', icon: 'medical_services', progress: 0 },
  { type: 'Blood Bank', color: 'red', icon: 'bloodtype', progress: 0 },
  { type: 'Opticals', color: 'cyan', icon: 'visibility', progress: 0 },
  { type: 'Wellness', color: 'teal', icon: 'spa', progress: 0 },
  { type: 'Clinic', color: 'violet', icon: 'local_hospital', progress: 0 }
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