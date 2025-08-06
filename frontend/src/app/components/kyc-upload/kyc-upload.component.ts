import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import {MatDialogRef} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-kyc-upload',
  standalone: true,
  imports: [MaterialModule,CommonModule],
  templateUrl: './kyc-upload.component.html',
  styleUrl: './kyc-upload.component.scss'
})
export class KycUploadComponent {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  documentTypes = ['Aadhaar', 'PAN Card', 'Passport', 'Driving License'];
  documentType: string | null = null;
  uploadedFile: File | null = null;

  private dialogRef = inject(MatDialogRef<KycUploadComponent>);
  private toast = inject(ToastService);

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
    if (file && file.type === 'application/pdf') {
      this.uploadedFile = file;
    }else{
      this.toast.error('Upload pdf file')
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length && event.dataTransfer.files[0].type === 'application/pdf') {
      this.uploadedFile = event.dataTransfer.files[0];
    }else{
      this.toast.error('Upload pdf file')
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  removeFile() {
    this.uploadedFile = null;
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.uploadedFile && this.documentType) {
      this.dialogRef.close({
        file: this.uploadedFile,
        type: this.documentType
      });
    }
  }
}