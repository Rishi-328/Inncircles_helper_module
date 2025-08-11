import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-additional-form',
  standalone: true,
  imports: [CommonModule,MaterialModule],
  templateUrl: './additional-form.component.html',
  styleUrl: './additional-form.component.scss'
})
export class AdditionalFormComponent {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @Input() helperForm!: FormGroup;
  @Input() useCase: 'add-helper' | 'update-helper' = 'add-helper';
  @Output() formUpdate = new EventEmitter<void>();
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.helperForm.patchValue({ additionalDocuments: target.files[0] });
    }
  }
  updateHelper() {
    this.formUpdate.emit();
  }

}
