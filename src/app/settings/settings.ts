import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from "@angular/material/icon";
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { GHOService } from '../services/ghosrvs';
import { ghoresult, tags } from '../model/ghomodel';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-settings',
  imports: [MatIcon, MatSlideToggle, MatRadioModule, FormsModule, MatButtonModule, MatDialogModule, RouterOutlet],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {

  srv = inject(GHOService)
  tv: tags[] = []
  res: ghoresult = new ghoresult()

  showCurrentPassword = false
  showNewPassword = false
  showConfirmPassword = false
  deleteAccounts: any[] = []
  data: any
  reviewerID: string = ''
  currentPassword: string = ''
  newPassword: string = ''
  confirmPassword: string = ''
  userId = "";


  private dialog = inject(MatDialog)
  private router = inject(Router)
  private service = inject(GHOService);
  dialogRef!: MatDialogRef<any>


  constructor() { }
  ngOnInit() {
    this.userId = this.service.getsession("id");
  }

  openDialog(template: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(template, {
      width: '550px',
      panelClass: 'custom-dialog',
    })
  }

  closeModal() {
    if (this.dialogRef) {
      this.dialogRef.close()
    }
  }

  confirm(action: string) {
    if (action === 'logout') {
      this.logoutAccount()
    }

    if (action === 'delete') {
      this.deleteAccount()
    }
    this.closeModal()
  }

  // To delete the account
  deleteAccount(): void {
    const currentReviewerId = this.srv.getsession("id")
    if (!currentReviewerId || currentReviewerId === "0") {

      console.error("Cannot delete account: User not logged in")
      return
    }
    const tv: tags[] = []
    tv.push({ T: 'dk1', V: currentReviewerId })
    tv.push({ T: 'c10', V: '14' })

    this.srv.getdata("reviewer", tv).subscribe((r) => {
      this.res = r
      if (r.Status === 1) {
        this.deleteAccounts = r.Data[0]
        this.srv.openDialog("Account Deleted Successfully", "s", this.res.Info)
        if (this.dialogRef) {
          this.dialogRef.close(r)
        }
        // Logout after account deletion
        this.srv.logout()
      } else {
        this.srv.openDialog("No account found", "w", this.res.Info)
      }
    })
  }

  ConfirmDelete(): void {
    this.deleteAccount()
  }

  logoutAccount() {
    this.closeModal()
    this.srv.logout()
  }

  changePassword(): void {
    this.userId = this.srv.getsession("id")

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.srv.openDialog("Error", "w", "All fields are required")
      return
    }

    if (this.newPassword !== this.confirmPassword) {
      this.srv.openDialog("Error", "w", "New password and confirm password must match")
      return
    }

    this.tv = [
      { T: "dk1", V: this.userId },
      { T: 'c1', V: this.currentPassword },
      { T: 'c2', V: this.newPassword },
      { T: "c10", V: "11" }
    ]

    this.srv.getdata('adminuser', this.tv).subscribe((r) => {
      this.res = r
      if (r.Status === 1) {
        this.currentPassword = ''
        this.newPassword = ''
        this.confirmPassword = ''
        this.srv.openDialog("Success", "s", "Password Updated Successfully")
        this.router.navigate(['/login'])

      } else {
        this.srv.openDialog('Error', 'w', this.res.Info || 'API call failed')
      }
    })
  }



  confirmationOfPassword(): void {
    this.changePassword()
  }

  //Cancel Password Apdation
  cancelPasswordUpdation() {
    this.currentPassword = ''
    this.newPassword = ''
    this.confirmPassword = ''

  }

  goToPrivacy() {
    this.router.navigate(['privacy-policy'])
  }

  goToAbout() {
    this.router.navigate(['about'])
  }


}
