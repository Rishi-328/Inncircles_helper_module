import { Component ,Input, Output, EventEmitter, inject} from '@angular/core';
import { Language } from '../../models/language.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { KycUploadComponent } from '../kyc-upload/kyc-upload.component';
import { ToastService } from '../../services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { HelpersService } from '../../services/helpers.service';
import { serviceTypes, Organization, vehicleTypes, languages, iconMap } from '../../models/helper.model'; 
@Component({
  selector: 'app-helper-form',
  standalone: true,
  imports: [CommonModule,MaterialModule,KycUploadComponent],
  templateUrl: './helper-form.component.html',
  styleUrl: './helper-form.component.scss'
})
export class HelperFormComponent {
  @Input() helperForm!: FormGroup;
  @Input() useCase: 'add-helper' | 'update-helper' =  'add-helper';
  @Output() formEdit = new EventEmitter<void>();
  dialog = inject(MatDialog);
  @Input() uploadedPhotoUrl: string | null = null;
  selectedPhotoFile: File | null = null;
  photoText: string = 'Upload photo (.png, .jpeg) size 5 mb';
  serviceTypes: string[] = serviceTypes;
  Organization: string[] = Organization;
  vehicleTypes: string[] = vehicleTypes;
  languages: Language[] = languages;
  iconMap: {[key: string]: string} = iconMap;

  constructor(private fb: FormBuilder,
      private toastService: ToastService,
      private helperService : HelpersService,
  ) {}

  getPhotoUrl(): boolean{
    return this.uploadedPhotoUrl = this.helperForm.get('photo')?.value;
  }
  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        this.toastService.error('Invalid file type. Please upload a .png or .jpeg file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { 
        this.toastService.error('File size exceeds 5 MB limit.');
        return;
      }
      this.selectedPhotoFile = file;
      this.uploadedPhotoUrl = URL.createObjectURL(file);
      this.photoText = file.name;
      this.helperForm.patchValue({ photo: file });
    }
  }
  displayText(): string {
    const selectedValues = this.helperForm.get('languages')?.value || [];
    
    if (selectedValues.length === 0) {
      return 'Select Languages';
    }
    
    if (selectedValues.length === 1) {
      const selectedLanguage = this.languages.find(lang => lang.value === selectedValues[0]);
      return selectedLanguage?.label || '';
    }
    
    const firstSelected = this.languages.find(lang => lang.value === selectedValues[0]);
    const additionalCount = selectedValues.length - 1;
    
    return `${firstSelected?.label} +${additionalCount}`;
  }

  isAllSelected(): boolean {
    const selectedValues = this.helperForm.get('languages')?.value || [];
    return selectedValues.length === this.languages.length;
  }

  isIndeterminate(): boolean {
    const selectedValues = this.helperForm.get('languages')?.value || [];
    return selectedValues.length > 0 && selectedValues.length < this.languages.length;
  }

  toggleAllSelection(): void {
    if (this.isAllSelected()) {
      this.helperForm.patchValue({ languages: [] });
    } else {
      const allLanguageValues = this.languages.map(lang => lang.value);
      this.helperForm.patchValue({ languages: allLanguageValues });
    }
  }

  openKycDialog(): void {
    const dialogRef = this.dialog.open(KycUploadComponent, {
      width: '500px',
    });   
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.helperForm.patchValue({ kycDocument: result.file});
        this.helperForm.patchValue({ kycDocumentType: result.type });
      }
    });
  }
  onUpdate(){
    this.formEdit.emit();
  }
  ngOnInit(): void {
    if (this.useCase === 'update-helper') {
      this.uploadedPhotoUrl = this.helperForm.get('photo')?.value;
    }
  }
}

