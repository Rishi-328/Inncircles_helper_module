import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule ,ActivatedRoute} from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { HelpersService } from '../../services/helpers.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { KycUploadComponent } from '../../components/kyc-upload/kyc-upload.component';
import { ToastService } from '../../services/toast.service';
import { HelperFormComponent } from '../../components/helper-form/helper-form.component';

@Component({
  selector: 'app-update-helper',
  standalone: true,
  imports: [MaterialModule, CommonModule,KycUploadComponent,RouterModule,HelperFormComponent],
  templateUrl: './update-helper.component.html',
  styleUrl: './update-helper.component.scss'
})
export class UpdateHelperComponent {
  activeOption: 'details' | 'documents' = 'details';
  helperId : string | null = null;
  helperForm!: FormGroup;
  dialog = inject(MatDialog);
  route: ActivatedRoute = inject(ActivatedRoute);
  helperService = inject(HelpersService);
  fb = inject(FormBuilder);
  toastService: ToastService = inject(ToastService)
  uploadedPhotoUrl: string | null = null;
  
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
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.helperForm.patchValue({ additionalDocuments: target.files[0] });
    }
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
    console.log(this.helperForm.value);
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
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