import { Component, inject, Inject, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { catchError, filter } from 'rxjs/operators';
import { MatIcon } from "@angular/material/icon";
import { tags, ghoresult } from './model/ghomodel';
import { GHOService } from './services/ghosrvs';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIcon, CommonModule, MatDialogModule,
    MatButtonModule, MatMenuModule],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = 'Global Second Opinion Network';
  footerUrl = 'https://globalhealthopinion.com';
  footerLink = 'Global Health Opinion';

  showNavbar: boolean = true;
  hiddenRoutes: string[] = ['/', '/login', '/join', '/broadcasted-case'];
  isjoin: boolean = false;

  srv = inject(GHOService);
  userid: string = "";
  pw: string = "";
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  menuItems: any[] = [];
  doctorInfo: any = [];
  selectedItem: any = null;
  selectedMenu: string = 'Dashboard';
  selectedTab: number | null = null;
  doctorId: string = '';
  userId = "";
  userInfo: any = [];


  notifications = [
    { message: 'New message received' },
    { message: 'Server backup completed' },
  ];

  constructor(private router: Router, private dialog: MatDialog) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showNavbar = !this.hiddenRoutes.includes(event.urlAfterRedirects);
      this.isjoin = (event.urlAfterRedirects === "/join");

      if (this.showNavbar) {
        this.getmenu();
      }


      const current = this.menuItems.find(m => m.link === event.urlAfterRedirects);
      this.selectedMenu = current ? current.name : '';

      localStorage.setItem("tkn", "");
      localStorage.setItem("id", "");
    });


  }

  naviagteToProfile() {
    this.router.navigate([`/profile`]);

  }

  ngOnInit(): void {
    this.doctorId = this.srv.getsession('id');
    if (this.doctorId) {
      this.getDoctorDetails()
      this.getUserDetails()
    }
    const navMain = document.getElementById('navbarCollapse');
    if (navMain) {
      navMain.onclick = () => {
        if (navMain) {
          navMain.classList.remove("show");
        }
      }
    }
  }

  navigateToProfile() {
    this.router.navigate(['/dashboard/profile']);
  }


  // Logout with confirmation dialog
  logout() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'custom-dialog-container',
      data: { title: 'Logout', message: 'Are you sure you want to logout?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.srv.logout();
      }
    });
  }

  onMenuClick(item: any) {
    if (item.MenuName === 'Logout') {
      this.logout();
    } else {
      this.selectedMenu = item.MenuName;
      this.srv.navigate(item.Router);
    }
  }

  onMobileMenuClick(item: any) {
    this.onMenuClick(item);

    const offcanvasEl = document.getElementById('mobileSidebar');
    if (offcanvasEl) {
      try {
        const offcanvasInstance: any = (window as any).bootstrap?.Offcanvas.getInstance(offcanvasEl);
        offcanvasInstance?.hide();
      } catch (e) {
        console.error('Offcanvas close error:', e);
      }
    }
  }

  getmenu() {
    this.tv = [];
    this.tv.push({ T: "c10", V: "100" });
    this.srv.getdata("menu", this.tv).pipe(
      catchError((err) => {
        this.srv.openDialog("Menu", "e", "error while loading menu");
        throw err;
      })
    ).subscribe((r) => {
      if (r.Status === 1) {
        this.menuItems = r.Data[0];
      }
    });
  }

  getDoctorDetails() {
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.doctorId });
    this.tv.push({ T: "c10", V: "7" });
    this.srv.getdata("reviewer", this.tv).pipe(
      catchError((err) => {
        this.srv.openDialog("Doctor Info", "e", "error while loading doctor info");
        throw err;
      })
    ).subscribe((r) => {
      if (r.Status === 1) {
        this.doctorInfo = r.Data[0][0];
      }
    });
  }

  getUserDetails() {
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.doctorId });
    this.tv.push({ T: "c10", V: "87" });
    this.srv.getdata("appuser", this.tv).pipe(
      catchError((err) => {
        this.srv.openDialog("Doctor Info", "e", "error while loading doctor info");
        throw err;
      })
    ).subscribe((r) => {
      if (r.Status === 1) {
        this.userInfo = r.Data[0][0];
      }
    });
  }

}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="dialog-container">
      <div class="">      
       <img class="logo" src="/cred/prx-logo.png" style="width:30px; height: auto;" />
      </div>
      <h4 mat-dialog-title class="dialog-title">{{ data.title }}</h4>
      <mat-dialog-content class="dialog-content">{{ data.message }}</mat-dialog-content>
      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button class="btn-no" (click)="onNoClick()">Cancel</button>
        <button mat-button color="primary" class="btn-yes" (click)="onYesClick()">Yes, Log Out</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 30px;
      min-width: 300px;
    }

    .dialog-title {
      margin: 0 0 12px 0;
      font-weight: 400;
    }

    .dialog-content {
      margin-bottom: 20px;
      font-size: 14px;
      color: #333;
    }
      .custom-dialog-container {
  z-index: 1100 !important; 
}


    .dialog-actions button {
      min-width: 70px;
    }

    .btn-no {
      color: #555;
      border-radius: 4px;
       cursor: pointer;
    }

  .btn-yes {
  background-color: #1976d2 !important; 
  color: #fff !important;              
  border-radius: 4px;
   cursor: pointer;
}
     .logo {
    width: 120px;
  }

  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }


}
