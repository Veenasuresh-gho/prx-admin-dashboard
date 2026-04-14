import { ChangeDetectorRef, Component, inject, Input, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { GHOService } from '../../services/ghosrvs';
import { catchError } from 'rxjs';
import { tags, ghoresult, files } from '../../model/ghomodel'
import { CommonModule } from '@angular/common';
import { MatSelectModule } from "@angular/material/select";
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatProgressBar } from "@angular/material/progress-bar";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, MatSelectModule, MatProgressBar],
  templateUrl: './fileupload.html',
  styleUrl: './fileupload.css'
})
export class FileUploadComponent {
  constructor(private router: Router, private rt: ActivatedRoute, private cdr: ChangeDetectorRef,) { }
  @Input() docTypeID: number = 0;
  @Input() docTypes: string = "0";
  @Input() keyid: string = "0";
  @Input() subkey: string = "";
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  ds: [][] = [];
  typs: [][] = [];
  srv = inject(GHOService);

  files: files[] = [];
  isDragging = false;
  filesDB: [] = [];

  typeListId: number = 0;
  categoryID: number = 0;
  folderID: string = "";
  http = inject(HttpClient);
  inupload: boolean = false;

  async upload() {
    let successCount = 0;

    for (let i = 0; i < this.files.length; i++) {
      const success = await this.uploadFile(i);
      if (success) {
        successCount++;
      }
    }
    if (successCount > 0) {
      this.files = [];
      this.GetUploadedfiles();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['keyid']) {

      if (changes['keyid'].currentValue != undefined && changes['keyid'].currentValue !== null) {
        this.GetUploadedfiles();
      }
    }
  }

  ngOnInit(): void {
    if (this.keyid != "0") {
      this.getAllowedTypes();
      this.GetUploadedfiles();
    }
  }

  uploadFile(idx: number): Promise<boolean> {
    return new Promise((resolve) => {
      let typ = this.docTypeID || this.files[idx].doctype;

      if (!typ) {
        this.srv.openDialog("File Upload", "e", "File Type is missing");
        resolve(false);
        return;
      }

      if (!this.keyid || this.keyid === "0") {
        this.srv.openDialog("File Upload", "e", "Key missing, please contact support");
        resolve(false);
        return;
      }

      this.tv = [];
      this.tv.push({ T: "dk1", V: this.keyid });
      this.tv.push({ T: "c1", V: typ.toString() });
      this.tv.push({ T: "c2", V: this.files[idx].file.name });
      this.tv.push({ T: "c3", V: this.files[idx].file.size.toString() });
      this.tv.push({ T: "c4", V: this.categoryID.toString() });
      this.tv.push({ T: "c5", V: this.typeListId.toString() });
      this.tv.push({ T: "c6", V: this.folderID.toString() });
      this.tv.push({ T: "c10", V: "1" });

      this.srv.getdata('filemgr', this.tv).subscribe((r) => {
        this.res = r;
        if (this.res.Status == 1) {
          this.ds = this.res.Data[0];
          this.step2(this.ds[0]["id"], this.ds[0]["fid"], this.ds[0]["ftype"], idx);
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  }

  async step2(id: string, fid: string, ty: string, idx: number) {
    try {
      this.srv.awsfileuploadinfo(fid, ty).subscribe(response => {
        const rtn = response["Url"];
        this.http.put(rtn, this.files[idx].file, {
          reportProgress: true,
          observe: 'events',
          headers: { 'Content-Type': this.files[idx].file.type }
        }).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.files[idx].progress = Math.round(100 * event.loaded / event.total);
          } else if (event.type === HttpEventType.Response) {
            this.files[idx].status = 1;
            this.updatestatus(id, "2");
          }
        });
      });
    } catch (err) {
      this.updatestatus(id, "url failed to aws");
    }
  }



  del(id: any) {
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.keyid })
    this.tv.push({ T: "dk2", V: this.docTypeID.toString() })
    this.tv.push({ T: "c1", V: id })
    this.tv.push({ T: "c7", V: this.docTypes })
    this.tv.push({ T: "c10", V: "4" })
    this.srv.getdata("filemgr", this.tv).pipe
      (
        catchError((err: any) => {
          this.srv.openDialog("File Upload", "e", "Error while delete this file , please contact support");
          throw err
        })
      ).subscribe((r) => {
        this.res = r;
        if (this.res.Status == 1) {
          this.filesDB = this.res.Data[0];
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        }
      }
      );
  }

  getAllowedTypes() {
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.docTypeID.toString() })
    this.tv.push({ T: "dk2", V: this.docTypes })
    this.tv.push({ T: "c10", V: "5" })
    this.srv.getdata("filemgr", this.tv).pipe
      (
        catchError((err: any) => { throw err })
      ).subscribe((r) => {
        this.res = r;
        if (this.res.Status == 1) {
          this.typs = this.res.Data[0];
        }
      }
      );
  }

  GetUploadedfiles() {
    if (this.keyid == undefined || this.keyid == null || this.keyid == "0") {
      this.filesDB = [];
      return;
    }
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.keyid })
    this.tv.push({ T: "dk2", V: this.docTypeID.toString() })
    this.tv.push({ T: "c1", V: this.docTypes })
    this.tv.push({ T: "c10", V: "3" })
    this.srv.getdata("filemgr", this.tv).pipe
      (
        catchError((err: any) => { throw err })
      ).subscribe((r) => {
        this.res = r;
        if (this.res.Status == 1) {
          this.filesDB = this.res.Data[0];
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        }
      }
      );
  }


  updatestatus(fid: string, st: string,) {
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.keyid })
    this.tv.push({ T: "dk2", V: this.docTypeID.toString() })
    this.tv.push({ T: "c1", V: fid })
    this.tv.push({ T: "c2", V: st })
    this.tv.push({ T: "c10", V: "2" })
    this.srv.getdata("filemgr", this.tv).pipe
      (
        catchError((err: any) => { throw err })
      ).subscribe((r) => {
        this.res = r;
        if (this.res.Status == 1) {
          this.filesDB = this.res.Data[0];
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        }
      }
      );
  }


  async uploadFileToS3(id: string, url: string, idx: number) {
    const response = await fetch(url, {
      method: 'PUT',
      body: this.files[idx].file,
      headers: { 'Content-Type': this.files[idx].file.type },
    });
    if (response.ok) {
      this.updatestatus(id, "File upload sucess");
    } else {
      this.updatestatus(id, "Error");
      throw new Error('Upload failed');
    }
  } catch(err) {

    console.error('Upload error:', err);
  }

  onFileSelected(event: any): void {
    const selectedFiles = Array.from(event.target.files) as File[];

    for (let i = 0; i < selectedFiles.length; i++) {
      this.files.push({ file: selectedFiles[i], progress: -1, status: 0, doctype: this.docTypeID })
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files) {
      const droppedFiles = Array.from(event.dataTransfer.files) as File[];
      for (let i = 0; i < droppedFiles.length; i++) {
        this.files.push({ file: droppedFiles[i], progress: -1, status: 0, doctype: this.docTypeID })
      }

      //this.files.push(...droppedFiles);
    }
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
  }
}