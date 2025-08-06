import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule ,ActivatedRoute} from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { HelpersService } from '../../services/helpers.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { serviceTypes,Organization,vehicleTypes,languages,iconMap } from '../../models/helper.model';
import { MatDialog } from '@angular/material/dialog';
import { Language } from '../../models/language.model';
import { KycUploadComponent } from '../../components/kyc-upload/kyc-upload.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-update-helper',
  standalone: true,
  imports: [MaterialModule, CommonModule,KycUploadComponent,RouterModule],
  templateUrl: './update-helper.component.html',
  styleUrl: './update-helper.component.scss'
})
export class UpdateHelperComponent {
  activeOption: 'details' | 'documents' = 'details';
  helperId : string | null = null;
  helperForm!: FormGroup;
  dialog = inject(MatDialog);

  uploadedPhotoUrl: string | null = null;
  selectedPhotoFile: File | null = null;
  photoText: string = 'Upload photo (.png, .jpeg) size 5 mb';
  serviceTypes: string[] = serviceTypes;
  Organization: string[] = Organization;
  vehicleTypes: string[] = vehicleTypes;
  languages: Language[] = languages;
  iconMap: {[key: string]: string} = iconMap;
  route: ActivatedRoute = inject(ActivatedRoute);
  helperService = inject(HelpersService);
  fb = inject(FormBuilder);
  toastService: ToastService = inject(ToastService)
  
  ngOnInit():void {
    this.helperId = this.route.snapshot.paramMap.get('id');
    this.helperForm = this.fb.group({
      photo: [null],
      typeOfService: ['', Validators.required],
      organizationName: ['', Validators.required],
      fullName: ['', Validators.required],
      languages: [[], Validators.required],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[+]?[91]?[0-9]{10}$|^[+]?[91]?[6-9][0-9]{9}$')]],
      email: ['', [Validators.email]],
      vehicleType: ['',Validators.required],
      kycDocument: [null,Validators.required],
      kycDocumentType: ['',Validators.required],
      additionalDocuments: [null],
      joinedOn: [new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })]
    });
    if(this.helperId){
      this.helperService.getHelperById(this.helperId)
        .subscribe((helper)=>{
          this.helperForm.patchValue(helper);
          this.uploadedPhotoUrl = this.helperForm.get('photo')?.value;
        })
    }
    
  }
  makeActive(option: 'details' | 'documents') {
    this.activeOption = option;
    
  }
  onPhotoSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
        const allowedTypes = ['image/png', 'image/jpeg'];
        if (!allowedTypes.includes(file.type)) {
          this.toastService.error('Invalid file type. Please upload a .png or .jpeg file.');
          return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5 MB
          this.toastService.error('File size exceeds 5 MB limit.');
          return;
        }
        this.selectedPhotoFile = file;
        this.uploadedPhotoUrl = URL.createObjectURL(file);
        this.photoText = file.name;
        this.helperForm.patchValue({ photo: file });
      }
    }
  
    onFileSelected(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        this.helperForm.patchValue({ additionalDocuments: target.files[0] });
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

    updateHelper() {
      const formData = new FormData();
      const formValue = this.helperForm.value;
      Object.keys(formValue).forEach(key => {
        const value = formValue[key];
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, value);
        }
      });
      if(this.helperId){
        this.helperService.updateHelper(this.helperId,formData)
          .subscribe({
            next: (response)=>{
              this.toastService.success(response.message);
            },
            error: (error)=>{
              this.toastService.error('Failed to update helper');
            }
          })
      }
      
    }

}
