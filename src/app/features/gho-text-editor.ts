import { NgxEditorComponent, NgxEditorMenuComponent, Editor, Toolbar, NgxEditorModule } from 'ngx-editor';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'gho-texteditor',
  template: `<div class="NgxEditor__Wrapper">
            <table class="w100" ><tr> 
              @if(enablesave){
                <td class="pr20 p10 " style="width:150px !important;"> 
                   <button class="w100" (click)="savetext()" matButton="outlined"> <i class="bi bi-save  fs-5 pointer"></i> Save </button>
              </td>
              }
              
            <td ><ngx-editor-menu [editor]="editor"  [toolbar]="tb"> </ngx-editor-menu></td></tr></table>
            <ngx-editor
                [editor]="editor"
                [(ngModel)]=dataIn
                [disabled]="false"
                (ngModelChange)="onEditorChange($event)"
                [placeholder]="'Type here...'" 
            ></ngx-editor>
            </div>`,
  standalone: true,
  imports: [NgxEditorComponent, NgxEditorMenuComponent, FormsModule, MatButtonModule],
})

export class GHOTextEditor implements OnInit, OnDestroy {
  @Input() dataIn: string = "";
  @Output() dataOut = new EventEmitter<string | null>();
  @Output() dataChange = new EventEmitter<string | null>();

  editor: Editor;
  ngOnInit(): void {
    this.editor = new Editor();
  }
  enablesave:boolean = false
  tb: any = [
    ['bold', 'italic', 'underline', 'strike', 'code'],
    ['paragraph', 'heading', 'blockquote', 'code_block'],
    ['bullet_list', 'ordered_list', 'task_list'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['link', 'horizontal_rule'],
    ['clear_format'],
    ['undo', 'redo'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    
  ];

  onEditorChange(e:any)
  {
    this.dataChange.emit(this.dataIn);
  }
  savetext() {
    this.dataOut.emit(this.dataIn);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

}