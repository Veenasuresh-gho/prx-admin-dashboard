// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-add-new',
//   imports: [],
//   templateUrl: './add-new.html',
//   styleUrl: './add-new.css',
// })
// export class AddNew {

// }
import { Component, inject, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { GHOService } from '../../services/ghosrvs';
import { tags } from '../../model/ghomodel';

@Component({
  selector: 'add-new',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatLabel,
    MatInputModule,
    MatButton,
    MatSelectModule
  ],
  templateUrl: './add-new.html',
  styleUrl: './add-new.css',
})
export class AddNew implements OnInit {

  title: string = '';
  subtitle: string = '';
  link: string = '';
  contentType: string = 'ad';
  userId: string = '';
  id:string='';
  thumbnailUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  previewUrl: string | ArrayBuffer | null = null;
  isImage = false;
  isVideo = false;
  isAudio = false;
  showMediaError = false;

  srv = inject(GHOService);
  tv: tags[] = [];

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('id') || '';

  }

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  this.selectedFile = file; // ✅ STORE FILE

  const reader = new FileReader();

  reader.onload = () => {
    this.previewUrl = reader.result;

    this.isImage = file.type.startsWith('image/');
    this.isVideo = file.type.startsWith('video/');
    this.isAudio = file.type.startsWith('audio/');
  };

  reader.readAsDataURL(file);
}

  onThumbnailSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed for thumbnail');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.thumbnailUrl = reader.result;
    };

    reader.readAsDataURL(file);
  }
 save() {

  const hasLink = !!this.link?.trim();
  const hasFile = !!this.selectedFile;

  if (!hasLink && !hasFile) {
    this.showMediaError = true;
    return;
  }

  this.showMediaError = false;

  const payload = {
    Title: this.title,
    Subtitle: this.subtitle,
    IsHealthInsight: this.contentType === 'health' ? 1 : 0,
    IsInternal: hasLink ? 1 : 0,
    RedirectURL: hasLink ? this.link : ''
  };

  this.tv = [
    { T: 'c1', V: JSON.stringify(payload) },
    { T: 'c10', V: '1' }
  ];

  this.srv.getdata('adminuser', this.tv).subscribe({

    next: async (r) => { 

      if (r.Status === 1) {

        const data = r.Data[0]?.[0];
        this.id = data?.id;

        if (this.selectedFile) {

          const success = await this.srv.handleFileUpload(
            this.id,
            this.userId,
            this.selectedFile, // ✅ PASS FILE
            '52'
          );

          console.log('Upload success:', success);
        }

      }
    }

  });
}
}