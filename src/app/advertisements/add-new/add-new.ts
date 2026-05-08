import { Component, inject, Input, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
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
    MatInputModule,
    MatButton,
    MatSelectModule
  ],
  templateUrl: './add-new.html',
  styleUrl: './add-new.css',
})
export class AddNew implements OnInit {
  isSaving = false;
  isPublishing = false;
  @Input() selectedId: any;

  title = '';
  subtitle = '';
  link = '';
  contentType = 'ad';

  adDetails: any;
  userId = '';
  id = '';

  thumbnailUrl: string | ArrayBuffer | null = null;
  thumbnailFile: File | null = null;

  selectedFile: File | null = null;

  previewUrl: string | ArrayBuffer | null = null;

  isImage = false;
  isVideo = false;
  isAudio = false;

  showMediaError = false;

  srv = inject(GHOService);
  tv: tags[] = [];

  get isEditMode(): boolean {
    return !!this.adDetails;
  }

  resetForm() {
    this.title = '';
    this.subtitle = '';
    this.link = '';
    this.contentType = 'ad';

    this.thumbnailUrl = null;
    this.thumbnailFile = null;

    this.selectedFile = null;

    this.previewUrl = null;

    this.isImage = false;
    this.isVideo = false;
    this.isAudio = false;

    this.showMediaError = false;
  }

  setMediaFlags(url: any) {
    if (!url) {
      this.isImage = this.isVideo = this.isAudio = false;
      return;
    }

    const str = url.toString();

    this.isImage = /\.(jpg|jpeg|png|webp)$/i.test(str);
    this.isVideo = /\.(mp4|webm)$/i.test(str);
    this.isAudio = /\.(mp3|wav)$/i.test(str);
  }

  ngOnChanges() {

    if (!this.selectedId) {
      this.adDetails = null;
      this.resetForm();
      return;
    }

    this.tv = [
      { T: 'dk1', V: this.selectedId },
      { T: 'c10', V: '3' }
    ];

    this.srv.getdata('adminuser', this.tv).subscribe(r => {

      const data = r.Data[0]?.[0];
      this.adDetails = data;

      this.title = data?.Title || '';
      this.subtitle = data?.SubTitle || '';
      this.link = data?.RedirectURL || '';

      this.contentType = data?.Type ? 'health' : 'banner';

      this.thumbnailUrl = data?.ThumbnailUrl || null;
      this.previewUrl = data?.ContentUrl || null;

      this.setMediaFlags(this.previewUrl);
    });
  }

  ngOnInit(): void {
    const storedId = sessionStorage.getItem('id') || '';
    this.userId = storedId.replace(/^"+|"+$/g, '').trim();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

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
      alert('Only image files allowed');
      return;
    }

    this.thumbnailFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.thumbnailUrl = reader.result;
    };

    reader.readAsDataURL(file);
  }


  async save() {
    const hasFile = !!this.selectedFile || !!this.previewUrl;
    const hasLink = !!this.link?.trim();

    if (this.contentType === 'health' && !hasFile && !hasLink) {
      this.showMediaError = true;
      return;
    }

    if (this.contentType === 'banner' && !hasFile && !hasLink) {
      this.showMediaError = true;
      return;
    }

    this.showMediaError = false;
    this.isSaving = true;

    const payload = {
      Title: this.title,
      SubTitle: this.subtitle,
      IsHealthInsight: this.contentType === 'health' ? 1 : 0,
      IsInternal: hasLink ? 0 : 1,
      RedirectURL: hasLink ? this.link : '',
      IsActive: 0
    };

    this.tv = [
      { T: 'c1', V: JSON.stringify(payload) },
      { T: 'c10', V: '1' }
    ];

    this.srv.getdata('adminuser', this.tv).subscribe({
      next: async (r) => {
        if (r.Status === 1) {
          const id = r.Data[0]?.[0]?.id;

          if (this.selectedFile) {
            const typeCode = this.contentType === 'health' ? '54' : '52';
            await this.srv.handleFileUpload(id, this.userId, this.selectedFile, typeCode);
          }

          if (this.contentType === 'health' && this.thumbnailFile) {
            await this.srv.handleFileUpload(id, this.userId, this.thumbnailFile, '53');
          }

          this.srv.openDialog('Success', 's', 'Advertisement created');
          this.resetForm();
        }

        this.isSaving = false;
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }

  publish() {
    this.isPublishing = true;

    this.tv = [
      { T: 'dk1', V: this.adDetails?.AdID },
      { T: 'c10', V: '5' }
    ];

    this.srv.getdata('adminuser', this.tv).subscribe({

      next: async (r) => {
        if (r.Status === 1) {
          this.srv.openDialog('Success', 's', 'Advertisement Published ');
        }

        this.isPublishing = false;
      },

    });

  }

  async update() {
    const hasLink = !!this.link?.trim();

    this.isSaving = true;

    const payload = {
      Title: this.title,
      SubTitle: this.subtitle,
      IsHealthInsight: this.contentType === 'health' ? 1 : 0,
      IsInternal: hasLink ? 0 : 1,
      RedirectURL: hasLink ? this.link : '',
      IsActive: this.adDetails?.IsActive ?? 0
    };

    this.tv = [
      { T: 'dk1', V: this.adDetails?.AdID },
      { T: 'c1', V: JSON.stringify(payload) },
      { T: 'c10', V: '2' }
    ];

    this.srv.getdata('adminuser', this.tv).subscribe({
      next: async (r) => {
        if (r.Status === 1) {
          const id = this.adDetails?.AdID;

          if (this.selectedFile) {
            const typeCode = this.contentType === 'health' ? '54' : '52';
            await this.srv.handleFileUpload(id, this.userId, this.selectedFile, typeCode);
          }

          if (this.thumbnailFile && this.contentType === 'health') {
            await this.srv.handleFileUpload(id, this.userId, this.thumbnailFile, '53');
          }

          this.srv.openDialog('Updated', 's', 'Advertisement updated');
        }

        this.isSaving = false;
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }
}