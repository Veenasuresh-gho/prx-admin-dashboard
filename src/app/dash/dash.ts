import { Component, AfterViewInit, inject } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";

import { GHOService } from "../services/ghosrvs";
import { tags } from "../model/ghomodel";
import { Calender } from "../login-list/calender/calender";

@Component({
  selector: "dashboard",
  standalone: true,
  templateUrl: "./dash.html",
  imports: [
    DatePipe,
    CommonModule,
    MatIconModule,
    Calender
  ],
  styleUrls: ["./dash.css"],
})
export class Dashboard implements AfterViewInit {

  srv = inject(GHOService);

  router = inject(Router);

  tv: tags[] = [];

  currentDate: Date = new Date();

  startDateFormatted: string = '';
  endDateFormatted: string = '';

  selectedDateFormatted: string = '';

  count: any[] = [];

  // LOGIN
  loginStats: any = {};

  platforms: any[] = [];

  isLoginLoading = false;

  // NEW USERS
  newUserStats: any = {};

  newUserPlatforms: any[] = [];

  isNewUserLoading = false;

  cards: any[] = [
    {
      id: 1,
      type: 'Hospital',
      color: 'blue',
      icon: 'local_hospital',
      progress: 0
    },
    {
      id: 2,
      type: 'Lab',
      color: 'purple',
      icon: 'biotech',
      progress: 0
    },
    {
      id: 3,
      type: 'Pharmacy',
      color: 'emerald',
      icon: 'medication',
      progress: 0
    },
    {
      id: 4,
      type: 'Dental',
      color: 'sky',
      icon: 'medical_services',
      progress: 0
    },
    {
      id: 5,
      type: 'Blood Bank',
      color: 'red',
      icon: 'bloodtype',
      progress: 0
    },
    {
      id: 6,
      type: 'Opticals',
      color: 'cyan',
      icon: 'visibility',
      progress: 0
    },
    {
      id: 7,
      type: 'Wellness',
      color: 'teal',
      icon: 'self_improvement',
      progress: 0
    },
    {
      id: 8,
      type: 'Clinic',
      color: 'indigo',
      icon: 'medical_information',
      progress: 0
    },
    {
      id: 9,
      type: 'Nutrition',
      color: 'emerald',
      icon: 'restaurant',
      progress: 0
    },
    {
      id: 10,
      type: 'Mental Health',
      color: 'violet',
      icon: 'psychology',
      progress: 0
    },
    {
      id: 11,
      type: 'Homeopathy',
      color: 'orange',
      icon: 'spa',
      progress: 0
    },
    {
      id: 12,
      type: 'Ayurveda',
      color: 'amber',
      icon: 'eco',
      progress: 0
    },
  ]

  ngAfterViewInit(): void {

    const today = new Date();

    const day = String(today.getDate()).padStart(2, '0');

    const month = String(today.getMonth() + 1).padStart(2, '0');

    const year = today.getFullYear();

    this.selectedDateFormatted = `${day}/${month}/${year}`;

    this.getCount();

    this.getLoginCount();

    this.getNewUserCount();
  }

  onDateChange(date: Date | null): void {

    if (!date) return;

    const day = String(date.getDate()).padStart(2, '0');

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const year = date.getFullYear();

    this.selectedDateFormatted = `${day}/${month}/${year}`;

    this.getLoginCount();

    this.getNewUserCount();
  }

  onRangeChange(range: { start: Date | null; end: Date | null }) {

    if (!range.start || !range.end) return;

    this.selectedDateFormatted = '';

    this.startDateFormatted =
      this.formatDate(range.start);

    this.endDateFormatted =
      this.formatDate(range.end);

    this.getLoginCount();
    this.getNewUserCount();
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  goToLoginDetails(): void {

    this.router.navigate(['/loginList']);
  }

  goToNewUserDetails(): void {
    this.router.navigate(['/NewUserList']);
  }
  getLoginCount(): void {

    this.isLoginLoading = true;

    const fromDate =
      this.startDateFormatted || this.selectedDateFormatted;

    const toDate =
      this.endDateFormatted || '';

    this.tv = [
      {
        T: 'dk1',
        V: fromDate
      },
      {
        T: 'dk2',
        V: toDate
      },
      {
        T: 'c10',
        V: '7'
      }
    ];

    this.srv.getdata('adminuser', this.tv).subscribe({

      next: (r: any) => {

        this.isLoginLoading = false;

        if (r.Status === 1) {

          this.loginStats = r.Data?.[0]?.[0] || {};

          this.platforms = [
            {
              label: 'Website',
              icon: 'language',
              count: this.loginStats?.Web || 0,
              color: '#3266ad'
            },
            {
              label: 'App',
              icon: 'smartphone',
              count: this.loginStats?.Mobile || 0,
              color: '#1d9e75'
            }
          ];

          setTimeout(() => {

            this.runCountUp();

            this.animateBars();

          }, 100);
        }
      },

      error: () => {

        this.isLoginLoading = false;
      }
    });
  }

  getNewUserCount(): void {

    this.isNewUserLoading = true;

    const fromDate =
      this.startDateFormatted || this.selectedDateFormatted;

    const toDate =
      this.endDateFormatted || '';

    this.tv = [
      {
        T: 'dk1',
        V: fromDate
      },
      {
        T: 'dk2',
        V: toDate
      },
      {
        T: 'c10',
        V: '10'
      }
    ];

    this.srv.getdata('adminuser', this.tv).subscribe({

      next: (r: any) => {

        this.isNewUserLoading = false;

        if (r.Status === 1) {

          this.newUserStats = r.Data?.[0]?.[0] || {};

          this.newUserPlatforms = [
            {
              label: 'Website',
              icon: 'language',
              count: this.newUserStats?.Web || 0,
              color: '#3266ad'
            },
            {
              label: 'App',
              icon: 'smartphone',
              count: this.newUserStats?.Mobile || 0,
              color: '#1d9e75'
            }
          ];

          setTimeout(() => {

            this.runCountUp();

            this.animateBars();

          }, 100);
        }
      },

      error: () => {

        this.isNewUserLoading = false;
      }
    });
  }

  getPercent(val: number, total?: number): number {

    const finalTotal = total || 0;

    if (!finalTotal) {

      return 0;
    }

    return Math.round((val / finalTotal) * 100);
  }

  getCount(): void {

    this.tv = [
      {
        T: 'c10',
        V: '19'
      }
    ];

    this.srv.getdata('Tenants', this.tv).subscribe((r: any) => {

      if (r.Status === 1) {

        this.count = r.Data?.[0] || [];

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

  openTenant(card: any): void {

    this.router.navigate(['/lists'], {
      queryParams: {
        typeId: card.id
      }
    });
  }

  runCountUp(): void {

    const elements = document.querySelectorAll("[data-target]");

    elements.forEach((el: any, i: number) => {

      const target = parseInt(el.dataset.target || '0', 10);

      setTimeout(() => {

        const duration = 1200;

        const start = performance.now();

        const tick = (now: number) => {

          const progress = Math.min(
            (now - start) / duration,
            1
          );

          const eased = 1 - Math.pow(2, -10 * progress);

          el.textContent = Math.floor(
            eased * target
          ).toLocaleString();

          if (progress < 1) {

            requestAnimationFrame(tick);

          } else {

            el.textContent = target.toLocaleString();
          }
        };

        requestAnimationFrame(tick);

      }, i * 120);
    });
  }

  animateBars(): void {

    setTimeout(() => {

      const bars = document.querySelectorAll("[data-w]");

      bars.forEach((el: any) => {

        el.style.width = el.dataset.w + "%";
      });

    }, 200);
  }
}